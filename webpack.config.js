const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');



module.exports = {
	watch: true,
	entry: './src/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: 'production',
	optimization: {
		usedExports: true,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: false,
					keep_classnames: true,
					keep_fnames: true
				}
			})
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
		//new BundleAnalyzerPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.js$/, // Check for all js files
				exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
				loader: 'babel-loader'
			}
		]
	}
};