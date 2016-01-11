var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        bibliometrician: './src/main/resources/client/entries/bibliometrician/bibliometrician.js',
		inspector: './src/main/resources/client/entries/inspector/inspector.js',
    },
    output: {
        filename: './src/main/resources/public/2.0/[name].bundle.js',
    },
	resolve: {
        root: [path.join(__dirname, "bower_components"), path.join(__dirname, "/src/main/resources/client")],
		alias: {
			'c3-js': 'c3/c3.min.js',
			'c3-css': 'c3/c3.css',
			'owl-carousel.js': 'owlcarousel/owl-carousel/owl.carousel.min.js',
			'owl-carousel.css': 'owlcarousel/owl-carousel/owl.carousel.css'
		}
    },
	module: {
		loaders: [
			{ test: /\.html$/, loader: "html" },
			{ test: /\.md$/, loader: "html!markdown" },
			{ test: /\.(png|jpg|svg)$/, loader: 'url-loader?limit=10000' },
            {
                test: /\.css$/,
                include: [
                    path.join(__dirname, "/src/main/resources/client/components"),
                    path.join(__dirname, "/src/main/resources/client/mixins"),
                    path.join(__dirname, "/src/main/resources/client/css/modules")
                ],
                loader: "style-loader!css-loader?modules" 
            },
            {
                test: /\.css$/,
                exclude: [
                    path.join(__dirname, "/src/main/resources/client/components"),
                    path.join(__dirname, "/src/main/resources/client/mixins"),
                    path.join(__dirname, "/src/main/resources/client/css/modules")
                ],
                loader: "style-loader!css-loader" 
            },
            {
                test: /\.less$/,
                include: [
                    path.join(__dirname, "/src/main/resources/client/components"),
                    path.join(__dirname, "/src/main/resources/client/mixins"),
                    path.join(__dirname, "/src/main/resources/client/css/modules")
                ],
                loader: "style-loader!css-loader?modules!less-loader" 
            },
            {
                test: /\.less$/,
                exclude: [
                    path.join(__dirname, "/src/main/resources/client/components"),
                    path.join(__dirname, "/src/main/resources/client/mixins"),
                    path.join(__dirname, "/src/main/resources/client/css/modules")
                ],
                loader: "style-loader!css-loader!less-loader" 
            }
		],
	},
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
};