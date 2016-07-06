import express from 'express'
import request  from 'request'
import Firebase from 'firebase'
import fb_keys from './../config/keys.js'

const db = new Firebase(fb_keys.url);

const initializeMeters = (req, res) => {
  console.log('server.js says: POST request for init received.');

  //Store all the metered parking spot information on our own database
  //Make a GET request
  let url = 'https://parking.api.smgov.net/meters'; //Santa Monica api that has location data on all metered parking spots
  request(url, function(error, response, body) {
    if (error) {
      console.log('Error getting data. Error:', error);
      res.sendStatus(500);
    }

    body = JSON.parse(body);
    //One time update of the database with the metered spots info
    for (var key in body) {
      //console.log("Value at",key, " is",body[key]);
      let obj = body[key];
      db.child("MeteredParkingSpots").child(obj.meter_id).set({
        meter_id: obj.meter_id,
        latitude: obj.latitude,
        longitude: obj.longitude
      });
    }
    res.sendStatus(200);
  });
}

export default initializeMeters;
