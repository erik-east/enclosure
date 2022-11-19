const copyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
const version = process.env.npm_package_version
const smp = new SpeedMeasurePlugin();

module.exports = () => {
	return smp.wrap({
		stats: {
			colors: true,
			errorDetails: true
		},
		devServer: {
			historyApiFallback: true,
			host: 'enclosure.local-dev',
			port: 9000
		},

		devtool: 'source-map',

		entry: path.resolve(__dirname, 'src/js/index.tsx'),

		output: {
			filename: '[name].[contenthash].js',
			publicPath: '/'
		},

		mode: 'development',

		module: {
			rules: [
				{
					test: /\.(scss|css)$/,
					use: [
						{ loader: 'style-loader' },
						{ loader: 'css-loader' },
						{ loader: 'sass-loader' }
					]
				},
				{
					test: /\.(ttf|woff|woff2|eot)$/,
					type: 'asset/resource',
					generator: {
						filename: 'fonts/[name][ext]',
					}
				},
				{
					test: /\.(png|jpg|svg)$/,
					type: 'asset/resource',
					generator: {
						filename: 'images/[name][ext]',
					}
				},
				{
					test: /\.tsx?$/,
					use: {
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						},
					},
					exclude: /node_modules/
				},
				{
					test: /\.m?js/,
					resolve: {
						fullySpecified: false
					}
				}
			]
		},

		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},

		plugins: [
			new webpack.DefinePlugin({
				VERSION: JSON.stringify(version)
			}),
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					configFile: './src/tsconfig.json'
				}
			}),
			new ForkTsCheckerNotifierWebpackPlugin({
				title: 'TypeScript',
				excludeWarnings: false
			}),
			new htmlWebpackPlugin({
				template: path.resolve(__dirname, 'src/index.html')
			}),
			new copyWebpackPlugin({
				patterns: [
					{ from: path.resolve(__dirname, 'src/js/globals.js') },
					{ from: path.resolve(__dirname, 'src/images/png/favicon.png') }
				]
			}),
			new ESLintPlugin({
				extensions: [ 'ts', 'tsx' ],
				context: 'src/',
				fix: true,
				lintDirtyModulesOnly: true
			}),
			new webpack.ProvidePlugin({
				process: 'process/browser',
			})
		],

		resolve: {
			extensions: [ '.ts', '.tsx', '.js' ]
		}
	})
};
