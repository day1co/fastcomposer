const path = require('path');
const webpack = require('webpack');
const HotModuleRebuildPlugin = require('./plugins/HotModuleRebuildPlugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './main.js',
	watch: true,
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HotModuleRebuildPlugin(),
  		new BrowserSyncPlugin({
  			host: 'localhost',
  			port: '3000',
  			server: { baseDir: ['src'] },
  			open: false
  		})
	],
	devServer: {
	    hot: true,
	    inline: true,
	    watchOptions: {
            poll: true
        }
	},
	module: {
		rules: [
			{
				test: /\.scss|css$/,
				use: [
					'style-loader',
					'raw-loader'
				]
			},
			{ 
				test: /\.(svg|png|svg|jpg|gif)$/, 
				use: [ 
					'file-loader' 
				]
			},
			{ 
				test: /\.ejs$/, 
				use: [ 
					'ejs-loader' 
				]
			},
			{
				test: /\.html$/, 
				use: [ 
					'raw-loader' 
				]	
			}
		]
	}
}