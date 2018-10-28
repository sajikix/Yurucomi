const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/client/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        exclude: ["/node_modules/"],
        use: {
          loader: "awesome-typescript-loader",
          options: {
            compilerOptions: {
              target: "es6",
              outDir: "/public",
              lib: ["dom", "es2015", "es2016", "es2017"],
            },
          },
        },
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  resolve: {
    extensions: [".js", "jsx", ".ts", ".tsx"],
  },
};
