import geolib from './../../../lib/geolib.js'
import geodesy from 'geodesy'

let LatLon = geodesy.LatLonSpherical;

const utilities = {
  calculateDestCoords(destCoords, radius) {
    // calculate the NW and SW corners
    let northLoc = utilities.getDestPoint(destCoords, radius, 0);
    let southLoc = utilities.getDestPoint(destCoords, radius, 90);
    let northwest = utilities.getDestPoint({"lat": northLoc.lat, "lon": destCoords.lon}, radius, 270);
    let southeast = utilities.getDestPoint({"lat": destCoords.lat,  "lon": southLoc.lon}, radius, 180);

    return [
        northwest.lat,
        northwest.lon,
        southeast.lat,
        southeast.lon
      ]
    },

    // calc destination using haversine formula
    getDestPoint(coords, radius, bearing) {
      let loc = new LatLon(coords.lat, coords.lon);
      let destPoint = loc.destinationPoint(radius, bearing);

      console.log('destPoint:', destPoint);
      return destPoint;
    }
}

export default utilities;
