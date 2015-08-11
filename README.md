# splendid-simi

# Overview

# Developer Documentation

To start developing over the [Park Assist] codebase:
  * Fork the repo
  * Clone your fork locally
  * run => npm install - server dependencies
  * run => bower install - client dependencies
  * run => gulp - run the app on a local server
  * visit http://localhost:8000/ on your browser

We loosely modeled our directory structure from the information in this article:
https://scotch.io/tutorials/angularjs-best-practices-directory-structure

  * The main ng app is src/app.js
    * Note that all app.js does is require all module dependencies
  * Primary functionality is split up into custom directives
    * Map
    * Modal
  * ng services are arranged into separate directories w/ an index.js
    * Map
    * Markers
    * Model
    * User

The services are passed into the angular module which can be used to call them as a 
dependency throughout the application.



