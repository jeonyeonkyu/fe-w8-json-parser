import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: "./public/src/main.js",
  watch: true,
  target: "es5",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'main_bundle.js'
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      include: [
        path.resolve(__dirname, "public/src"),
      ],
      exclude: /node_modules/,
      use: ['babel-loader']
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }],
  },
  resolve: {
    extensions: ['*', '.js']
  },
  // devtool: 'source-map',
}