const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

console.log("Loaded API URL:", process.env.REACT_APP_API_URL); // Check if the variable is loaded

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "chatbot.bundle.js",
    library: "Chatbot",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "widgetStyles.css",
    }),
    new Dotenv({
      path: path.resolve(__dirname, ".env"),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
