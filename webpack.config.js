// 'use strict';

// let path = require('path');

// module.exports = {
//     mode: 'development',
//     entry: './src/js/main.js',
//     output: {
//         filename: 'bundle.js',
//         path: __dirname + '/dist/js'
//     },
//     watch: true,

//     devtool: "source-map",

//     module: {}
// };

'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        bundle: './src/js/main.js',
        bundleAdmin: './admin/Myadmin/scripts.js',
    },
    output: {
        filename: '[name].js', // Используем [name] для динамического имени файла на основе ключа entry
        path: path.resolve(__dirname, 'dist/js'),
    },
    watch: true,
    devtool: 'source-map',
    module: {}, // Добавьте здесь конфигурацию для модулей, если она требуется.
};