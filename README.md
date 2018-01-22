<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/zEig29HrXXTTPEH8HY8Qmk5p/maximegris/angular-electron'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/zEig29HrXXTTPEH8HY8Qmk5p/maximegris/angular-electron.svg' />
</a>

[![Angular Logo](./logo-angular.jpg)](https://angular.io/) [![Electron Logo](./logo-electron.jpg)](https://electron.atom.io/)


[![Travis Build Status][build-badge]][build]
[![Dependencies Status][dependencyci-badge]][dependencyci]
[![Make a pull request][prs-badge]][prs]
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md)

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

# Introduction

Bootstrap and package your project with Angular 5(+) and Electron (Typescript + SASS + Hot Reload) for creating Desktop applications.

Currently runs with:

- Angular v5.0.1
- Angular-CLI v1.5.0
- Electron v1.7.6
- Electron Packager v9.0.1

With this sample, you can :

- Run your app in a local development environment with Electron & Hot reload
- Run your app in a production environment
- Package your app into an executable file for Linux, Windows & Mac

## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/maximegris/angular-electron.git
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager.

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.  
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## To build for development

- **in a terminal window** -> npm start  

Voila! You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Electron window and "Developer Tools" is open.  
The Angular component contains an example of Electron and NodeJS native lib import. See [Use NodeJS Native libraries](#use-nodejs-native-libraries) charpter if you want to import other native libraries in your project.  
You can desactivate "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## To build for production

- Using development variables (environments/index.ts) :  `npm run electron:dev`
- Using production variables (environments/index.prod.ts) :  `npm run electron:prod`

Your built files are in the /dist folder.

## Included Commands

|Command|Description|
|--|--|
|`npm run start:web`| Execute the app in the browser |
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

