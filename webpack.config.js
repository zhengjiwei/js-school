var webpack = require('webpack');
//var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true';
var path = require('path');
//var FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

var PROD = process.env.NODE_ENV === "production";
module.exports = {
    mode: PROD ? 'production' : 'development',
    context: __dirname,
    entry: {
        school: "./src/school.js"
    },
    output:{
            filename: "[name].js",
            path: __dirname + "/public/"
        },

    // Enable sourcemaps for debugging webpack's output.
    //devtool: !PROD ? "" : "source-map",
    //devtool: PROD ? "" : 'eval',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        alias: {
            'redux-devtools/lib': path.join(__dirname, 'node_modules', 'redux-devtools', 'src'),
            'redux-devtools': path.join(__dirname, 'node_modules', 'redux-devtools', 'src'),
            'react': path.join(__dirname, 'node_modules', 'react')
        },
        extensions: [".js", "jsx" ,".json"]

    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            //{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            //PROD ? {} : { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            //{ test: /\.css$/, loader:'style!css!'},
            {test: /\.css$/,
                use:[
                    {loader: 'style-loader'},
                    {loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]'
                        }
                    }]},
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query:{presets:['es2016','react', 'stage-0']}
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        //new FlowBabelWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    node: {
        child_process: 'empty',
        dns: 'empty',
        net: 'empty',
        tls: 'empty',
        fs: 'empty'
    }
};

