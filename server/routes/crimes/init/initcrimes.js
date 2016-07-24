import express from 'express'
import request  from 'request'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import baseline from './../data/baseline.json'
import getBaselineScore from './analyzeCrimes.js'
import requestUtils from './../../../utilities/requestUtils.js'
import handleUtils from './../utilities/handleUtils.js'

// db
import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'
const db = new Firebase(fb_keys.url);

let requestCount = 0;
let lastCrimeDate = '';
let endDate = (new Date().getFullYear()-1) + '-12-31'

exports.initCrimes = (req,res) => {
  // get initial set of crimes
  getCrimes((err, data) => {
    handleUtils.handleInitCrimes(err, data, res);
  });
  exports.requestMoreCrimes();
}

const getCrimes = (callback) => {
  let url = buildCrimeQuery();
  requestCount++;
  request(url, (err, response, data) => {
    requestUtils.handleRequestCallback(err, JSON.parse(data), callback);
  });
}

// sample build query: https://data.smgov.net/resource/kn6p-4y74.json?$select=date_occurred,ucr&$where=date_occurred > '2013-12-30' AND date_occurred < '2014-10-02' AND (ucr='0640' OR ucr= '0650' OR ucr='0804' OR ucr='0710')&$order=date_occurred asc
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

exports.sortCrimes = (err,crimes) => {
  lastCrimeDate = crimes[crimes.length-2]["date_occurred"].slice(0,10);

  // sort each crime by ucr crime type
  crimes.forEach((crime) => {
      if(!baseline[crime["ucr"]]) {
        baseline[crime["ucr"]] = [];
      }
      baseline[crime["ucr"]].push(crime);
  });

  writeCrimesToFile(baseline);
}

const writeCrimesToFile = (baseline) => {
  let pathName = path.join(__dirname + '/../data/baseline.json');

  fs.writeFile(pathName, JSON.stringify(baseline), 'utf-8', handleUtils.handleWriteCrimes);
}

exports.requestMoreCrimes = (err, data) => {
  // console.log('err, data in requestMoreCrimes', err, data);
  if(lastCrimeDate < endDate) {
    // get additional crimes
    getCrimes(handleUtils.handleSortCrimes);
  } else {
    onCrimeRequestsComplete();
  }
}

exports.onCrimeRequestsComplete = () => {
  console.log('crime requests complete. Total Requests Made:', requestCount);
  getBaselineScore();
}
