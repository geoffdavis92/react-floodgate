"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: {
		floodgate: "./src/index.js"
	},
	devtool: "inline-source-map",
	output: {
		path: path.join(__dirname,'dist'),
		filename: "[name].js?hash=[hash]"
	},
	resolve: {
		enforceExtension: false,
		extensions: [".js", ".jsx", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.js(x)*$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	plugins: [
		process.env.NODE_ENV && process.env.NODE_ENV === "production"
			? new webpack.DefinePlugin({
					"process.env": {
						NODE_ENV: JSON.stringify("production")
					}
				})
			: () => null,
		process.env.NODE_ENV && process.env.NODE_ENV === "production"
			? new webpack.optimize.UglifyJsPlugin()
			: () => null
	],
	devServer: {
		contentBase: path.join(__dirname),
		compress: true,
		// hot: true,
		port: 5555
	}
};
