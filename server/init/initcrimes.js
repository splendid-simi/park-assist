import express from 'express'
import request  from 'request'
import Firebase from 'firebase'
import moment from 'moment'
import fb_keys from './../config/keys.js'
import fs from 'fs'
import path from 'path'
import baseline from './../crimes/data/baseline.json'

// dummy data for crimes
// import crimeData from './../crimedata.js'
// import hasValidUCRCode from './../crimes/data/crimeratings.json'
const db = new Firebase(fb_keys.url);

let requestCount = 0;
let lastCrimeDate = '';
let dummyCrimes = [
{
  "ucr": "0710",
  "date_occurred": "2006-01-01T00:00:00"
},
{
  "ucr": "0710",
  "date_occurred": "2006-01-02T00:00:00"
},
{
  "ucr": "0710",
  "date_occurred": "2006-01-02T00:00:00"
},
{
  "ucr": "0710",
  "date_occurred": "2006-01-02T00:00:00"
},
{
  "ucr": "0710",
  "date_occurred": "2006-01-02T00:00:00"
}];


const initCrimes = (req,res) => {
  let response = res;
  getCrimes((err, data) => {
    if(err) {
      console.log('Error getting data. Error:', err);
      response.sendStatus(500);
      return;
    }
    console.log('sending back 200 response in init code');
    response.sendStatus(200);
  });
}

const getCrimes = (callback) => {
  let url = buildCrimeQuery();
  requestCount++;
  console.log('request count', requestCount, url);

  request(url, (error, response, data) => {
    if (error) {
      console.log('error', error)
      return callback(error);
    }

    let crimes = JSON.parse(data);

    if(callback) {
      callback(null, data);
    }
    sortCrimes(crimes);
  });
}

// built query
//https://data.smgov.net/resource/kn6p-4y74.json?$select=date_occurred,ucr&$where=date_occurred > '2013-12-30' AND date_occurred < '2014-10-02' AND (ucr='0640' OR ucr= '0650' OR ucr='0804' OR ucr='0710')&$order=date_occurred asc
const buildCrimeQuery = () => {
  let startDate = lastCrimeDate || (new Date().getFullYear()-3) + '-01-01';
  let endDate = (new Date().getFullYear()) + '-01-01';
  let url = 'https:\/\/data.smgov.net/resource/kn6p-4y74.json?'
  let select = '$select=date_occurred,ucr'
  let date = '&$where=date_occurred > ' + '"' + startDate + '"' + ' AND ' + 'date_occurred < ' + '"' + endDate + '"'
  let ucr = ' AND (ucr=' + "'" + '0640' + "'" + ' OR ucr= ' + "'" + '0650' + "'" + ' OR ucr=' +  "'" + '0804' + "'" + 'OR ucr=' + "'" + '0710' + "')"
  let order = '&$order=date_occurred asc'

  return url + select + date + ucr + order;
}

const sortCrimes = (crimes) => {
  crimes = crimes || dummyCrimes;
  lastCrimeDate = crimes[crimes.length-1]["date_occurred"].slice(0,10);
  console.log('lastCrimeDate:', lastCrimeDate, 'crimes length:', crimes.length);

  // sort each crime by ucr crime type
  crimes.forEach((crime) => {
      if(!baseline[crime["ucr"]]) {
        baseline[crime["ucr"]] = [];
      }
      baseline[crime["ucr"]].push(crime);
  });

  writeCrimesToFile(baseline, shouldRequestMoreCrimes);
}

const writeCrimesToFile = (baseline, callback) => {
    let pathName = path.join(__dirname + '/../crimes/data/baseline.json');

    fs.writeFile(pathName, JSON.stringify(baseline), 'utf-8', (err, data) => {
      if(err) {
        console.log('err:', err);
      }
      console.log('writeCrimesToFile')
      callback();
    });
}

// make another request to Crime API if last crime's data occurred before today's date
const shouldRequestMoreCrimes = () => {
  console.log('should request more crimes called');
  let endDate = (new Date().getFullYear()-1) + '-12-31'

  if(lastCrimeDate < endDate) {
    // make additional request
    console.log('make additional request to get crimes')
    getCrimes((err, data) => {
     if(err) {
       console.log('err:', err);
     }

    });
  } else {
    crimeRequestsComplete();
  }
}

const crimeRequestsComplete = () => {
  console.log('crimes requests complete');
}

export default initCrimes;
