/**
 * UMD style entry.
 *
 * Webpack's require.context gathers every component's style/index.ts(x)
 * so that the UMD bundle includes all component styles.
 *
 * See: https://github.com/ant-design/ant-design/issues/3745
 */
const req = require.context('../../components', true, /^\.\/[^_][\w-]+\/style\/index\.tsx?$/);

req.keys().forEach((mod) => {
  req(mod);
});

module.exports = {};
