import React from 'react';
import { Divider } from 'antd';
import { useSiteData } from 'dumi';

import './index.scss';

export default function Footer() {
    const { themeConfig } = useSiteData();
    return (
        <div className="dt-footer">
            <div className="dt-footer-links">
                <div className="dt-footer-rows">
                    <span className="dt-footer-rows-title">帮助</span>
                    <div className="dt-footer-col">
                        <a
                            href="https://github.com/ZhaoFxxkSky/dt-design/blob/master/CHANGELOG.md"
                            target="_blank"
                            rel="noreferrer"
                        >
                            更新日志
                        </a>
                    </div>
                    <div className="dt-footer-col">
                        <a
                            href="https://github.com/ZhaoFxxkSky/dt-design/issues"
                            target="_blank"
                            rel="noreferrer"
                        >
                            报告 Bug
                        </a>
                    </div>
                </div>
                <div className="dt-footer-rows">
                    <span className="dt-footer-rows-title">相关链接</span>
                    <div className="dt-footer-col">
                        <a href="https://4x.ant.design/index-cn" target="_blank" rel="noreferrer">
                            Ant Design 4
                        </a>
                    </div>
                </div>
            </div>
            <div className="dt-footer-divider">
                <Divider />
            </div>
            <div className="dt-footer-copyright">{themeConfig.footer}</div>
        </div>
    );
}
