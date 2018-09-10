const path = require("path");

module.exports = {
	//devtool: "source-map",
	target: "web",
	mode: "This property will be set by zxbuild to 'development' or 'production' value. Do not set this manually.",
	entry: "This property will be set by zxbuild to correct value. Do not set this manually.",
	output: {
		filename: "bundle.js"
	},
	plugins: [
	],
	resolve: {
		extensions: ["css", "html", "scss", "less", ".js", ".json"],
		modules: [path.join(__dirname, 'node_modules')]
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')]
	},
	optimization: {
		minimize: "This property will be set by zxbuild to true or false value. Do not set this manually."
	}
};
