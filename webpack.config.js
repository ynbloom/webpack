const path = require('path');
// 查看html显示的内容
const HTMLWebpackPlugin = require('html-webpack-plugin');
// 清理dist文件夹里面的js重复文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
// 项目提示错误，可能是编译错误，可能是eslint提示错误，希望提示友好一些
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// css文件拆分, 从js文件中提取出来
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // 如果没有设置，webpack4 会将 mode 的默认值设置为 production, production模式下会进行tree shaking(去除无用代码)和uglifyjs(代码压缩混淆)
  mode: 'development', // mode可设置development production两个参数
  // devtool: 'inline-source-map', // 错误代码调试
  // 多文件入口
  // entry: {
  //   main: './src/index.js',
  //   header: './src/head.js',
  // },
  // 单个入口
  entry: './src/index.js',
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    // 必须配置的选项，服务启动的目录，默认为根目录
    contentBase: './dist',
    // 使用热加载是时需要设置为true
    hot: true,
    /* 
     * 下面为可选配置
    */
  //  指定使用一个host， 默认是localhost
  host: 'localhost',
  // 端口号
  port: 8000,
  // 当使用html5 history API时，任意404响应都可能需要被替代为index.html。通过设置为true进行启用
  historyApiFallback: {
    disableDotRule: true
  },
  // 出现错误时是否在浏览器上出现遮罩层提示
  overlay: true,
  /* 
   * 在dev-server的两种不同模式之间切换
   * 默认情况下，应用程序启用内联模式inline
   * 设置为false, 使用iframe模式，它在通知栏下面使用<iframe>标签，包含了关于构建的消息
  */
  inline: true,
 /* 
  * 统计信息：枚举类型，可供选项
  * "errors-only"：只在发生错误时输出
  * "minimal"：只在发生错误或有新的编译时输出
  * "none": 没有输出
  * "normal": 标准输出
  * "verbose": 全部输出
 */
   stats: "errors-only",
    //  设置接口请求代理，更多proxy配置
   proxy: {
    '/api/': {
        changeOrigin: true,
        // 目标地址
        target: 'http://localhost:3000',
        // 重写路径
        pathRewrite: {
            '^/api/': '/'
        }
      }
    }
  },
  plugins: [
    // 多文件入口
    // new HTMLWebpackPlugin({
    //   // 用于生成的HTML文档的标题
    //   title: 'Webpack 开发环境配置',
    //   // webpack 生成模板的路径
    //   template: './public/index.html',
    //   chunks:['main'] // 与入口文件对应的模块名
    // }),
    // new HTMLWebpackPlugin({
    //   title: '多文件入口',
    //   template: path.resolve(__dirname, './public/head.html'),
    //   chunks:['header'] // 与入口文件对应的模块名
    // }),
    // 单个入口
    new HTMLWebpackPlugin({
      // 用于生成的HTML文档的标题
      title: 'Webpack 开发环境配置',
      // webpack 生成模板的路径
      template: './public/index.html',
    }),
    // 用法：new CleanWebpackPlugin(paths [, {options}])
    new CleanWebpackPlugin(['dist']),
    // 添加 NamedModulesPlugin，以便更容易查看要修补(patch)的依赖，由于设置了 mode: 'development'，所以这个插件可以省略
    // new webpack.NamedModulesPlugin(),
    // 进行模块热替换
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          // 还可以给loader添加一些配置
          {
            loader: 'css-loader',
            options: {
              // 开启sourceMop
              sourceMap: true
            }
          }
        ]
      },
      // 解析图片
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      // 解析字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[.ext]'
                }
              }
            }
          }
        ]
      },
      // 解析数据资源
      {
        test: /\.(csv|tsv)$/,
        use: [
            'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
            'xml-loader'
        ]
      },
      {
        test: /\.md$/,
        use: [
            "html-loader", 
            "markdown-loader"
        ]
      },
      {
        test: /\.less$/,
        use:['style-loader','css-loader',{
          loader: 'postcss-loader',
          options: {
            plugins: [require('autoprefixer')]
          }
        },'less-loader'] // 从右向左解析原则
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8][ext]'
                }
              }
            }
          }
        ]
      },
      // ES6 ES7语法转义
      {
        test: /\.js/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader?cacheDirectory',
      },
    ]
  },
  // 开发的时候我们经常会需要引入自己写的文件模块，可能会需要按照路径一级一级的找，这个时候我们就可以配置 resolve，为一些常用的路径设置别名
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  }
}