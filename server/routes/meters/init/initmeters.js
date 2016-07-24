import express from 'express'
import request  from 'request'
import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'
import requestUtils from './../../../utilities/requestUtils.js'

const db = new Firebase(fb_keys.url);

const initializeMeters = (req, res) => {
  console.log('server.js says: POST request for init received.');

  //Make a GET request
  let url = 'https://parking.api.smgov.net/meters';
  request(url, function(error, response, data) {
    if(error) {
      requestUtils.send(res, 500, "error initializing meters");
      return;
    }
    setParkingMeters(JSON.parse(data));
    requestUtils.send(res, 200, "meters successfully initialized");
  });
}

//One time update of the database with the metered spots info
const setParkingMeters = (meters) => {
  for (var key in meters) {
    let obj = meters[key];
    console.log("Value at",key, " is",meters[key]);

    db.child("MeteredParkingSpots").child(obj.meter_id).set({
      meter_id: obj.meter_id,
      latitude: obj.latitude,
      longitude: obj.longitude
    });
  }
}

export default initializeMeters;
