import path from "path";
import ZipPlugin from "zip-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { Configuration } from "webpack";

const config: Configuration = {
    entry: path.join(__dirname, "/src/index.ts"),
    mode: "production",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "index.js",
        libraryTarget: "commonjs",
    },
    target: "node",
    resolve: {
        extensions: [".js", ".ts"],
    },
    externals: ["aws-sdk"],
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    plugins: [
        new ZipPlugin({
            filename: "build.zip",
        }),
        new CopyPlugin({
            patterns: ["sm-key.txt"],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};

export default config;
