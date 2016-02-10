# Epic Guide

A game about going for a walk in a friendly world :)

## Setup and contribute
```
> npm install
> grunt
```

The task `grunt` runs the compilation of TypeScript, HTML and SASS files, and open the default browser
with the URL `localhost:3000/dist`.

A watcher is also started, which runs the corresponding compilation task according to the file type.

## Configuration

### dist folder
The whole working project can be found in the `dist` folder. If you want to deploy this project anywhere, copy-paste
 this folder and you're good to go.

*This folder should never be updated,* except the `assets` folder where all babylon files are stored.


### html
In this folder can be found the HTML page. This page is composed of several HTML snippet, that
are 'baked' by grunt-bake. grunt-bake is only used to separate several part of the final HTML page.

### resources
In this folder are stored all .max/.blend files that are used as a source file for the project.

### sass and ts
SCSS files and TypeScript files


