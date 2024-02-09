import path from "path";
import ZipPlugin from "zip-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { Configuration } from "webpack";
import webpack from "webpack";

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
  externals: {
    "@aws-sdk/client-lambda": "@aws-sdk/client-lambda",
  },
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
    new webpack.EnvironmentPlugin([
      "COOKIE_NAME",
      "NONCE_COOKIE_NAME",
      "AWS_AUTHORIZE_METHOD_NAME",
      "AWS_RUNTIME_REGION",
      "AUTH0_OIDC_CONFIG_URL",
      "OIDC_CLIENT_ID",
      "OIDC_CLIENT_SECRET",
      "OIDC_AUDIENCE",
      "OIDC_REDIRECT_URI",
      "OIDC_CALLBACK_PATH",
      "OIDC_GRANT_TYPE",
      "OIDC_RESPONSE_TYPE",
      "OIDC_SCOPES",
    ]),
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
