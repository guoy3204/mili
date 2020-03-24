const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const publicPath = process.env.PUBLIC_PATH || 'http://localhost:9906/';

function getEntries(entryPath, entryObj) {
    const files = fs.readdirSync(entryPath);
    files.forEach(function (filePath) {
        const fullpath = `${entryPath}/${filePath}`;
        const info = fs.statSync(fullpath);
        if (info.isDirectory()) {
            getEntries(fullpath, entryObj);
        } else {
            if (fullpath && fullpath.indexOf('.DS_Store') >= 0) {
                return;
            }
            let key = fullpath.replace('./js/', '');
            key = key.replace('.js', '');
            entryObj[key] = fullpath;
        }
    });
    return entryObj;
}

/**
 * {
 *     'entry/admin/app': './js/entry/admin/app.js',
 *     'entry/article/articleDetail': './js/entry/article/articleDetail.js',
 * }
 */
const entries = getEntries('./js/entry', {});

// https://vue-loader.vuejs.org/zh/
module.exports = {
    mode: 'development',
    entry: entries,
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: path.join(__dirname, 'dist'),
        publicPath: publicPath,
    },
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         formatter: eslintFriendlyFormatter
            //     }
            // },
            {
                test: /\.vue$/,
                // exclude: file => {
                //     console.log('------', file);
                //     return /node_modules/.test(file) && !/\.vue\.js/.test(file)
                // },
                use: {
                    loader: 'vue-loader',
                }
            },
            {
                test: /\.js$/,
                exclude: file => (
                    /node_modules/.test(file) && !/\.vue\.js/.test(file)
                ),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        // cacheDirectory: true,
                        plugins: [
                            'syntax-dynamic-import',
                            'transform-object-rest-spread',
                            [
                                'import', {
                                    libraryName: 'iview',
                                    libraryDirectory: 'src/components',
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV !== 'production'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: process.env.NODE_ENV !== 'production',
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV !== 'production'
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash:16].[ext]',
                        outputPath: 'images/'
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash:16].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    enforce: true,
                    priority: 1
                },
                // common: {
                //     name: 'common',
                //     chunks: 'all',
                //     minChunks: 2,
                //     enforce: true,
                //     priority: 0
                // }
            }
        }
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, '')
        },
        extensions: ['.js', '.vue', '.css', '.scss']
    },
    externals: {},
    plugins: [],
};