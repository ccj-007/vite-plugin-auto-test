const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const config = {
  entry: './src/plugin/vite-plugin-auto-test/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'vite-plugin-auto-test',
    libraryTarget: "umd"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'vue']
  },
  plugins: [
    new CleanWebpackPlugin({}),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  }
}

module.exports = (env, argv) => {
  return config
}