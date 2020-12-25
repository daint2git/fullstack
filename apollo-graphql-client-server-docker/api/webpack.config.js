const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const rootDir = path.resolve(process.cwd());
const srcDir = path.resolve(rootDir, 'src');
const buildDir = path.resolve(rootDir, 'build');

module.exports = (_, argv) => {
  const isProd = argv.mode === 'production';
  return {
    target: 'node',
    entry: path.resolve(srcDir, 'index.js'),
    output: {
      publicPath: '/',
      path: buildDir,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
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
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      modules: ['node_modules', srcDir],
      extensions: ['.js', '.json'],
    },
    externals: [nodeExternals()],
    devtool: isProd ? false : 'eval-source-map',
    performance: {
      hints: isProd ? 'warning' : false,
    },
  };
};
