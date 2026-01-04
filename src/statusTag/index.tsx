import React, { CSSProperties, HTMLAttributes, ReactNode, useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { globalConfig } from 'antd/es/config-provider';
import classNames from 'classnames';
import './style';
export const PRESET_COLOR_TYPES = Object.freeze([
    'blue',
    'yellow',
    'green',
    'gray',
    'red',
    'purple',
    'cyan',
    'pink',
] as const);

export const STATUS_TAG_TYPES = Object.freeze(['default', 'outline', 'fill'] as const);

const DEFAULT_OPACITY = 0.15;

export type PresetColorType = (typeof PRESET_COLOR_TYPES)[number] | (string & {});
export type StatusTagType = (typeof STATUS_TAG_TYPES)[number];

export interface IStatusTagProps extends HTMLAttributes<HTMLDivElement> {
    /** 状态类型 */
    type?: StatusTagType;
    /** 是否圆角 */
    rounded?: boolean;
    /** 状态颜色（支持预设值/自定义十六进制/RGB） */
    color?: PresetColorType;
    /** 是否加载中 */
    loading?: boolean;
    /** 自定义图标 */
    icon?: ReactNode;
    /** 背景颜色（仅fill类型生效），未设置时使用color的0.15透明度 */
    background?: string;
    /** 类名 */
    className?: string;
    /** 子节点 */
    children?: ReactNode;
    /** 自定义样式 */
    style?: CSSProperties;
}

/**
 * 校验是否为预设颜色
 * @param color 待校验颜色值
 */
function isPresetColor(color?: unknown): color is PresetColorType {
    if (!color || typeof color !== 'string') return false;
    return PRESET_COLOR_TYPES.includes(color as (typeof PRESET_COLOR_TYPES)[number]);
}

/**
 * 计算颜色的透明版本
 * @param color 原始颜色（支持hex/rgb/rgba）
 * @param opacity 透明度（默认0.15）
 */
function calculateTransparentColor(color: string, opacity: number = DEFAULT_OPACITY): string {
    if (!color) return 'rgba(0, 0, 0, 0.15)';

    if (color.startsWith('rgb')) {
        if (color.startsWith('rgba')) return color.replace(/,\s*[\d.]+(?=\))/, `,${opacity}`);
        return `${color.slice(0, -1)},${opacity})`;
    }

    let hex = color.trim().replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return 'rgba(0, 0, 0, 0.15)';

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const StatusTag: React.FC<IStatusTagProps> = React.memo((props) => {
    const {
        className,
        type = 'default',
        icon,
        color = 'green',
        loading = false,
        rounded = false,
        background,
        style,
        children,
        ...restProps
    } = props;

    const prefixCls = globalConfig().getPrefixCls('status-tag');

    const showDefaultIcon = useMemo(() => icon === undefined, [icon]);

    const containerClasses = useMemo(
        () =>
            classNames(prefixCls, className, {
                [`${prefixCls}--border`]: type === 'outline',
                [`${prefixCls}--fill`]: type === 'fill',
                [`${prefixCls}--rounded`]: rounded,
                [`${prefixCls}__${color}--fill`]: type === 'fill' && isPresetColor(color),
            }),
        [className, type, color, rounded, prefixCls]
    );

    const customColorStyle = useMemo(() => {
        if (type !== 'fill' || isPresetColor(color)) return {};

        return {
            color,
            background: background || calculateTransparentColor(color),
        } as CSSProperties;
    }, [type, color, background]);

    const iconStyleConfig = useMemo(() => {
        if (isPresetColor(color)) {
            return {
                className: classNames('anticon', {
                    [`${prefixCls}__${color}--icon`]: true,
                    [`${prefixCls}__icon--default`]: !icon,

                    [`${prefixCls}__${color}--iconBg`]: !icon,
                }),
                style: {} as CSSProperties,
            };
        }

        return {
            className: classNames('anticon', {
                [`${prefixCls}__icon--default`]: !icon,
            }),
            style: {
                color: icon ? color : undefined,
                background: !icon ? color : undefined,
            } as CSSProperties,
        };
    }, [color, icon, prefixCls]);

    const loadingIndicator = useMemo(
        () => <LoadingOutlined className={`${prefixCls}__icon ${prefixCls}__icon--loading`} />,
        [prefixCls]
    );

    return (
        <div
            {...restProps}
            className={containerClasses}
            style={{ ...customColorStyle, ...style }}
            aria-busy={loading}
        >
            {loading ? (
                <Spin spinning indicator={loadingIndicator} size="small" />
            ) : (
                (icon || showDefaultIcon) && (
                    <div className={`${prefixCls}__icon`}>
                        <span className={iconStyleConfig.className} style={iconStyleConfig.style}>
                            {icon ?? null}
                        </span>
                    </div>
                )
            )}
            {children && <span className={`${prefixCls}__text`}>{children}</span>}
        </div>
    );
});

if (process.env.NODE_ENV !== 'production') {
    StatusTag.displayName = 'StatusTag';
}

export default StatusTag;
