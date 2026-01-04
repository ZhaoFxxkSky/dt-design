import React from 'react';
import { globalConfig } from 'antd/es/config-provider';
import classNames from 'classnames';
import { isEqual, pick } from 'lodash-es';
import './style';

interface BaseComponentProps {
    /**
     * 	类名
     */
    className?: string;
    /**
     * 样式
     */
    style?: React.CSSProperties;
    /**
     * id
     */
    id?: string;
    'data-*'?: string;
}

export interface CollapsibleProps extends BaseComponentProps {
    /**
     * 是否开启动画
     */
    motion?: boolean;
    /**
     * 子元素
     */
    children?: React.ReactNode;
    /**
     * 是否展开内容区域
     */
    isOpen?: boolean;
    /**
     * 动画执行的时间
     */
    duration?: number;
    /**
     * 是否保留隐藏的面板 DOM 树，默认销毁
     */
    keepDOM?: boolean;
    /**
     * 配合 keepDOM 使用，为 true 时挂载时不会渲染组件
     */
    lazyRender?: boolean;
    /**
     * 折叠高度
     */
    collapseHeight?: number;
    /**
     * 当 reCalcKey 改变时，将重新计算子节点的高度，用于优化动态渲染时的计算
     */
    reCalcKey?: number | string;
    /**
     * 动画结束的回调
     */
    onMotionEnd?: () => void;
    /**
     * 是否开启淡入淡出
     */
    fade?: boolean;
}

interface CollapsibleState {
    domInRenderTree: boolean;
    domHeight: number;
    visible: boolean;
    isTransitioning: boolean;
    cacheIsOpen: boolean;
}

class Collapsible extends React.Component<CollapsibleProps, CollapsibleState> {
    static defaultProps = {
        isOpen: false,
        duration: 250,
        motion: true,
        keepDOM: false,
        lazyRender: false,
        collapseHeight: 0,
        fade: false,
    };

    public prefixCls = 'collapsible';
    public foundation: any;
    private domRef = React.createRef<HTMLDivElement>();
    private resizeObserver: ResizeObserver | null = null;
    private hasBeenRendered = false;
    static displayName: string;
    // public cssClasses = {
    //     PREFIX: 'ant-collapsible',
    //     TRANSITION: 'ant-collapsible-transition',
    //     WRAPPER: 'ant-collapsible-wrapper',
    // };

    constructor(props: CollapsibleProps) {
        super(props);
        this.state = {
            domInRenderTree: false,
            domHeight: 0,
            visible: this.props.isOpen || false,
            isTransitioning: false,
            cacheIsOpen: this.props.isOpen || false,
        };

        this.prefixCls = `${globalConfig().getPrefixCls(this.prefixCls)}`;

        this.foundation = {
            updateDOMInRenderTree: (val: boolean) => this.setState({ domInRenderTree: val }),
            updateDOMHeight: (val: number) => this.setState({ domHeight: val }),
            updateVisible: (val: boolean) => this.setState({ visible: val }),
            updateIsTransitioning: (val: boolean) => this.setState({ isTransitioning: val }),
        };
    }

    private handleResize = (entryList: ResizeObserverEntry[]) => {
        const entry = entryList[0];
        if (entry) {
            const entryInfo = Collapsible.getEntryInfo(entry);
            this.foundation.updateDOMHeight(entryInfo.height);
            this.foundation.updateDOMInRenderTree(entryInfo.isShown);
        }
    };

    private isChildrenInRenderTree = (): boolean => {
        if (this.domRef.current) {
            return this.domRef.current.offsetHeight > 0;
        }
        return false;
    };

    static getEntryInfo = (entry: ResizeObserverEntry) => {
        let inRenderTree: boolean;
        if (entry.borderBoxSize) {
            inRenderTree = !(
                entry.borderBoxSize[0].blockSize === 0 && entry.borderBoxSize[0].inlineSize === 0
            );
        } else {
            inRenderTree = !(entry.contentRect.height === 0 && entry.contentRect.width === 0);
        }

        let height = 0;
        if (entry.borderBoxSize) {
            height = Math.ceil(entry.borderBoxSize[0].blockSize);
        } else {
            const target = entry.target as HTMLElement;
            height = target.clientHeight;
        }

        return {
            isShown: inRenderTree,
            height,
        };
    };

    private getDataAttr = (props: CollapsibleProps) => {
        const dataAttrs: Record<string, string> = {};
        Object.keys(props).forEach((key) => {
            if (key.startsWith('data-')) {
                dataAttrs[key] = String(props[key as keyof CollapsibleProps]);
            }
        });
        return dataAttrs;
    };

    componentDidMount() {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        if (this.domRef.current) {
            this.resizeObserver.observe(this.domRef.current);
        }
        const domInRenderTree = this.isChildrenInRenderTree();
        this.foundation.updateDOMInRenderTree(domInRenderTree);
        if (domInRenderTree && this.domRef.current) {
            this.foundation.updateDOMHeight(this.domRef.current.scrollHeight);
        }
    }

    static getDerivedStateFromProps(props: CollapsibleProps, prevState: CollapsibleState) {
        const newState: Partial<CollapsibleState> = {};
        const isOpenChanged = props.isOpen !== prevState.cacheIsOpen;

        if (isOpenChanged) {
            if (props.isOpen || !props.motion) {
                newState.visible = props.isOpen;
            }
        }

        if (props.motion && isOpenChanged) {
            newState.isTransitioning = true;
        }

        newState.cacheIsOpen = props.isOpen;
        return newState;
    }

    componentDidUpdate(
        prevProps: Readonly<CollapsibleProps>,
        prevState: Readonly<CollapsibleState>
    ) {
        const changedPropKeys = Object.keys(pick(this.props, ['reCalcKey'])).filter(
            (key) =>
                !isEqual(
                    this.props[key as keyof CollapsibleProps],
                    prevProps[key as keyof CollapsibleProps]
                )
        );
        const changedStateKeys = Object.keys(pick(this.state, ['domInRenderTree'])).filter(
            (key) =>
                !isEqual(
                    this.state[key as keyof CollapsibleState],
                    prevState[key as keyof CollapsibleState]
                )
        );

        if (changedPropKeys.includes('reCalcKey') && this.domRef.current) {
            this.foundation.updateDOMHeight(this.domRef.current.scrollHeight);
        }

        if (
            changedStateKeys.includes('domInRenderTree') &&
            this.state.domInRenderTree &&
            this.domRef.current
        ) {
            this.foundation.updateDOMHeight(this.domRef.current.scrollHeight);
        }
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }

    render() {
        const {
            isOpen,
            collapseHeight,
            fade,
            motion,
            duration,
            style,
            className,
            id,
            keepDOM,
            lazyRender,
            onMotionEnd,
        } = this.props;
        const { domHeight, isTransitioning, visible } = this.state;

        const wrapperStyle: React.CSSProperties = {
            overflow: 'hidden',
            height: isOpen ? domHeight : collapseHeight,
            opacity: isOpen || !fade || collapseHeight !== 0 ? 1 : 0,
            transitionDuration: `${motion && isTransitioning ? duration : 0}ms`,
            ...style,
        };

        const wrapperCls = classNames(
            `${this.prefixCls}-wrapper`,
            {
                [`${this.prefixCls}-transition`]: motion && isTransitioning,
            },
            className
        );

        const shouldRender =
            (keepDOM && (lazyRender ? this.hasBeenRendered : true)) ||
            collapseHeight !== 0 ||
            visible ||
            isOpen;

        if (shouldRender && !this.hasBeenRendered) {
            this.hasBeenRendered = true;
        }

        return (
            <div
                className={wrapperCls}
                style={wrapperStyle}
                onTransitionEnd={() => {
                    if (!isOpen) {
                        this.foundation.updateVisible(false);
                    }
                    this.foundation.updateIsTransitioning(false);
                    onMotionEnd?.();
                }}
                {...this.getDataAttr(this.props)}
            >
                <div ref={this.domRef} style={{ overflow: 'hidden' }} id={id}>
                    {shouldRender && this.props.children}
                </div>
            </div>
        );
    }
}

if (process.env.NODE_ENV !== 'production') {
    Collapsible.displayName = 'Collapsible';
}

export default Collapsible;
