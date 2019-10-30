const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    // print: './src/print.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: '输出管理'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
//   module: {
//       rules: [
//           {
//               test: /\.css$/,
//               use: [
//                   'style-loader',
//                   'css-loader'
//               ]
//           },
//           {
//             test: /\.(png|svg|jpg|gif)$/,
//             use: [
//               {
//                 loader: 'url-loader',
//                 options: {
//                   limit: 10000 , /* 图片大小小于1000字节限制时会自动转成 base64 码引用*/
//                   name: '[path][name].[ext]?[hash:6]!./dir/file.png'
//                 },
//               },
//               {
//                 loader: 'image-webpack-loader',
//                 options: {
//                   mozjpeg: {
//                     progressive: true,
//                     quality: 65
//                   },
//                   // optipng.enabled: false will disable optipng
//                   optipng: {
//                     enabled: false,
//                   },
//                   pngquant: {
//                     quality: [0.65, 0.90],
//                     speed: 4
//                   },
//                   gifsicle: {
//                     interlaced: false,
//                   },
//                   // the webp option will enable WEBP
//                   webp: {
//                     quality: 75
//                   }
//               }
//             }
//           ]
//         },
//         {
//           test: /\.(woff|woff2|eot|ttf|otf)$/,
//           use: ['url-loader']
//         }
//       ]
//   }
};
