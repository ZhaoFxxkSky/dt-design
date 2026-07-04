import fs from 'fs';
import path from 'path';
import React, { act as reactAct } from 'react';
import { fireEvent, render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Splitter from '..';

jest.mock('resize-observer-polyfill', () => {
    return class ResizeObserver {
        callback: any;
        constructor(callback: any) {
            this.callback = callback;
        }
        observe(target: HTMLElement) {
            if (!(global as any).__mockSplitterResize__) {
                return;
            }
            Promise.resolve().then(() => {
                Object.defineProperty(target, 'offsetWidth', { value: 1000, configurable: true });
                Object.defineProperty(target, 'offsetHeight', { value: 200, configurable: true });
                target.getBoundingClientRect = () => ({
                    width: 1000,
                    height: 200,
                    top: 0,
                    left: 0,
                    right: 1000,
                    bottom: 200,
                    x: 0,
                    y: 0,
                    toJSON: () => { },
                });
                this.callback([{ target }], this);
            });
        }
        unobserve() { }
        disconnect() { }
    };
});

describe('Splitter', () => {
    it('renders panels and separator', () => {
        const { container } = render(
            <Splitter>
                <Splitter.Panel defaultSize="30%">left</Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        expect(container.querySelector('.ant-splitter')).toBeInTheDocument();
        expect(container.querySelectorAll('.ant-splitter-panel')).toHaveLength(2);
        expect(container.querySelectorAll('.ant-splitter-bar')).toHaveLength(1);
    });

    it('sets aria attributes on separator', () => {
        const { container } = render(
            <Splitter>
                <Splitter.Panel defaultSize="30%">left</Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        const bar = container.querySelector('.ant-splitter-bar');
        expect(bar).toHaveAttribute('role', 'separator');
        expect(bar).toHaveAttribute('tabindex', '0');
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin');
        expect(bar).toHaveAttribute('aria-valuemax');
        expect(bar).toHaveAttribute('aria-controls');
    });

    it('links aria-controls to panel ids', () => {
        const { container } = render(
            <Splitter>
                <Splitter.Panel id="panel-a" defaultSize="30%">
                    left
                </Splitter.Panel>
                <Splitter.Panel id="panel-b">right</Splitter.Panel>
            </Splitter>,
        );

        const bar = container.querySelector('.ant-splitter-bar');
        expect(bar).toHaveAttribute('aria-controls', 'panel-a panel-b');
        expect(container.querySelector('#panel-a')).toBeInTheDocument();
        expect(container.querySelector('#panel-b')).toBeInTheDocument();
    });

    it('calls onResizeStart and onResizeEnd on mouse drag', () => {
        const onResizeStart = jest.fn();
        const onResizeEnd = jest.fn();
        const { container } = render(
            <Splitter onResizeStart={onResizeStart} onResizeEnd={onResizeEnd}>
                <Splitter.Panel defaultSize="30%">left</Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        const dragger = container.querySelector('.ant-splitter-bar-dragger');
        expect(dragger).toBeTruthy();

        fireEvent.mouseDown(dragger!, { pageX: 100, pageY: 100 });
        expect(onResizeStart).toHaveBeenCalledTimes(1);

        fireEvent.mouseMove(window, { pageX: 120, pageY: 100 });
        fireEvent.mouseUp(window);
        expect(onResizeEnd).toHaveBeenCalledTimes(1);
    });

    it('adjusts size with keyboard arrows', () => {
        const onResize = jest.fn();
        const { container } = render(
            <Splitter onResize={onResize}>
                <Splitter.Panel defaultSize="30%">left</Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        const bar = container.querySelector('.ant-splitter-bar');
        fireEvent.keyDown(bar!, { key: 'ArrowRight' });
        expect(onResize).toHaveBeenCalled();
    });

    it('does not allow keyboard control when disabled', () => {
        const onResize = jest.fn();
        const { container } = render(
            <Splitter onResize={onResize}>
                <Splitter.Panel resizable={false} size={100}>
                    fixed
                </Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        const bar = container.querySelector('.ant-splitter-bar');
        expect(bar).toHaveAttribute('tabindex', '-1');
    });

    it('recalculates uncontrolled panel size when a controlled size exists', () => {
        const { container } = render(
            <Splitter onResize={jest.fn()}>
                <Splitter.Panel size="30%">left</Splitter.Panel>
                <Splitter.Panel defaultSize="50%">right</Splitter.Panel>
            </Splitter>,
        );

        const panels = container.querySelectorAll('.ant-splitter-panel');
        expect(panels[0]).toHaveStyle({ flexBasis: '30%' });
        // The uncontrolled panel should be auto-filled, not stick to defaultSize
        expect(panels[1]).toHaveStyle({ flexBasis: 'auto' });
    });

    it('does not add unexpected horizontal padding on panels', () => {
        const stylePath = path.resolve(__dirname, '../style/index.less');
        const lessContent = fs.readFileSync(stylePath, 'utf-8');
        expect(lessContent).not.toContain('padding: 0 1px');
    });

    it('unmounts panel content when destroyOnHidden is true and collapsed', async () => {
        (global as any).__mockSplitterResize__ = true;
        try {
            const { container, queryByText } = render(
                <Splitter>
                    <Splitter.Panel collapsible destroyOnHidden>
                        content
                    </Splitter.Panel>
                    <Splitter.Panel>right</Splitter.Panel>
                </Splitter>,
            );

            await reactAct(async () => {
                await Promise.resolve();
            });

            expect(queryByText('content')).toBeInTheDocument();

            const collapseBar = container.querySelector('.ant-splitter-bar-collapse-bar-start');
            expect(collapseBar).toBeTruthy();
            fireEvent.click(collapseBar!);

            expect(queryByText('content')).not.toBeInTheDocument();
        } finally {
            (global as any).__mockSplitterResize__ = false;
        }
    });

    it('keeps panel content when destroyOnHidden is false', async () => {
        (global as any).__mockSplitterResize__ = true;
        try {
            const { container, queryByText } = render(
                <Splitter>
                    <Splitter.Panel collapsible>content</Splitter.Panel>
                    <Splitter.Panel>right</Splitter.Panel>
                </Splitter>,
            );

            await reactAct(async () => {
                await Promise.resolve();
            });

            const collapseBar = container.querySelector('.ant-splitter-bar-collapse-bar-start');
            expect(collapseBar).toBeTruthy();
            fireEvent.click(collapseBar!);

            expect(queryByText('content')).toBeInTheDocument();
        } finally {
            (global as any).__mockSplitterResize__ = false;
        }
    });

    it('renders custom dragger icon', async () => {
        (global as any).__mockSplitterResize__ = true;
        try {
            const { container } = render(
                <Splitter draggerIcon={<span data-testid="custom-dragger" />}>
                    <Splitter.Panel>left</Splitter.Panel>
                    <Splitter.Panel>right</Splitter.Panel>
                </Splitter>,
            );

            await reactAct(async () => {
                await Promise.resolve();
            });

            expect(container.querySelector('[data-testid="custom-dragger"]')).toBeInTheDocument();
            expect(
                container.querySelector('.ant-splitter-bar-dragger-customize'),
            ).toBeInTheDocument();
        } finally {
            (global as any).__mockSplitterResize__ = false;
        }
    });

    it('renders custom collapsible icons from adjacent panels', async () => {
        (global as any).__mockSplitterResize__ = true;
        try {
            const { container } = render(
                <Splitter>
                    <Splitter.Panel
                        collapsible={{
                            end: true,
                            icon: { end: <span data-testid="prev-end-icon">prev-end</span> },
                        }}
                    >
                        left
                    </Splitter.Panel>
                    <Splitter.Panel
                        collapsible={{
                            start: true,
                            icon: { start: <span data-testid="next-start-icon">next-start</span> },
                        }}
                    >
                        right
                    </Splitter.Panel>
                </Splitter>,
            );

            await reactAct(async () => {
                await Promise.resolve();
            });

            const startBar = container.querySelector('.ant-splitter-bar-collapse-bar-start');
            const endBar = container.querySelector('.ant-splitter-bar-collapse-bar-end');
            expect(startBar).toBeInTheDocument();
            expect(endBar).toBeInTheDocument();
            expect(startBar).toContainElement(
                container.querySelector('[data-testid="prev-end-icon"]'),
            );
            expect(endBar).toContainElement(
                container.querySelector('[data-testid="next-start-icon"]'),
            );
            expect(
                container.querySelector('.ant-splitter-bar-collapse-bar-customize'),
            ).toBeInTheDocument();
        } finally {
            (global as any).__mockSplitterResize__ = false;
        }
    });

    it('uses vertical prop for orientation', () => {
        const { container } = render(
            <Splitter vertical>
                <Splitter.Panel>top</Splitter.Panel>
                <Splitter.Panel>bottom</Splitter.Panel>
            </Splitter>,
        );

        expect(container.querySelector('.ant-splitter-vertical')).toBeInTheDocument();
    });

    it('uses orientation prop', () => {
        const { container } = render(
            <Splitter orientation="vertical">
                <Splitter.Panel>top</Splitter.Panel>
                <Splitter.Panel>bottom</Splitter.Panel>
            </Splitter>,
        );

        expect(container.querySelector('.ant-splitter-vertical')).toBeInTheDocument();
    });

    it('prefers orientation over layout', () => {
        const { container } = render(
            <Splitter layout="horizontal" orientation="vertical">
                <Splitter.Panel>top</Splitter.Panel>
                <Splitter.Panel>bottom</Splitter.Panel>
            </Splitter>,
        );

        expect(container.querySelector('.ant-splitter-vertical')).toBeInTheDocument();
        expect(container.querySelector('.ant-splitter-horizontal')).not.toBeInTheDocument();
    });

    it('falls back to layout when orientation and vertical are not provided', () => {
        const { container } = render(
            <Splitter layout="vertical">
                <Splitter.Panel>top</Splitter.Panel>
                <Splitter.Panel>bottom</Splitter.Panel>
            </Splitter>,
        );

        expect(container.querySelector('.ant-splitter-vertical')).toBeInTheDocument();
    });

    it('adds motion class when panel collapsible.motion is true', () => {
        const { container } = render(
            <Splitter>
                <Splitter.Panel collapsible={{ motion: true }}>left</Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        const panels = container.querySelectorAll('.ant-splitter-panel');
        panels.forEach((panel) => {
            expect(panel).toHaveClass('ant-splitter-panel-motion');
        });
    });

    it('adds motion class to all panels when Splitter.motion is true', () => {
        const { container } = render(
            <Splitter motion>
                <Splitter.Panel>left</Splitter.Panel>
                <Splitter.Panel>right</Splitter.Panel>
            </Splitter>,
        );

        const panels = container.querySelectorAll('.ant-splitter-panel');
        expect(panels[0]).toHaveClass('ant-splitter-panel-motion');
        expect(panels[1]).toHaveClass('ant-splitter-panel-motion');
    });
});
