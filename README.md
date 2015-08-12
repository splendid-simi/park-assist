# [ Park Assist ]
####A web application to quickly help you find the closest metered parking spot in Santa Monica, CA.

## Summary
Web app to take the decision making away from parking at meters in Santa Monica, CA. It will choose the closest confirmed open parking meter for you.

##Problem
Parking is near impossible to find in Santa Monica. In addition, the information in the Santa Monica Parking API is not being fully utilized.

##Solution
The Santa Monica Parking API provides information on over 6000 meters. At times over 100 events are added in less than a minute. We took this wealth of data and processed it behind the scenes using two different servers, and a client app to create a streamlined presentation of the most useful information for someone looking for a parking spot.

## Developer Documentation

####Tools Used:
* [AngularJS](https://angularjs.org/"AngularJS")
* [Firebase](https://www.firebase.com/"Firebase")
* [Node.js](https://nodejs.org/"Node.js")
* [Express](http://expressjs.com/"Express")
* [Google Maps APIs](https://developers.google.com/maps/?hl=en/"Google Maps APIs")
* [City of Santa Monica Parking Data API](https://parking.api.smgov.net/"City of Santa Monica Parking Data API")

####To start contributing to the [Park Assist] codebase:
  1. Fork the repo

  2. Clone your fork locally

  3. npm install - server dependencies

  4. bower install - client dependencies

  5. gulp - run the app on a local server

  6. visit http://localhost:8000/ on your browser

###Client Application Information
We loosely modeled the directory structure from the information in this article:
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

###Server Information

This application has two servers the first server, refered to as "server1" interacts with the client application. The other server, "server2" functions to scrape the events from the City of Santa Monica parking API.

####Server1

**Steps to loading up the main page and routing a user to a parking space:**
  1. The client app finds user current location and sends a get request to server1

  2. Server1 stores the current location as a unique user in the firebase database, so that personalized parking recommendations can be stored.

  3. Server1 pings firebase database and loops through all 6000+ meters stored in the database to find all within 0.2 miles away that currently show as empty (or SE) according to the data imported in with server2. The information for the meters are added to an array of meter information objects.

  4. Server1 sorts this array of meter information objects by the distance from the user and adds this array of objects under the user information in the database.

  5. Server1 responds to the client with the closest spot.

  6. The client app maps the location on google maps.

####Other buttons:
  * **"Show me another spot"** - This will give the next available spot for the user from the User array stored in the database.
  * **"Enter another destination"** - This will change the target destination of the user and repeat steps 1-6 above with that location information.

####Server2
Server2 automatically updates the Firebase database with event information for each meter (mostRecentEvent and timeStamp fields only). We split this into a separate server so that the speed of this application would not be affected by the constantly changing meter event information. [The repo can be found here.](https://github.com/splendid-simi/dbScrape/"Server Repo")

### Database Information

We are using Firebase to store the data. The database is [located here](https://burning-fire-1110.firebaseio.com/"ParkAssist Database").
