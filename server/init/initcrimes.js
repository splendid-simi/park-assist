import express from 'express'
import request  from 'request'
import Firebase from 'firebase'
import moment from 'moment'
import fb_keys from './../config/keys.js'
// dummy data for crimes
import crimeData from './../crimedata.js'
import hasValidUCRCode from './../crimes/data/crimeratings.json'

const db = new Firebase(fb_keys.url);
let requestCount = 0;

const initCrimes = (req,res) => {
  let result = getCrimes();
  requestCount = 1;

  if(result.error) {
    console.log('Error getting data. Error:', error || result.message);
    res.sendStatus(500);
  }
  res.sendStatus(200);
}

const getCrimes = (startDate) => {
  let url = 'https://data.smgov.net/resource/kn6p-4y74.json?';
  let query = '$where=date_occurred > ';
  startDate = startDate || '"' + new Date().getFullYear() - 1 + '-01-01' + '"';

  // get all crimes that have happened in the past year in SM
  request(url+query+startDate, (error, response, data) => {
    let crimes = JSON.parse(data);

    if (crimes.error) {
      return crimes.slice();
    }

    setCrimes(crimes);
  });
}

const setCrimes = (crimes) => {
  let lastCrimeDate = crimes[crimes.length-1][date_occurred].slice(0,10);
  //one time update of db with crimes from the past year
  crimes.forEach((crime) => {
    // if type of crime could affect parking safety
    let ucrCode = crime.ucr.slice(0,2);
    let validCrimeType = hasValidUCRCode[ucrCode];

    if(validCrimeType && crime.map_point) {
      // add crime to Crimes Collection in db
      db.child("Crimes").push({
        date_occurred: crime.date_occurred.slice(0,10),
        latitude: crime["map_point"]["latitude"],
        longitude: crime["map_point"]["longitude"],
        ucr: crime.ucr,
        ucr_description: crime.ucr_description
      });
    }
  });
  // keep fetching all crimes from past year until today's date
  shouldRequestMoreCrimes(lastCrimeDate);
}

// make another request to Crime API if last crime's data occurred before today's date
const shouldRequestMoreCrimes = (lastCrimeDate) => {
  let today = moment().format("YYYY-MM-DD")

  if(lastCrimeDate > today) {
    // make additional request
    getCrimes(lastCrimeDate);
    requestCount++;
  }
}

export default getCrimes;
