import React from 'react';
import classNames from 'classnames';

import useLocale from '../locale/useLocale';
import './style.scss';

export interface IGlobalLoadingProps {
    className?: string;
    loadingTitle?: string;
    mainBackground?: string;
    circleBackground?: string;
    titleColor?: string;
    style?: React.CSSProperties;
}

const GlobalLoading: React.FC<IGlobalLoadingProps> = function (props) {
    const locale = useLocale('GlobalLoading');

    const {
        loadingTitle = locale.loading,
        mainBackground = '#F2F7FA',
        circleBackground = '#1D78FF',
        titleColor = '#3D446E',
        className = '',
        style,
    } = props;
    const prefixCls = 'dt-global-loading';

    return (
        <div
            className={classNames(`${prefixCls}-wrapper`, className)}
            style={{ background: mainBackground, ...style }}
            data-testid="test-globalLoading"
        >
            <div className={`${prefixCls}-center`}>
                <div className={`${prefixCls}-title`} style={{ color: titleColor }}>
                    {loadingTitle}
                </div>
                <div className="dt-bouncy-wrap">
                    <div className="dt-dot-icon dt-dc1">
                        <div className="dt-dot" style={{ background: circleBackground }}></div>
                    </div>
                    <div className="dt-dot-icon dt-dc2">
                        <div className="dt-dot" style={{ background: circleBackground }}></div>
                    </div>
                    <div className="dt-dot-icon dt-dc3">
                        <div className="dt-dot" style={{ background: circleBackground }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoading;
