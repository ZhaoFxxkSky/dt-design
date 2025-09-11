import React, { ReactNode } from 'react';
import { Empty as AntdEmpty, EmptyProps as AntdEmptyProps } from 'antd';
import classNames from 'classnames';

import emptyChart from './emptyImg/empty_chart.png';
import emptyDefault from './emptyImg/empty_default.png';
import emptyNotFound from './emptyImg/empty_notFound.png';
import emptyOverview from './emptyImg/empty_overview.png';
import emptyPermission from './emptyImg/empty_permission.png';
import emptyProject from './emptyImg/empty_project.png';
import emptySearch from './emptyImg/empty_search.png';
import { LoupeIcon, SearchIcon } from './icon';
import './style.scss';

export const IMG_MAP = {
    default: emptyDefault,
    project: emptyProject,
    search: emptySearch,
    chart: emptyChart,
    overview: emptyOverview,
    permission: emptyPermission,
    notFound: emptyNotFound,
};

export interface EmptyProps extends AntdEmptyProps {
    type?: 'default' | 'search' | 'chart' | 'project' | 'overview' | 'permission' | 'notFound';
    size?: 'default' | 'large';
    showEmpty?: boolean;
    extra?: ReactNode;
    active?: boolean;
}

const Empty = (props: EmptyProps) => {
    const {
        type = 'default',
        size = 'default',
        showEmpty = true,
        active = false,
        children,
        image,
        extra,
        className,
        style,
        ...restProps
    } = props;
    const img = () => {
        if (type === 'search' && active) {
            return (
                <>
                    <SearchIcon className="dtc-empty__search" />
                    <LoupeIcon className="dtc-empty__loupe" />
                </>
            );
        } else if (IMG_MAP[type]) {
            return <img src={IMG_MAP[type]} />;
        }

        return null;
    };

    let newImage: ReactNode = img() || null;
    if (image) newImage = image as ReactNode;

    return showEmpty ? (
        <AntdEmpty
            className={classNames(
                'dtc-empty',
                size === 'large' && 'dtc-empty__large',
                active && 'dtc-empty__active',
                className
            )}
            style={style}
            image={newImage}
            {...restProps}
        >
            {extra}
        </AntdEmpty>
    ) : (
        <>{children}</>
    );
};

export default Empty;
