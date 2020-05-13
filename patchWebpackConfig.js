const fs = require('fs').promises;

async function patch() {
  let webpackConfig = await fs.readFile(
    './node_modules/react-scripts/config/webpack.config.js',
    'utf-8'
  );
  webpackConfig = webpackConfig.replace('useTypescriptIncrementalApi: true,', '');
  await fs.writeFile(
    './node_modules/react-scripts/config/webpack.config.js',
    webpackConfig,
    'utf-8'
  );
}
patch();
