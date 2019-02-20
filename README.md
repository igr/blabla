# BlaBlaIgor

1. `npm run build`: This is used to build all files and run all tasks without serving a development server and watching for changes.
2. `npm start`: This is the normal development script used to build all files and run all tasks, but also to serve a development server and watch for changes.

### What happens?

- Copy HTML files from `src` to `dist` directory
- Compile Sass to CSS, autoprefix, minify CSS and put it inside `dist` directory
- Compile ES6+ to ES5, concatenate JS files and minify code
- Compress and copy images into `dist` directory
- Copy dependencies specified in `package.json` from `src/node_modules` directory into `node_modules` folder inside `dist` directory
- Import dependencies into your application with ES6 modules
- Spin up local dev server at `http://localhost:3000` including auto-reloading

### What types of images are supported?

- PNG
- JPG / JPEG
- GIF
- SVG
- ICO (not compressed)

### How can I specify dependencies which are then copied to the `dist` folder?
You don't need to specify your dependencies anywhere else than in your `package.json` file.
Just install your dependencies via npm and all your dependencies get automatically loaded and copied into the `dist` folder.

### How can I load dependencies inside my application?
ES6 modules are supported by this Gulp Starter Kit.
Just install your dependencies and import them like so:

```js
import axios from 'axios';
```

## License
This project is licensed under the MIT License.
