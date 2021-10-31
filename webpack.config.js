const path = require("path");

module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, "./lib/"),
    filename: "othello.min.js",
    library: "othello",
    libraryTarget: "umd"
  },
  entry: path.join(__dirname, "./src/webpack.ts"),
  resolve: {
    extensions: [".ts", ".js"]
  }
}