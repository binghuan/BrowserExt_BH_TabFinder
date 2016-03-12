var path = require('path');
var config = {
    entry: {
        popover: './data/popup.js',
        background: './data/background.js'
    },
    output: {
        filename: '[name]_release.js',
        path: __dirname + '/data'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
                presets: ['react', 'es2015']
            }
        }]
    }
};
module.exports = config;
