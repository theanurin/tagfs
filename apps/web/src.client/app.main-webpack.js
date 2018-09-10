const path = require("path");

module.exports = {
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: "raw-loader",
				include: [path.join(__dirname, "app.main")]
			},
			{
				test: /\.css$/,
				use: ["css-loader"],
				include: [path.join(__dirname, "app.main")]
			},
			{
				test: /.s[a|c]ss$/,
				use: ["sass-loader"],
				include: [path.join(__dirname, "app.main")]
			}
		]
	}
}
