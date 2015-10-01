# Park Assist
#### A web application to quickly help you find the closest metered parking spot in Santa Monica, CA.

## Problem
Parking is near impossible to find in Santa Monica. In addition, the data in the City of Santa Monica Parking API is not being fully utilized.

## Solution
A web app that directs you to the closest available parking meter in Santa Monica.

## Strategy
The City of Santa Monica Parking API provides information on 6700+ meters local to Santa Monica. Hundreds of meter events are sent to the API per minute. We took this data and processed it behind the scenes using two different servers (following service oriented architecture practices) and created an app that uses that data to facilitate reasonable and responsive meter parking decisions for the user.

## Dependencies

#### Tools:
* [AngularJS](https://angularjs.org/)
* [Firebase](https://www.firebase.com/)
* [Node.js](https://nodejs.org/)
* [Express](http://expressjs.com/)

#### APIs:
* [City of Santa Monica Parking Data API](https://parking.api.smgov.net/)
* [Google Maps APIs](https://developers.google.com/maps/?hl=en/)
  * **Google Maps JavaScript API v3** - Google Maps functionality via JS
  * **Google Maps Embed API** - Embeds your maps on different pages
  * **Google Maps Directions API** - Path calculation and rendering
  * **Google Maps Geocoding API** - Coordinate calculation via address strings or Latitude/Longitude tuples

## Installation
  1. npm install - server dependencies
  2. bower install - client dependencies
  3. gulp



## Client-Side Info

We loosely modeled the directory structure from the information in [this article](https://scotch.io/tutorials/angularjs-best-practices-directory-structure)

  * Primary functionality is split up into custom directives
    * **Map**
    * **Modal**
    * **Team**    
  * Services are arranged into separate directories w/ an index.js that requires the service into a module of the same name
    * **Directions** - Calculates and renders path on Google Maps
    * **Geocoder** - Parses location data
    * **Locator** - Creates a database user based on user location
    * **Map** - Initializes the map
    * **Markers** - Contains methods for User and Parking Meter models
    * **Traffic** - Adds a Traffic layer to Google Maps
    * **User** - Watches user position by monitoring browser geolocation data.


## Server-Side Info

#### IMPORTANT: If you are cloning this repo, create a file in the root directory called firebaselink.js that contains:

module.exports = {
   url: 'URL for your firebase database'
};

This application uses two servers:

* **"Parking Spot Analyzer" Server** - responsible for choosing the meters to be sent to the client. Its logic resides in server/server.js.

* **"Cloudify" Server** - used to scrape the events from the City of Santa Monica parking API to keep the database updated. The source code for this server is located in the [dbScrape](https://github.com/splendid-simi/dbScrape) repository.

#### Cloudify Server
Cloudify automatically updates the Firebase database with event information for each meter (mostRecentEvent and timeStamp fields only). We split this into a separate server so that the speed of this application would not be affected by the constantly changing meter event information. [The repo can be found here.](https://github.com/splendid-simi/dbScrape/)

### Database Schema

* ##### MeteredParkingSpots
  * MeterID
    * active - Set up once by PSA server
    * latitude - Set up once by PSA server
    * longitude - Set up once by PSA server
    * mostRecentEvent- Continually updated with Cloudify Server
    * timeStamp- Continually updated with Cloudify Server
    
* ##### Users
  * Firebase unique identifier
    * latitude - from Google Maps API
    * logitude - from Google Maps API
    * range - auto set
    * Recommendations
      * array of MeterID objects

## Application Flow

  1. The client detects the user's current location and sends a GET request to the PSA server.
  2. The PSA server stores the location as a unique user in the database so that personalized parking recommendations can be stored.
  3. The PSA server pings the database and iterates through all 6700+ meters to find the ones within 0.2 miles that currently show as empty (or SE). This data is sure to be accurate as it is continuously updated by the Cloudify server. The meters are added to an array of objects.
  4. The PSA server sorts this array of meter-information objects by distance and responds to the client with it.
  5. The client maps the closet meter on the map.

![alt text](https://github.com/rodocite/splendid-simi/blob/dev/applicationflow.jpg)
