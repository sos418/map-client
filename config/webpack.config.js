require('dotenv').config({ silent: true });

process.env.BROWSERSLIST_CONFIG = 'browserslist';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJSON = require('../package.json');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const rootPath = process.cwd();
const envVariables = process.env;

const webpackConfig = {
  entry: [
    'whatwg-fetch',
    path.join(rootPath, 'app/src/util/assignPolyfill.js'),
    path.join(rootPath, 'app/src/util/findPolyfill.js'),
    path.join(rootPath, 'app/src/index.jsx')
  ],

  output: {
    path: path.join(rootPath, 'dist/'),
    filename: '[name]-[hash].js',
    publicPath: envVariables.PUBLIC_PATH
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css', allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      FEATURE_FLAG_SUBSCRIPTIONS: envVariables.FEATURE_FLAG_SUBSCRIPTIONS === 'true',
      FEATURE_FLAG_EXTENDED_POLYGON_LAYERS: envVariables.FEATURE_FLAG_EXTENDED_POLYGON_LAYERS === 'true',
      PUBLIC_PATH: JSON.stringify(envVariables.PUBLIC_PATH || ''),
      ENVIRONMENT: JSON.stringify(envVariables.NODE_ENV || 'development'),
      'process.env.NODE_ENV': JSON.stringify(envVariables.NODE_ENV || 'development'),
      VERSION: JSON.stringify(packageJSON.version),
      MAP_URL: JSON.stringify(envVariables.MAP_URL),
      V2_API_ENDPOINT: JSON.stringify(envVariables.V2_API_ENDPOINT),
      BLOG_URL: JSON.stringify(envVariables.BLOG_URL),
      SITE_URL: JSON.stringify(envVariables.SITE_URL),
      REQUIRE_MAP_LOGIN: envVariables.REQUIRE_MAP_LOGIN,
      DEFAULT_WORKSPACE: JSON.stringify(envVariables.DEFAULT_WORKSPACE),
      LOCAL_WORKSPACE: JSON.stringify(envVariables.LOCAL_WORKSPACE),
      GA_TRACKING_CODE: JSON.stringify(envVariables.GA_TRACKING_CODE),
      DISABLE_WELCOME_MODAL: envVariables.DISABLE_WELCOME_MODAL === 'true',
      WELCOME_MODAL_COOKIE_KEY: JSON.stringify(envVariables.WELCOME_MODAL_COOKIE_KEY),
      COMPLETE_MAP_RENDER: envVariables.COMPLETE_MAP_RENDER === 'true',
      TIMEBAR_DATA_URL: JSON.stringify(envVariables.TIMEBAR_DATA_URL),
      SHARE_BASE_URL: JSON.stringify(envVariables.SHARE_BASE_URL),
      SHOW_BANNER: envVariables.SHOW_BANNER === 'true'
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    })
  ],

  resolve: {
    modules: [
      `${process.cwd()}/app`,
      'node_modules'
    ],
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
      assets: 'assets',
      lib: 'lib',
      styles: 'styles',
      app: 'src/app',
      analytics: 'src/analytics',
      basemap: 'src/basemap',
      filters: 'src/filters',
      encounters: 'src/encounters',
      layers: 'src/layers',
      leftControlPanel: 'src/leftControlPanel',
      rightControlPanel: 'src/rightControlPanel',
      map: 'src/map',
      mapPanels: 'src/mapPanels',
      pinnedVessels: 'src/pinnedVessels',
      recentVessels: 'src/recentVessels',
      vesselInfo: 'src/vesselInfo',
      report: 'src/report',
      search: 'src/search',
      share: 'src/share',
      sharedUI: 'src/sharedUI',
      siteNav: 'src/siteNav',
      timebar: 'src/timebar',
      tracks: 'src/tracks',
      user: 'src/user',
      welcomeModal: 'src/welcomeModal',
      workspace: 'src/workspace',
      components: 'src/components',
      config: 'src/config.js',
      constants: 'src/constants.js',
      containers: 'src/containers',
      utils: 'src/util',
      activityLayers: 'src/activityLayers'
    },
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!globalfishingwatch-convert|react-map-gl).*/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            query: {
              optipng: {
                optimizationLevel: (envVariables.NODE_ENV === 'development' ? 0 : 7)
              },
              bypassOnDebug: true,
              gifsicle: {
                interlaced: true
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: (envVariables.NODE_ENV === 'production'),
                sourceMap: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: './config/postcss.config.js'
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: (envVariables.NODE_ENV === 'production')
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './config/postcss.config.js'
              }
            }
          }
        ]
      },
      {
        test: /manifest.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              hashType: 'sha512',
              digestType: 'hex',
              name: '[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.json$/,
        exclude: /manifest.json$/,
        use: 'json-loader'
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
              minimize: (envVariables.NODE_ENV === 'production')
            }
          }
        ]
      }
    ]
  }
};

// Environment configuration
if (envVariables.NODE_ENV === 'production') {
  // https://github.com/mapbox/mapbox-gl-js/issues/4359
  webpackConfig.module.noParse = /(mapbox-gl)\.js$/;
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: true }));
  webpackConfig.devtool = 'source-map';
  webpackConfig.resolve.alias.react = path.join(rootPath, 'node_modules/react/dist/react.min.js');
  webpackConfig.resolve.alias['react-dom'] = path.join(rootPath, 'node_modules/react-dom/dist/react-dom.min.js');
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
