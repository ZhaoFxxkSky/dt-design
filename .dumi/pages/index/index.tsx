import React from 'react';
import { Button } from 'antd';
import { Helmet, Link } from 'dumi';
import { GithubOutlined } from '@ant-design/icons';

import './index.scss';

export default function Homepage() {
  return (
    <>
      <Helmet>
        <title>dt-design</title>
        <meta property="og:title" content="dt-design" data-rh="true"></meta>
        <meta name="description" content="react-component" />
        <meta name="author" content="dtinsight UED" />
        <meta name="keywords" content="react,react-component,ui-library,typescript,ant-design" />
      </Helmet>
      <div className="dt-homepage">
        <h1 className="dt-homepage-title">dt-design</h1>
        <div className="dt-homepage-description">一个基于 ant design 的组件库</div>
        <div className="dt-homepage-btnGroups">
          <Link className="ant-btn" to="/react">
            快速开始
          </Link>
          <Button icon={<GithubOutlined />} href="https://github.com/ZhaoFxxkSky/dt-design">
            Git
          </Button>
        </div>
      </div>
    </>
  );
}
