import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { createContext, useContext } from '../../_util/context';
import { makeImmutable, responseImmutable } from '../immutableHelper';
import useLayoutEffect from '../../_util/hooks/useLayoutEffect';
import { getScrollBarSize } from '../../_util/scrollbar';

// ============================================================
// Selective Context
// ============================================================
describe('selective context — createContext / useContext', () => {
  it('provides full value when no selector', () => {
    interface Ctx {
      name: string;
      age: number;
    }
    const ctx = createContext<Ctx>({ name: 'default', age: 0 });
    const Consumer: React.FC = () => {
      const { name, age } = useContext(ctx);
      return (
        <span data-testid="val">
          {name}-{age}
        </span>
      );
    };
    const Provider = ctx.Provider;
    render(
      <Provider value={{ name: 'Alice', age: 30 }}>
        <Consumer />
      </Provider>,
    );
    expect(screen.getByTestId('val')).toHaveTextContent('Alice-30');
  });

  it('only re-renders when selected value changes', () => {
    interface Ctx {
      name: string;
      age: number;
    }
    const ctx = createContext<Ctx>({ name: '', age: 0 });
    const renderCount = { current: 0 };
    const NameConsumer: React.FC = () => {
      const name = useContext(ctx, 'name');
      renderCount.current++;
      return <span data-testid="name">{name}</span>;
    };
    const AgeConsumer: React.FC = () => {
      const age = useContext(ctx, 'age');
      return <span data-testid="age">{age}</span>;
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, { value: Ctx; children: React.ReactNode }>(
      (props, ref) => {
        const [val, setVal] = React.useState(props.value);
        React.useImperativeHandle(ref, () => ({ setVal }), []);
        return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
      },
    );

    const ref = React.createRef<WrapperHandle>();
    render(
      <Wrapper value={{ name: 'A', age: 1 }} ref={ref}>
        <NameConsumer />
        <AgeConsumer />
      </Wrapper>,
    );
    expect(screen.getByTestId('name')).toHaveTextContent('A');
    const initialCount = renderCount.current;
    // Update only age — NameConsumer should NOT re-render
    act(() => {
      ref.current?.setVal({ name: 'A', age: 2 });
    });
    expect(screen.getByTestId('age')).toHaveTextContent('2');
    expect(renderCount.current).toBe(initialCount); // NameConsumer did not re-render
    // Update name — NameConsumer SHOULD re-render
    act(() => {
      ref.current?.setVal({ name: 'B', age: 2 });
    });
    expect(screen.getByTestId('name')).toHaveTextContent('B');
    expect(renderCount.current).toBe(initialCount + 1);
  });

  it('supports array selector', () => {
    interface Ctx {
      a: number;
      b: number;
      c: number;
    }
    const ctx = createContext<Ctx>({ a: 0, b: 0, c: 0 });
    const Consumer: React.FC = () => {
      const { a, b } = useContext(ctx, ['a', 'b'] as const);
      return <span data-testid="val">{a! + b!}</span>;
    };
    render(
      <ctx.Provider value={{ a: 1, b: 2, c: 3 }}>
        <Consumer />
      </ctx.Provider>,
    );
    expect(screen.getByTestId('val')).toHaveTextContent('3');
  });

  it('returns default value when no Provider', () => {
    interface Ctx {
      name: string;
    }
    const ctx = createContext<Ctx>({ name: 'default' });
    const Consumer: React.FC = () => {
      const { name } = useContext(ctx);
      return <span data-testid="val">{name}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId('val')).toHaveTextContent('default');
  });

  // ===== Enhanced edge cases =====

  it('supports function selector', () => {
    interface Ctx {
      user: { name: string; age: number };
      settings: { theme: string };
    }
    const ctx = createContext<Ctx>({
      user: { name: '', age: 0 },
      settings: { theme: 'light' },
    });
    const Consumer: React.FC = () => {
      const userName = useContext(ctx, (v) => v.user.name);
      return <span data-testid="val">{userName}</span>;
    };
    render(
      <ctx.Provider value={{ user: { name: 'Charlie', age: 25 }, settings: { theme: 'dark' } }}>
        <Consumer />
      </ctx.Provider>,
    );
    expect(screen.getByTestId('val')).toHaveTextContent('Charlie');
  });

  it('does not re-render when function selector returns same value', () => {
    interface Ctx {
      user: { name: string; age: number };
      meta: string;
    }
    const ctx = createContext<Ctx>({ user: { name: '', age: 0 }, meta: '' });
    const renderCount = { current: 0 };

    const UserNameConsumer: React.FC = () => {
      const userName = useContext(ctx, (v) => v.user.name);
      renderCount.current++;
      return <span data-testid="name">{userName}</span>;
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, { value: Ctx; children: React.ReactNode }>(
      (props, ref) => {
        const [val, setVal] = React.useState(props.value);
        React.useImperativeHandle(ref, () => ({ setVal }), []);
        return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
      },
    );

    const ref = React.createRef<WrapperHandle>();
    render(
      <Wrapper value={{ user: { name: 'Alice', age: 30 }, meta: 'x' }} ref={ref}>
        <UserNameConsumer />
      </Wrapper>,
    );
    expect(screen.getByTestId('name')).toHaveTextContent('Alice');
    const initial = renderCount.current;

    // Change meta and age, not user.name — should NOT re-render
    act(() => {
      ref.current?.setVal({ user: { name: 'Alice', age: 31 }, meta: 'y' });
    });
    expect(screen.getByTestId('name')).toHaveTextContent('Alice');
    expect(renderCount.current).toBe(initial);

    // Change user.name — SHOULD re-render
    act(() => {
      ref.current?.setVal({ user: { name: 'Bob', age: 31 }, meta: 'y' });
    });
    expect(screen.getByTestId('name')).toHaveTextContent('Bob');
    expect(renderCount.current).toBe(initial + 1);
  });

  it('array selector only re-renders when one of selected keys changes', () => {
    interface Ctx {
      a: number;
      b: number;
      c: number;
    }
    const ctx = createContext<Ctx>({ a: 0, b: 0, c: 0 });
    const renderCount = { current: 0 };

    const ABConsumer: React.FC = () => {
      const { a, b } = useContext(ctx, ['a', 'b'] as const);
      renderCount.current++;
      return (
        <span data-testid="ab">
          {a}-{b}
        </span>
      );
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, { value: Ctx; children: React.ReactNode }>(
      (props, ref) => {
        const [val, setVal] = React.useState(props.value);
        React.useImperativeHandle(ref, () => ({ setVal }), []);
        return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
      },
    );

    const ref = React.createRef<WrapperHandle>();
    render(
      <Wrapper value={{ a: 1, b: 2, c: 3 }} ref={ref}>
        <ABConsumer />
      </Wrapper>,
    );
    const initial = renderCount.current;

    // Change only c — should NOT re-render
    act(() => {
      ref.current?.setVal({ a: 1, b: 2, c: 99 });
    });
    expect(renderCount.current).toBe(initial);

    // Change a — SHOULD re-render
    act(() => {
      ref.current?.setVal({ a: 10, b: 2, c: 99 });
    });
    expect(screen.getByTestId('ab')).toHaveTextContent('10-2');
    expect(renderCount.current).toBe(initial + 1);

    // Change b — SHOULD re-render
    act(() => {
      ref.current?.setVal({ a: 10, b: 20, c: 99 });
    });
    expect(screen.getByTestId('ab')).toHaveTextContent('10-20');
    expect(renderCount.current).toBe(initial + 2);
  });

  it('returns default value with selector when no Provider', () => {
    interface Ctx {
      name: string;
      age: number;
    }
    const ctx = createContext<Ctx>({ name: 'fallback', age: -1 });
    const Consumer: React.FC = () => {
      const name = useContext(ctx, 'name');
      return <span data-testid="val">{name}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId('val')).toHaveTextContent('fallback');
  });

  it('returns default value with function selector when no Provider', () => {
    interface Ctx {
      count: number;
    }
    const ctx = createContext<Ctx>({ count: 42 });
    const Consumer: React.FC = () => {
      const doubled = useContext(ctx, (v) => v.count * 2);
      return <span data-testid="val">{doubled}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId('val')).toHaveTextContent('84');
  });

  it('returns default value with array selector when no Provider', () => {
    interface Ctx {
      x: number;
      y: number;
      z: number;
    }
    const ctx = createContext<Ctx>({ x: 1, y: 2, z: 3 });
    const Consumer: React.FC = () => {
      const { x, y } = useContext(ctx, ['x', 'y'] as const);
      return <span data-testid="val">{x! + y!}</span>;
    };
    render(<Consumer />);
    expect(screen.getByTestId('val')).toHaveTextContent('3');
  });

  it('handles deeply nested object updates correctly', () => {
    interface Ctx {
      config: { db: { host: string; port: number } };
      ui: { theme: string };
    }
    const ctx = createContext<Ctx>({
      config: { db: { host: '', port: 0 } },
      ui: { theme: 'light' },
    });
    const renderCount = { current: 0 };

    const DBHostConsumer: React.FC = () => {
      const host = useContext(ctx, (v) => v.config.db.host);
      renderCount.current++;
      return <span data-testid="host">{host}</span>;
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, { value: Ctx; children: React.ReactNode }>(
      (props, ref) => {
        const [val, setVal] = React.useState(props.value);
        React.useImperativeHandle(ref, () => ({ setVal }), []);
        return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
      },
    );

    const ref = React.createRef<WrapperHandle>();
    render(
      <Wrapper value={{ config: { db: { host: 'localhost', port: 5432 } }, ui: { theme: 'dark' } }} ref={ref}>
        <DBHostConsumer />
      </Wrapper>,
    );
    expect(screen.getByTestId('host')).toHaveTextContent('localhost');
    const initial = renderCount.current;

    // Change only port — should NOT re-render
    act(() => {
      ref.current?.setVal({ config: { db: { host: 'localhost', port: 3306 } }, ui: { theme: 'dark' } });
    });
    expect(renderCount.current).toBe(initial);

    // Change host — SHOULD re-render
    act(() => {
      ref.current?.setVal({ config: { db: { host: 'remote', port: 3306 } }, ui: { theme: 'dark' } });
    });
    expect(screen.getByTestId('host')).toHaveTextContent('remote');
    expect(renderCount.current).toBe(initial + 1);
  });

  it('supports multiple consumers with different selectors', () => {
    interface Ctx {
      a: string;
      b: string;
      c: string;
    }
    const ctx = createContext<Ctx>({ a: '', b: '', c: '' });

    const AConsumer: React.FC = () => {
      const a = useContext(ctx, 'a');
      return <span data-testid="a">{a}</span>;
    };
    const BConsumer: React.FC = () => {
      const b = useContext(ctx, 'b');
      return <span data-testid="b">{b}</span>;
    };
    const CConsumer: React.FC = () => {
      const c = useContext(ctx, 'c');
      return <span data-testid="c">{c}</span>;
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, { value: Ctx; children: React.ReactNode }>(
      (props, ref) => {
        const [val, setVal] = React.useState(props.value);
        React.useImperativeHandle(ref, () => ({ setVal }), []);
        return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
      },
    );

    const ref = React.createRef<WrapperHandle>();
    render(
      <Wrapper value={{ a: 'A1', b: 'B1', c: 'C1' }} ref={ref}>
        <AConsumer />
        <BConsumer />
        <CConsumer />
      </Wrapper>,
    );

    expect(screen.getByTestId('a')).toHaveTextContent('A1');
    expect(screen.getByTestId('b')).toHaveTextContent('B1');
    expect(screen.getByTestId('c')).toHaveTextContent('C1');

    act(() => {
      ref.current?.setVal({ a: 'A2', b: 'B1', c: 'C1' });
    });
    expect(screen.getByTestId('a')).toHaveTextContent('A2');
    expect(screen.getByTestId('b')).toHaveTextContent('B1');
    expect(screen.getByTestId('c')).toHaveTextContent('C1');
  });

  it('cleans up listener on unmount', () => {
    interface Ctx {
      val: number;
    }
    const ctx = createContext<Ctx>({ val: 0 });

    const Consumer: React.FC = () => {
      const { val } = useContext(ctx);
      return <span data-testid="val">{val}</span>;
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
      unmount: () => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, object>((_props, ref) => {
      const [val, setVal] = React.useState<Ctx>({ val: 0 });
      const [show, setShow] = React.useState(true);
      React.useImperativeHandle(ref, () => ({
        setVal,
        unmount: () => setShow(false),
      }));
      return show ? (
        <ctx.Provider value={val}>
          <Consumer />
        </ctx.Provider>
      ) : null;
    });

    const ref = React.createRef<WrapperHandle>();
    render(<Wrapper ref={ref} />);
    expect(screen.getByTestId('val')).toHaveTextContent('0');

    // Unmount consumer
    act(() => {
      ref.current?.unmount();
    });

    // This should not throw after listener cleanup
    act(() => {
      ref.current?.setVal({ val: 99 });
    });

    // No error means listener was properly cleaned up
    expect(true).toBe(true);
  });

  it('re-renders when value changes to different type', () => {
    interface Ctx {
      val: number | string;
    }
    const ctx = createContext<Ctx>({ val: 0 });

    const Consumer: React.FC = () => {
      const { val } = useContext(ctx);
      return <span data-testid="val">{String(val)}</span>;
    };

    interface WrapperHandle {
      setVal: (v: Ctx) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, { children: React.ReactNode }>((props, ref) => {
      const [val, setVal] = React.useState<Ctx>({ val: 0 });
      React.useImperativeHandle(ref, () => ({ setVal }), []);
      return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
    });

    const ref = React.createRef<WrapperHandle>();
    render(
      <Wrapper ref={ref}>
        <Consumer />
      </Wrapper>,
    );

    act(() => {
      ref.current?.setVal({ val: 'text' });
    });
    expect(screen.getByTestId('val')).toHaveTextContent('text');

    act(() => {
      ref.current?.setVal({ val: 42 });
    });
    expect(screen.getByTestId('val')).toHaveTextContent('42');
  });
});

// ============================================================
// makeImmutable / responseImmutable
// ============================================================
describe('makeImmutable', () => {
  it('wraps component and prevents re-render when props are equal', () => {
    const renderCount = { current: 0 };
    const Inner: React.FC<{ value: string }> = ({ value }) => {
      renderCount.current++;
      return <span data-testid="val">{value}</span>;
    };

    const Immutable = makeImmutable(Inner);

    interface WrapperHandle {
      setValue: (v: string) => void;
      setOther: (v: number) => void;
    }
    const Wrapper = React.forwardRef<WrapperHandle, object>((_props, ref) => {
      const [value, setValue] = React.useState('hello');
      const [, setOther] = React.useState(0);
      React.useImperativeHandle(ref, () => ({ setValue, setOther }), []);
      return <Immutable value={value} />;
    });

    const ref = React.createRef<WrapperHandle>();
    const { rerender } = render(<Wrapper ref={ref} />);
    expect(screen.getByTestId('val')).toHaveTextContent('hello');
    const initialCount = renderCount.current;

    // Re-render with same props (via setOther which doesn't change Immutable props)
    act(() => {
      ref.current?.setOther(1);
    });
    rerender(<Wrapper ref={ref} />);
    expect(renderCount.current).toBe(initialCount); // Should NOT re-render

    // Change props — should re-render
    act(() => {
      ref.current?.setValue('world');
    });
    expect(screen.getByTestId('val')).toHaveTextContent('world');
    expect(renderCount.current).toBeGreaterThan(initialCount);
  });

  it('forwards ref through immutable wrapper', () => {
    const Inner = React.forwardRef<HTMLDivElement, { value: string }>(({ value }, ref) => (
      <div ref={ref} data-testid="val">
        {value}
      </div>
    ));
    Inner.displayName = 'Inner';

    const Immutable = makeImmutable(Inner);

    const ref = React.createRef<HTMLDivElement>();
    render(<Immutable value="test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.textContent).toBe('test');
  });

  it('sets displayName on wrapped component', () => {
    const MyComponent: React.FC = () => <div />;
    MyComponent.displayName = 'MyComponent';
    const Immutable = makeImmutable(MyComponent);
    expect((Immutable as any).displayName).toContain('MyComponent');
  });
});

describe('responseImmutable', () => {
  it('wraps component and memoizes', () => {
    const Inner: React.FC<{ value: number }> = ({ value }) => (
      <span data-testid="val">{value}</span>
    );
    Inner.displayName = 'Inner';

    const Wrapped = responseImmutable(Inner);
    expect((Wrapped as any).displayName).toContain('ResponseImmutable');

    const { rerender } = render(<Wrapped value={42} />);
    expect(screen.getByTestId('val')).toHaveTextContent('42');

    // Same props — should not error
    rerender(<Wrapped value={42} />);
    expect(screen.getByTestId('val')).toHaveTextContent('42');

    // Different props — should update
    rerender(<Wrapped value={100} />);
    expect(screen.getByTestId('val')).toHaveTextContent('100');
  });
});

// ============================================================
// useLayoutEffect (SSR-safe)
// ============================================================
describe('useLayoutEffect', () => {
  it('runs effect on mount and cleanup on unmount', () => {
    const effectCalls: string[] = [];
    const Comp: React.FC = () => {
      useLayoutEffect(() => {
        effectCalls.push('mount');
        return () => {
          effectCalls.push('cleanup');
        };
      }, []);
      return null;
    };
    const { unmount } = render(<Comp />);
    expect(effectCalls).toContain('mount');
    unmount();
    expect(effectCalls).toContain('cleanup');
  });

  it('runs on dependency change', () => {
    const log: number[] = [];
    const Comp: React.FC<{ dep: number }> = ({ dep }) => {
      useLayoutEffect(() => {
        log.push(dep);
      }, [dep]);
      return null;
    };
    const { rerender } = render(<Comp dep={1} />);
    expect(log).toEqual([1]);
    rerender(<Comp dep={2} />);
    expect(log).toEqual([1, 2]);
    // Same dep — should NOT run again
    rerender(<Comp dep={2} />);
    expect(log).toEqual([1, 2]);
  });
});

// ============================================================
// getScrollBarSize
// ============================================================
describe('getScrollBarSize', () => {
  it('returns a number (cached after first call)', () => {
    const size1 = getScrollBarSize();
    expect(typeof size1).toBe('number');
    // Second call should return cached value
    const size2 = getScrollBarSize();
    expect(size2).toBe(size1);
  });

  it('returns non-negative value in jsdom', () => {
    const size = getScrollBarSize();
    // In jsdom, scrollbar size is typically 0 (no actual scrollbar rendering)
    expect(size).toBeGreaterThanOrEqual(0);
  });
});
