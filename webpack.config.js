var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        form: './src/main/resources/client/entries/form/form.js',
    },
    output: {
        filename: './src/main/resources/public/2.0/[name].bundle.js',
    },
	resolve: {
        root: [path.join(__dirname, "bower_components"), path.join(__dirname, "/src/main/resources/client")]
    },
	module: {
		loaders: [
			{ test: /\.html$/, loader: "html" },
			{ test: /\.css$/, loader: "style-loader!css-loader" },
		],
	},
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
};