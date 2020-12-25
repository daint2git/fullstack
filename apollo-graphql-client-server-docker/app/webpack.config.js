const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootDir = path.resolve(process.cwd());
const srcDir = path.resolve(rootDir, 'src');
const buildDir = path.resolve(rootDir, 'build');

module.exports = (_, argv) => {
  // console.log(process.env.NODE_ENV);

  console.log(JSON.stringify(process.env, null, 2));

  // console.log(process.env.NODE_VERSION);

  const isProd = argv.mode === 'production';
  return {
    target: 'web',
    entry: path.resolve(srcDir, 'index.jsx'),
    output: {
      publicPath: '/',
      path: buildDir,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: srcDir,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/template.html',
        favicon: './public/favicon.ico',
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      modules: ['node_modules', srcDir],
      extensions: ['.js', '.jsx', '.json'],
    },
    devServer: {
      contentBase: buildDir,
      port: 6969,
      host: '0.0.0.0',
      hot: true,
      historyApiFallback: true,
    },
    devtool: isProd ? false : 'eval-source-map',
    performance: {
      hints: isProd ? 'warning' : false,
    },
  };
};
