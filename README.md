# YouTimeStamp

This web extension allow you to navigate through a popup into Youtube videos and more precisely through timestamps added in the video's description.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First, you have to install Node.js and Npm -> https://nodejs.org/en/

### Installing

A step by step series of examples that tell you have to get a development env running:

In the project folder, get all the npm dependencies :
```
npm install
```

Then add [web-ext](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext), the package who will allow you to run the extension in a firefox borwser and update it when you change the extension files.

```
npm install --save-dev web-ext
```

You will also need [webpack](https://webpack.js.org/) a package that will allow you to bundle all the ressources of the extension into files that can be loaded in the extension.

```
npm install --save-dev webpack
npm i -D copy-webpack-plugin
```

You are now ready to dev !

## Deployment

To live deploy the extension, you will need two terminal windows.
In the first one, run :
```
npm start
```

It will launch a firefox instance with the last builded extension. It will also reload it each time you run in the second window terminal :

```
npm run build
```

## Built With

* [Web extension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) - The web extension standard
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Webpack](https://webpack.js.org/) - Used to bundle extension's file


## Authors

* **Florent PERGOUD** - *Initial work* - [Flopshoubox](https://github.com/flopshoubox)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


