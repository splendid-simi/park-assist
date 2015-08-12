# [Park Assist]

# Overview
Web app to take the decision making away from parking at meters in Santa Monica, CA. It will choose the closest confirmed open parking meter for you.

# Notes
* Currently only works in Santa Monica, CA due to parking meter API limitations.

# Developer Documentation

To start developing over the [Park Assist] codebase:
  1. Fork the repo
  2. Clone your fork locally
  3. npm install - server dependencies
  4. bower install - client dependencies
  5. gulp - run the app on a local server
  6. visit http://localhost:8000/ on your browser

We loosely modeled our directory structure from the information in this article:
https://scotch.io/tutorials/angularjs-best-practices-directory-structure

  * The main is located at src/app.js
      * All app.js does is require all module dependencies
      * There are no controllers in this app.

  * Primary functionality is split up into custom directives
    * **Map** - You will probably be most concerned with this.
    * **Modal**

  * ng services are arranged into separate directories w/ an index.js that requires the service into a module of the same name
    * **Directions** - Calculates and renders path on Google Maps.
    * **Geocoder** - Parses to Latitude/Longitude coordinates into a LatLng object w/ useful location data. Parses street address strings into LatLng objects.
    * **Loading** - Helper functions for displaying information and views during intermission (loading, waiting for directions, etc). JQuery heavy for DOM selection.
    * **Locator** - Functionality for creating user based on browser user location. Each unique user location is posted into the database as a unique user on Geolocation resolution.
    * **Map** - Map initialization, logic for setting parking spot marker when meter is found and returning an instance of the map initialized on the DOM.
    * **Markers** - Map marker methods for User and Parking Meters.
    * **Modal** - Overlay functions for when the user clicks 'Change My Destination'. JQuery heavy for DOM selection.
    * **User** - Watches user position through browser Geolocation data. Heavy dependency on Directions service.



