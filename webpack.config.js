const path = require('path');

module.exports = {
    entry: 'src/index.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: [
            '.js',
            '.ts'
        ]
    },
    target: 'node',
    mode: 'none'
};
