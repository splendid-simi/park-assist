// /*! geolib 2.0.21 by Manuel Bieh
// * Library to provide geo functions like distance calculation,
// * conversion of decimal coordinates to sexagesimal and vice versa, etc.
// * WGS 84 (World Geodetic System 1984)
// *
// * @author Manuel Bieh
// * @url http://www.manuelbieh.com/
// * @version 2.0.21
// * @license MIT
// **/
// !function(a,b){"use strict";function c(){}c.TO_RAD=Math.PI/180,c.TO_DEG=180/Math.PI,c.PI_X2=2*Math.PI,c.PI_DIV4=Math.PI/4;var d=Object.create(c.prototype,{version:{value:"2.0.21"},radius:{value:6378137},minLat:{value:-90},maxLat:{value:90},minLon:{value:-180},maxLon:{value:180},sexagesimalPattern:{value:/^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,2}))?)'\s*(([0-9]{1,3}(\.([0-9]{1,4}))?)"\s*)?([NEOSW]?)$/},measures:{value:Object.create(Object.prototype,{m:{value:1},km:{value:.001},cm:{value:100},mm:{value:1e3},mi:{value:1/1609.344},sm:{value:1/1852.216},ft:{value:100/30.48},"in":{value:100/2.54},yd:{value:1/.9144}})},prototype:{value:c.prototype},extend:{value:function(a,b){for(var c in a)("undefined"==typeof d.prototype[c]||b===!0)&&("function"==typeof a[c]&&"function"==typeof a[c].bind?d.prototype[c]=a[c].bind(d):d.prototype[c]=a[c])}}});"undefined"==typeof Number.prototype.toRad&&(Number.prototype.toRad=function(){return this*c.TO_RAD}),"undefined"==typeof Number.prototype.toDeg&&(Number.prototype.toDeg=function(){return this*c.TO_DEG}),d.extend({decimal:{},sexagesimal:{},distance:null,getKeys:function(a){if("[object Array]"==Object.prototype.toString.call(a))return{longitude:a.length>=1?0:b,latitude:a.length>=2?1:b,elevation:a.length>=3?2:b};var c=function(b){var c;return b.every(function(b){return"object"!=typeof a?!0:a.hasOwnProperty(b)?function(){return c=b,!1}():!0}),c},d=c(["lng","lon","longitude"]),e=c(["lat","latitude"]),f=c(["alt","altitude","elevation","elev"]);return"undefined"==typeof e&&"undefined"==typeof d&&"undefined"==typeof f?b:{latitude:e,longitude:d,elevation:f}},getLat:function(a,b){return b===!0?a[this.getKeys(a).latitude]:this.useDecimal(a[this.getKeys(a).latitude])},latitude:function(a){return this.getLat.call(this,a)},getLon:function(a,b){return b===!0?a[this.getKeys(a).longitude]:this.useDecimal(a[this.getKeys(a).longitude])},longitude:function(a){return this.getLon.call(this,a)},getElev:function(a){return a[this.getKeys(a).elevation]},elevation:function(a){return this.getElev.call(this,a)},coords:function(a,b){var c={latitude:b===!0?a[this.getKeys(a).latitude]:this.useDecimal(a[this.getKeys(a).latitude]),longitude:b===!0?a[this.getKeys(a).longitude]:this.useDecimal(a[this.getKeys(a).longitude])},d=a[this.getKeys(a).elevation];return"undefined"!=typeof d&&(c.elevation=d),c},ll:function(a,b){return this.coords.call(this,a,b)},validate:function(a){var b=this.getKeys(a);if("undefined"==typeof b||"undefined"==typeof b.latitude||"undefined"===b.longitude)return!1;var c=a[b.latitude],d=a[b.longitude];return"undefined"==typeof c||!this.isDecimal(c)&&!this.isSexagesimal(c)?!1:"undefined"==typeof d||!this.isDecimal(d)&&!this.isSexagesimal(d)?!1:(c=this.useDecimal(c),d=this.useDecimal(d),c<this.minLat||c>this.maxLat||d<this.minLon||d>this.maxLon?!1:!0)},getDistance:function(a,b,c,e){c=Math.floor(c)||1,e=Math.floor(e)||0;var f,g,h,i,j,k,l,m=this.coords(a),n=this.coords(b),o=6378137,p=6356752.314245,q=1/298.257223563,r=(n.longitude-m.longitude).toRad(),s=Math.atan((1-q)*Math.tan(parseFloat(m.latitude).toRad())),t=Math.atan((1-q)*Math.tan(parseFloat(n.latitude).toRad())),u=Math.sin(s),v=Math.cos(s),w=Math.sin(t),x=Math.cos(t),y=r,z=100;do{var A=Math.sin(y),B=Math.cos(y);if(k=Math.sqrt(x*A*(x*A)+(v*w-u*x*B)*(v*w-u*x*B)),0===k)return d.distance=0;f=u*w+v*x*B,g=Math.atan2(k,f),h=v*x*A/k,i=1-h*h,j=f-2*u*w/i,isNaN(j)&&(j=0);var C=q/16*i*(4+q*(4-3*i));l=y,y=r+(1-C)*q*h*(g+C*k*(j+C*f*(-1+2*j*j)))}while(Math.abs(y-l)>1e-12&&--z>0);if(0===z)return NaN;var D=i*(o*o-p*p)/(p*p),E=1+D/16384*(4096+D*(-768+D*(320-175*D))),F=D/1024*(256+D*(-128+D*(74-47*D))),G=F*k*(j+F/4*(f*(-1+2*j*j)-F/6*j*(-3+4*k*k)*(-3+4*j*j))),H=p*E*(g-G);if(H=H.toFixed(e),"undefined"!=typeof this.elevation(a)&&"undefined"!=typeof this.elevation(b)){var I=Math.abs(this.elevation(a)-this.elevation(b));H=Math.sqrt(H*H+I*I)}return this.distance=parseFloat((Math.round(H/c)*c).toFixed(e))},getDistanceSimple:function(a,b,c){c=Math.floor(c)||1;var e=Math.round(Math.acos(Math.sin(this.latitude(b).toRad())*Math.sin(this.latitude(a).toRad())+Math.cos(this.latitude(b).toRad())*Math.cos(this.latitude(a).toRad())*Math.cos(this.longitude(a).toRad()-this.longitude(b).toRad()))*this.radius);return d.distance=Math.floor(Math.round(e/c)*c)},getCenter:function(a){var b=a;if("object"==typeof a&&!(a instanceof Array)){b=[];for(var d in a)b.push(this.coords(a[d]))}if(!b.length)return!1;var e,f,g,h=0,i=0,j=0;b.forEach(function(a){e=this.latitude(a).toRad(),f=this.longitude(a).toRad(),h+=Math.cos(e)*Math.cos(f),i+=Math.cos(e)*Math.sin(f),j+=Math.sin(e)},this);var k=b.length;return h/=k,i/=k,j/=k,f=Math.atan2(i,h),g=Math.sqrt(h*h+i*i),e=Math.atan2(j,g),{latitude:(e*c.TO_DEG).toFixed(6),longitude:(f*c.TO_DEG).toFixed(6)}},getBounds:function(a){if(!a.length)return!1;var b=this.elevation(a[0]),c={maxLat:-(1/0),minLat:1/0,maxLng:-(1/0),minLng:1/0};"undefined"!=typeof b&&(c.maxElev=0,c.minElev=1/0);for(var d=0,e=a.length;e>d;++d)c.maxLat=Math.max(this.latitude(a[d]),c.maxLat),c.minLat=Math.min(this.latitude(a[d]),c.minLat),c.maxLng=Math.max(this.longitude(a[d]),c.maxLng),c.minLng=Math.min(this.longitude(a[d]),c.minLng),b&&(c.maxElev=Math.max(this.elevation(a[d]),c.maxElev),c.minElev=Math.min(this.elevation(a[d]),c.minElev));return c},getCenterOfBounds:function(a){var b=this.getBounds(a),c=b.minLat+(b.maxLat-b.minLat)/2,d=b.minLng+(b.maxLng-b.minLng)/2;return{latitude:parseFloat(c.toFixed(6)),longitude:parseFloat(d.toFixed(6))}},getBoundsOfDistance:function(a,b){var d,e,f=this.latitude(a),g=this.longitude(a),h=f.toRad(),i=g.toRad(),j=b/this.radius,k=h-j,l=h+j,m=this.maxLat.toRad(),n=this.minLat.toRad(),o=this.maxLon.toRad(),p=this.minLon.toRad();if(k>n&&m>l){var q=Math.asin(Math.sin(j)/Math.cos(h));d=i-q,p>d&&(d+=c.PI_X2),e=i+q,e>o&&(e-=c.PI_X2)}else k=Math.max(k,n),l=Math.min(l,m),d=p,e=o;return[{latitude:k.toDeg(),longitude:d.toDeg()},{latitude:l.toDeg(),longitude:e.toDeg()}]},isPointInside:function(a,b){for(var c=!1,d=-1,e=b.length,f=e-1;++d<e;f=d)(this.longitude(b[d])<=this.longitude(a)&&this.longitude(a)<this.longitude(b[f])||this.longitude(b[f])<=this.longitude(a)&&this.longitude(a)<this.longitude(b[d]))&&this.latitude(a)<(this.latitude(b[f])-this.latitude(b[d]))*(this.longitude(a)-this.longitude(b[d]))/(this.longitude(b[f])-this.longitude(b[d]))+this.latitude(b[d])&&(c=!c);return c},preparePolygonForIsPointInsideOptimized:function(a){for(var b=0,c=a.length-1;b<a.length;b++)this.longitude(a[c])===this.longitude(a[b])?(a[b].constant=this.latitude(a[b]),a[b].multiple=0):(a[b].constant=this.latitude(a[b])-this.longitude(a[b])*this.latitude(a[c])/(this.longitude(a[c])-this.longitude(a[b]))+this.longitude(a[b])*this.latitude(a[b])/(this.longitude(a[c])-this.longitude(a[b])),a[b].multiple=(this.latitude(a[c])-this.latitude(a[b]))/(this.longitude(a[c])-this.longitude(a[b]))),c=b},isPointInsideWithPreparedPolygon:function(a,b){for(var c=!1,d=this.longitude(a),e=this.latitude(a),f=0,g=b.length-1;f<b.length;f++)(this.longitude(b[f])<d&&this.longitude(b[g])>=d||this.longitude(b[g])<d&&this.longitude(b[f])>=d)&&(c^=d*b[f].multiple+b[f].constant<e),g=f;return c},isInside:function(){return this.isPointInside.apply(this,arguments)},isPointInCircle:function(a,b,c){return this.getDistance(a,b)<c},withinRadius:function(){return this.isPointInCircle.apply(this,arguments)},getRhumbLineBearing:function(a,b){var d=this.longitude(b).toRad()-this.longitude(a).toRad(),e=Math.log(Math.tan(this.latitude(b).toRad()/2+c.PI_DIV4)/Math.tan(this.latitude(a).toRad()/2+c.PI_DIV4));return Math.abs(d)>Math.PI&&(d=d>0?-1*(c.PI_X2-d):c.PI_X2+d),(Math.atan2(d,e).toDeg()+360)%360},getBearing:function(a,b){b.latitude=this.latitude(b),b.longitude=this.longitude(b),a.latitude=this.latitude(a),a.longitude=this.longitude(a);var c=(Math.atan2(Math.sin(b.longitude.toRad()-a.longitude.toRad())*Math.cos(b.latitude.toRad()),Math.cos(a.latitude.toRad())*Math.sin(b.latitude.toRad())-Math.sin(a.latitude.toRad())*Math.cos(b.latitude.toRad())*Math.cos(b.longitude.toRad()-a.longitude.toRad())).toDeg()+360)%360;return c},getCompassDirection:function(a,b,c){var d,e;switch(e="circle"==c?this.getBearing(a,b):this.getRhumbLineBearing(a,b),Math.round(e/22.5)){case 1:d={exact:"NNE",rough:"N"};break;case 2:d={exact:"NE",rough:"N"};break;case 3:d={exact:"ENE",rough:"E"};break;case 4:d={exact:"E",rough:"E"};break;case 5:d={exact:"ESE",rough:"E"};break;case 6:d={exact:"SE",rough:"E"};break;case 7:d={exact:"SSE",rough:"S"};break;case 8:d={exact:"S",rough:"S"};break;case 9:d={exact:"SSW",rough:"S"};break;case 10:d={exact:"SW",rough:"S"};break;case 11:d={exact:"WSW",rough:"W"};break;case 12:d={exact:"W",rough:"W"};break;case 13:d={exact:"WNW",rough:"W"};break;case 14:d={exact:"NW",rough:"W"};break;case 15:d={exact:"NNW",rough:"N"};break;default:d={exact:"N",rough:"N"}}return d.bearing=e,d},getDirection:function(a,b,c){return this.getCompassDirection.apply(this,arguments)},orderByDistance:function(a,b){var c=[];for(var d in b){var e=this.getDistance(a,b[d]),f=Object(b[d]);f.distance=e,f.key=d,c.push(f)}return c.sort(function(a,b){return a.distance-b.distance})},isPointInLine:function(a,b,c){return this.getDistance(b,a,1,3)+this.getDistance(a,c,1,3)==this.getDistance(b,c,1,3)},isPointNearLine:function(a,b,c,d){return this.getDistanceFromLine(a,b,c)<d},getDistanceFromLine:function(a,b,c){var d=this.getDistance(b,a,1,3),e=this.getDistance(a,c,1,3),f=this.getDistance(b,c,1,3),g=0,h=Math.acos((d*d+f*f-e*e)/(2*d*f)),i=Math.acos((e*e+f*f-d*d)/(2*e*f));return g=h>Math.PI/2?d:i>Math.PI/2?e:Math.sin(h)/d},findNearest:function(a,b,c,d){c=c||0,d=d||1;var e=this.orderByDistance(a,b);return 1===d?e[c]:e.splice(c,d)},getPathLength:function(a){for(var b,c=0,d=0,e=a.length;e>d;++d)b&&(c+=this.getDistance(this.coords(a[d]),b)),b=this.coords(a[d]);return c},getSpeed:function(a,b,c){var e=c&&c.unit||"km";"mph"==e?e="mi":"kmh"==e&&(e="km");var f=d.getDistance(a,b),g=1*b.time/1e3-1*a.time/1e3,h=f/g*3600,i=Math.round(h*this.measures[e]*1e4)/1e4;return i},computeDestinationPoint:function(a,b,c,d){var e=this.latitude(a),f=this.longitude(a);d="undefined"==typeof d?this.radius:Number(d);var g=Number(b)/d,h=Number(c).toRad(),i=Number(e).toRad(),j=Number(f).toRad(),k=Math.asin(Math.sin(i)*Math.cos(g)+Math.cos(i)*Math.sin(g)*Math.cos(h)),l=j+Math.atan2(Math.sin(h)*Math.sin(g)*Math.cos(i),Math.cos(g)-Math.sin(i)*Math.sin(k));return l=(l+3*Math.PI)%(2*Math.PI)-Math.PI,{latitude:k.toDeg(),longitude:l.toDeg()}},convertUnit:function(a,b,c){if(0===b)return 0;if("undefined"==typeof b){if(null===this.distance)throw new Error("No distance was given");if(0===this.distance)return 0;b=this.distance}if(a=a||"m",c=null==c?4:c,"undefined"!=typeof this.measures[a])return this.round(b*this.measures[a],c);throw new Error("Unknown unit for conversion.")},useDecimal:function(a){if("[object Array]"===Object.prototype.toString.call(a)){var b=this;return a=a.map(function(a){if(b.isDecimal(a))return b.useDecimal(a);if("object"==typeof a){if(b.validate(a))return b.coords(a);for(var c in a)a[c]=b.useDecimal(a[c]);return a}return b.isSexagesimal(a)?b.sexagesimal2decimal(a):a})}if("object"==typeof a&&this.validate(a))return this.coords(a);if("object"==typeof a){for(var c in a)a[c]=this.useDecimal(a[c]);return a}if(this.isDecimal(a))return parseFloat(a);if(this.isSexagesimal(a)===!0)return parseFloat(this.sexagesimal2decimal(a));throw new Error("Unknown format.")},decimal2sexagesimal:function(a){if(a in this.sexagesimal)return this.sexagesimal[a];var b=a.toString().split("."),c=Math.abs(b[0]),d=60*("0."+(b[1]||0)),e=d.toString().split(".");return d=Math.floor(d),e=(60*("0."+(e[1]||0))).toFixed(2),this.sexagesimal[a]=c+"° "+d+"' "+e+'"',this.sexagesimal[a]},sexagesimal2decimal:function(a){if(a in this.decimal)return this.decimal[a];var b=new RegExp(this.sexagesimalPattern),c=b.exec(a),d=0,e=0;c&&(d=parseFloat(c[2]/60),e=parseFloat(c[4]/3600)||0);var f=(parseFloat(c[1])+d+e).toFixed(8);return f="S"==c[7]||"W"==c[7]?parseFloat(-f):parseFloat(f),this.decimal[a]=f,f},isDecimal:function(a){return a=a.toString().replace(/\s*/,""),!isNaN(parseFloat(a))&&parseFloat(a)==a},isSexagesimal:function(a){return a=a.toString().replace(/\s*/,""),this.sexagesimalPattern.test(a)},round:function(a,b){var c=Math.pow(10,b);return Math.round(a*c)/c}}),"undefined"!=typeof module&&"undefined"!=typeof module.exports?(module.exports=d,"object"==typeof a&&(a.geolib=d)):"function"==typeof define&&define.amd?define("geolib",[],function(){return d}):a.geolib=d}(this);

;(function(global, undefined) {

    "use strict";

    function Geolib() {}

    // Constants
    Geolib.TO_RAD = Math.PI / 180;
    Geolib.TO_DEG = 180 / Math.PI;
    Geolib.PI_X2 = Math.PI * 2;
    Geolib.PI_DIV4 = Math.PI / 4;

    // Setting readonly defaults
    var geolib = Object.create(Geolib.prototype, {
        version: {
            value: "$version$"
        },
        radius: {
            value: 6378137
        },
        minLat: {
            value: -90
        },
        maxLat: {
            value: 90
        },
        minLon: {
            value: -180
        },
        maxLon: {
            value: 180
        },
        sexagesimalPattern: {
            value: /^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,2}))?)'\s*(([0-9]{1,3}(\.([0-9]{1,4}))?)"\s*)?([NEOSW]?)$/
        },
        measures: {
            value: Object.create(Object.prototype, {
                "m" : {value: 1},
                "km": {value: 0.001},
                "cm": {value: 100},
                "mm": {value: 1000},
                "mi": {value: (1 / 1609.344)},
                "sm": {value: (1 / 1852.216)},
                "ft": {value: (100 / 30.48)},
                "in": {value: (100 / 2.54)},
                "yd": {value: (1 / 0.9144)}
            })
        },
        prototype: {
            value: Geolib.prototype
        },
        extend: {
            value: function(methods, overwrite) {
                for(var prop in methods) {
                    if(typeof geolib.prototype[prop] === 'undefined' || overwrite === true) {
                        if(typeof methods[prop] === 'function' && typeof methods[prop].bind === 'function') {
                            geolib.prototype[prop] = methods[prop].bind(geolib);
                        } else {
                            geolib.prototype[prop] = methods[prop];
                        }
                    }
                }
            }
        }
    });

    if (typeof(Number.prototype.toRad) === 'undefined') {
        Number.prototype.toRad = function() {
            return this * Geolib.TO_RAD;
        };
    }

    if (typeof(Number.prototype.toDeg) === 'undefined') {
        Number.prototype.toDeg = function() {
            return this * Geolib.TO_DEG;
        };
    }

    // Here comes the magic
    geolib.extend({

        decimal: {},

        sexagesimal: {},

        distance: null,

        getKeys: function(point) {

            // GeoJSON Array [longitude, latitude(, elevation)]
            if(Object.prototype.toString.call(point) == '[object Array]') {
               console.log('inside GEOJSON array');
                return {
                    longitude: point.length >= 1 ? 0 : undefined,
                    latitude: point.length >= 2 ? 1 : undefined,
                    elevation: point.length >= 3 ? 2 : undefined
                };

            }

            var getKey = function(possibleValues) {
               console.log('possible values:', possibleValues);
                var key;

                possibleValues.every(function(val) {
                    // TODO: check if point is an object
                    if(typeof point != 'object') {
                       console.log(typeof point, 'typeof point:');
                        return true;
                    }
                    return point.hasOwnProperty(val) ? (function() { key = val; return false; }()) : true;
                });

                return key;

            };

            var longitude = getKey(['lng', 'lon', 'longitude']);
            var latitude = getKey(['lat', 'latitude']);
            var elevation = getKey(['alt', 'altitude', 'elevation', 'elev']);
            console.log('long:', longitude, 'lat:', latitude, 'elevation:', elevation);

            // return undefined if not at least one valid property was found
            if(typeof latitude == 'undefined' &&
                typeof longitude == 'undefined' &&
                typeof elevation == 'undefined') {
                return undefined;
            }

            return {
                latitude: latitude,
                longitude: longitude,
                elevation: elevation
            };

        },

        // returns latitude of a given point, converted to decimal
        // set raw to true to avoid conversion
        getLat: function(point, raw) {
            console.log('point:', point, 'raw:', raw)
            console.log('getKeys result:', this.getKeys(point));
            return raw === true ? point[this.getKeys(point).latitude] : this.useDecimal(point[this.getKeys(point).latitude]);
        },

        // Alias for getLat
        latitude: function(point) {
            return this.getLat.call(this, point);
        },

        // returns longitude of a given point, converted to decimal
        // set raw to true to avoid conversion
        getLon: function(point, raw) {
            return raw === true ? point[this.getKeys(point).longitude] : this.useDecimal(point[this.getKeys(point).longitude]);
        },

        // Alias for getLon
        longitude: function(point) {
            return this.getLon.call(this, point);
        },

        getElev: function(point) {
            return point[this.getKeys(point).elevation];
        },

        // Alias for getElev
        elevation: function(point) {
            return this.getElev.call(this, point);
        },

        coords: function(point, raw) {

            var retval = {
                latitude: raw === true ? point[this.getKeys(point).latitude] : this.useDecimal(point[this.getKeys(point).latitude]),
                longitude: raw === true ? point[this.getKeys(point).longitude] : this.useDecimal(point[this.getKeys(point).longitude])
            };

            var elev = point[this.getKeys(point).elevation];

            if(typeof elev !== 'undefined') {
                retval['elevation'] = elev;
            }

            return retval;

        },

        // Alias for coords
        ll: function(point, raw) {
            return this.coords.call(this, point, raw);
        },


        // checks if a variable contains a valid latlong object
        validate: function(point) {

            var keys = this.getKeys(point);

            if(typeof keys === 'undefined' || typeof keys.latitude === 'undefined' || keys.longitude === 'undefined') {
                return false;
            }

            var lat = point[keys.latitude];
            var lng = point[keys.longitude];

            if(typeof lat === 'undefined' || !this.isDecimal(lat) && !this.isSexagesimal(lat)) {
                return false;
            }

            if(typeof lng === 'undefined' || !this.isDecimal(lng) && !this.isSexagesimal(lng)) {
                return false;
            }

            lat = this.useDecimal(lat);
            lng = this.useDecimal(lng);

            if(lat < this.minLat || lat > this.maxLat || lng < this.minLon || lng > this.maxLon) {
                return false;
            }

            return true;

        },

        /**
        * Calculates geodetic distance between two points specified by latitude/longitude using
        * Vincenty inverse formula for ellipsoids
        * Vincenty Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2010
        * (Licensed under CC BY 3.0)
        *
        * @param    object    Start position {latitude: 123, longitude: 123}
        * @param    object    End position {latitude: 123, longitude: 123}
        * @param    integer   Accuracy (in meters)
        * @param    integer   Precision (in decimal cases)
        * @return   integer   Distance (in meters)
        */
        getDistance: function(start, end, accuracy, precision) {

            accuracy = Math.floor(accuracy) || 1;
            precision = Math.floor(precision) || 0;

            var s = this.coords(start);
            var e = this.coords(end);

            var a = 6378137, b = 6356752.314245,  f = 1/298.257223563;  // WGS-84 ellipsoid params
            var L = (e['longitude']-s['longitude']).toRad();

            var cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM, sinSigma;

            var U1 = Math.atan((1-f) * Math.tan(parseFloat(s['latitude']).toRad()));
            var U2 = Math.atan((1-f) * Math.tan(parseFloat(e['latitude']).toRad()));
            var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
            var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

            var lambda = L, lambdaP, iterLimit = 100;
            do {
                var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
                sinSigma = (
                    Math.sqrt(
                        (
                            cosU2 * sinLambda
                        ) * (
                            cosU2 * sinLambda
                        ) + (
                            cosU1 * sinU2 - sinU1 * cosU2 * cosLambda
                        ) * (
                            cosU1 * sinU2 - sinU1 * cosU2 * cosLambda
                        )
                    )
                );
                if (sinSigma === 0) {
                    return geolib.distance = 0;  // co-incident points
                }

                cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
                sigma = Math.atan2(sinSigma, cosSigma);
                sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
                cosSqAlpha = 1 - sinAlpha * sinAlpha;
                cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;

                if (isNaN(cos2SigmaM)) {
                    cos2SigmaM = 0;  // equatorial line: cosSqAlpha=0 (§6)
                }
                var C = (
                    f / 16 * cosSqAlpha * (
                        4 + f * (
                            4 - 3 * cosSqAlpha
                        )
                    )
                );
                lambdaP = lambda;
                lambda = (
                    L + (
                        1 - C
                    ) * f * sinAlpha * (
                        sigma + C * sinSigma * (
                            cos2SigmaM + C * cosSigma * (
                                -1 + 2 * cos2SigmaM * cos2SigmaM
                            )
                        )
                    )
                );

            } while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0);

            if (iterLimit === 0) {
                return NaN;  // formula failed to converge
            }

            var uSq = (
                cosSqAlpha * (
                    a * a - b * b
                ) / (
                    b*b
                )
            );

            var A = (
                1 + uSq / 16384 * (
                    4096 + uSq * (
                        -768 + uSq * (
                            320 - 175 * uSq
                        )
                    )
                )
            );

            var B = (
                uSq / 1024 * (
                    256 + uSq * (
                        -128 + uSq * (
                            74-47 * uSq
                        )
                    )
                )
            );

            var deltaSigma = (
                B * sinSigma * (
                    cos2SigmaM + B / 4 * (
                        cosSigma * (
                            -1 + 2 * cos2SigmaM * cos2SigmaM
                        ) -B / 6 * cos2SigmaM * (
                            -3 + 4 * sinSigma * sinSigma
                        ) * (
                            -3 + 4 * cos2SigmaM * cos2SigmaM
                        )
                    )
                )
            );

            var distance = b * A * (sigma - deltaSigma);

            distance = distance.toFixed(precision); // round to 1mm precision

            //if (start.hasOwnProperty(elevation) && end.hasOwnProperty(elevation)) {
            if (typeof this.elevation(start) !== 'undefined' && typeof this.elevation(end) !== 'undefined') {
                var climb = Math.abs(this.elevation(start) - this.elevation(end));
                distance = Math.sqrt(distance * distance + climb * climb);
            }

            return this.distance = parseFloat((Math.round(distance / accuracy) * accuracy).toFixed(precision));

            /*
            // note: to return initial/final bearings in addition to distance, use something like:
            var fwdAz = Math.atan2(cosU2*sinLambda,  cosU1*sinU2-sinU1*cosU2*cosLambda);
            var revAz = Math.atan2(cosU1*sinLambda, -sinU1*cosU2+cosU1*sinU2*cosLambda);

            return { distance: s, initialBearing: fwdAz.toDeg(), finalBearing: revAz.toDeg() };
            */

        },


        /**
        * Calculates the distance between two spots.
        * This method is more simple but also far more inaccurate
        *
        * @param    object    Start position {latitude: 123, longitude: 123}
        * @param    object    End position {latitude: 123, longitude: 123}
        * @param    integer   Accuracy (in meters)
        * @return   integer   Distance (in meters)
        */
        getDistanceSimple: function(start, end, accuracy) {

            accuracy = Math.floor(accuracy) || 1;

            var distance =
                Math.round(
                    Math.acos(
                        Math.sin(
                            this.latitude(end).toRad()
                        ) *
                        Math.sin(
                            this.latitude(start).toRad()
                        ) +
                        Math.cos(
                            this.latitude(end).toRad()
                        ) *
                        Math.cos(
                            this.latitude(start).toRad()
                        ) *
                        Math.cos(
                            this.longitude(start).toRad() - this.longitude(end).toRad()
                        )
                    ) * this.radius
                );

            return geolib.distance = Math.floor(Math.round(distance/accuracy)*accuracy);

        },


    /**
        * Calculates the center of a collection of geo coordinates
        *
        * @param        array       Collection of coords [{latitude: 51.510, longitude: 7.1321}, {latitude: 49.1238, longitude: "8° 30' W"}, ...]
        * @return       object      {latitude: centerLat, longitude: centerLng}
        */
        getCenter: function(coords) {

            var coordsArray = coords;
            if(typeof coords === 'object' && !(coords instanceof Array)) {

                coordsArray = [];

                for(var key in coords) {
                    coordsArray.push(
                        this.coords(coords[key])
                    );
                }

            }

            if(!coordsArray.length) {
                return false;
            }

            var X = 0.0;
            var Y = 0.0;
            var Z = 0.0;
            var lat, lon, hyp;

            coordsArray.forEach(function(coord) {

                lat = this.latitude(coord).toRad();
                lon = this.longitude(coord).toRad();

                X += Math.cos(lat) * Math.cos(lon);
                Y += Math.cos(lat) * Math.sin(lon);
                Z += Math.sin(lat);

            }, this);

            var nb_coords = coordsArray.length;
            X = X / nb_coords;
            Y = Y / nb_coords;
            Z = Z / nb_coords;

            lon = Math.atan2(Y, X);
            hyp = Math.sqrt(X * X + Y * Y);
            lat = Math.atan2(Z, hyp);

            return {
                latitude: (lat * Geolib.TO_DEG).toFixed(6),
                longitude: (lon * Geolib.TO_DEG).toFixed(6)
            };

        },


        /**
        * Gets the max and min, latitude, longitude, and elevation (if provided).
        * @param        array       array with coords e.g. [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        * @return   object      {maxLat: maxLat,
        *                     minLat: minLat
        *                     maxLng: maxLng,
        *                     minLng: minLng,
        *                     maxElev: maxElev,
        *                     minElev: minElev}
        */
        getBounds: function(coords) {

            if (!coords.length) {
                return false;
            }

            var useElevation = this.elevation(coords[0]);

            var stats = {
                maxLat: -Infinity,
                minLat: Infinity,
                maxLng: -Infinity,
                minLng: Infinity
            };

            if (typeof useElevation != 'undefined') {
                stats.maxElev = 0;
                stats.minElev = Infinity;
            }

            for (var i = 0, l = coords.length; i < l; ++i) {

                stats.maxLat = Math.max(this.latitude(coords[i]), stats.maxLat);
                stats.minLat = Math.min(this.latitude(coords[i]), stats.minLat);
                stats.maxLng = Math.max(this.longitude(coords[i]), stats.maxLng);
                stats.minLng = Math.min(this.longitude(coords[i]), stats.minLng);

                if (useElevation) {
                    stats.maxElev = Math.max(this.elevation(coords[i]), stats.maxElev);
                    stats.minElev = Math.min(this.elevation(coords[i]), stats.minElev);
                }

            }

            return stats;

        },

        /**
        * Calculates the center of the bounds of geo coordinates.
        *
        * On polygons like political borders (eg. states)
        * this may gives a closer result to human expectation, than `getCenter`,
        * because that function can be disturbed by uneven distribution of
        * point in different sides.
        * Imagine the US state Oklahoma: `getCenter` on that gives a southern
        * point, because the southern border contains a lot more nodes,
        * than the others.
        *
        * @param        array       Collection of coords [{latitude: 51.510, longitude: 7.1321}, {latitude: 49.1238, longitude: "8° 30' W"}, ...]
        * @return       object      {latitude: centerLat, longitude: centerLng}
        */
        getCenterOfBounds: function(coords) {
            var b = this.getBounds(coords);
            var latitude = b.minLat + ((b.maxLat - b.minLat) / 2);
            var longitude = b.minLng + ((b.maxLng - b.minLng) / 2);
            return {
                latitude: parseFloat(latitude.toFixed(6)),
                longitude: parseFloat(longitude.toFixed(6))
            };
        },


        /**
        * Computes the bounding coordinates of all points on the surface
        * of the earth less than or equal to the specified great circle
        * distance.
        *
        * @param object Point position {latitude: 123, longitude: 123}
        * @param number Distance (in meters).
        * @return array Collection of two points defining the SW and NE corners.
        */
        getBoundsOfDistance: function(point, distance) {

            var latitude = this.latitude(point);
            var longitude = this.longitude(point);

            var radLat = latitude.toRad();
            var radLon = longitude.toRad();

            var radDist = distance / this.radius;
            var minLat = radLat - radDist;
            var maxLat = radLat + radDist;

            var MAX_LAT_RAD = this.maxLat.toRad();
            var MIN_LAT_RAD = this.minLat.toRad();
            var MAX_LON_RAD = this.maxLon.toRad();
            var MIN_LON_RAD = this.minLon.toRad();

            var minLon;
            var maxLon;

            if (minLat > MIN_LAT_RAD && maxLat < MAX_LAT_RAD) {

                var deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
                minLon = radLon - deltaLon;

                if (minLon < MIN_LON_RAD) {
                    minLon += Geolib.PI_X2;
                }

                maxLon = radLon + deltaLon;

                if (maxLon > MAX_LON_RAD) {
                    maxLon -= Geolib.PI_X2;
                }

            } else {
                // A pole is within the distance.
                minLat = Math.max(minLat, MIN_LAT_RAD);
                maxLat = Math.min(maxLat, MAX_LAT_RAD);
                minLon = MIN_LON_RAD;
                maxLon = MAX_LON_RAD;
            }

            return [
                // Southwest
                {
                    latitude: minLat.toDeg(),
                    longitude: minLon.toDeg()
                },
                // Northeast
                {
                    latitude: maxLat.toDeg(),
                    longitude: maxLon.toDeg()
                }
            ];

        },


        /**
        * Checks whether a point is inside of a polygon or not.
        * Note that the polygon coords must be in correct order!
        *
        * @param        object      coordinate to check e.g. {latitude: 51.5023, longitude: 7.3815}
        * @param        array       array with coords e.g. [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        * @return       bool        true if the coordinate is inside the given polygon
        */
        isPointInside: function(latlng, coords) {

            for(var c = false, i = -1, l = coords.length, j = l - 1; ++i < l; j = i) {

                if(
                    (
                        (this.longitude(coords[i]) <= this.longitude(latlng) && this.longitude(latlng) < this.longitude(coords[j])) ||
                        (this.longitude(coords[j]) <= this.longitude(latlng) && this.longitude(latlng) < this.longitude(coords[i]))
                    ) &&
                    (
                        this.latitude(latlng) < (this.latitude(coords[j]) - this.latitude(coords[i])) *
                        (this.longitude(latlng) - this.longitude(coords[i])) /
                        (this.longitude(coords[j]) - this.longitude(coords[i])) +
                        this.latitude(coords[i])
                    )
                ) {
                    c = !c;
                }

            }

            return c;

        },


       /**
        * Pre calculate the polygon coords, to speed up the point inside check.
        * Use this function before calling isPointInsideWithPreparedPolygon()
        * @see          Algorythm from http://alienryderflex.com/polygon/
        * @param        array       array with coords e.g. [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        */
        preparePolygonForIsPointInsideOptimized: function(coords) {

            for(var i = 0, j = coords.length-1; i < coords.length; i++) {

            if(this.longitude(coords[j]) === this.longitude(coords[i])) {

                    coords[i].constant = this.latitude(coords[i]);
                    coords[i].multiple = 0;

                } else {

                    coords[i].constant = this.latitude(coords[i]) - (
                        this.longitude(coords[i]) * this.latitude(coords[j])
                    ) / (
                        this.longitude(coords[j]) - this.longitude(coords[i])
                    ) + (
                        this.longitude(coords[i])*this.latitude(coords[i])
                    ) / (
                        this.longitude(coords[j])-this.longitude(coords[i])
                    );

                    coords[i].multiple = (
                        this.latitude(coords[j])-this.latitude(coords[i])
                    ) / (
                        this.longitude(coords[j])-this.longitude(coords[i])
                    );

                }

                j=i;

            }

        },

      /**
       * Checks whether a point is inside of a polygon or not.
       * "This is useful if you have many points that need to be tested against the same (static) polygon."
       * Please call the function preparePolygonForIsPointInsideOptimized() with the same coords object before using this function.
       * Note that the polygon coords must be in correct order!
       *
       * @see          Algorythm from http://alienryderflex.com/polygon/
       *
       * @param     object      coordinate to check e.g. {latitude: 51.5023, longitude: 7.3815}
       * @param     array       array with coords e.g. [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
       * @return        bool        true if the coordinate is inside the given polygon
       */
        isPointInsideWithPreparedPolygon: function(point, coords) {

            var flgPointInside = false,
            y = this.longitude(point),
            x = this.latitude(point);

            for(var i = 0, j = coords.length-1; i < coords.length; i++) {

                if ((this.longitude(coords[i]) < y && this.longitude(coords[j]) >=y ||
                    this.longitude(coords[j]) < y && this.longitude(coords[i]) >= y)) {

                    flgPointInside^=(y*coords[i].multiple+coords[i].constant < x);

                }

                j=i;

            }

            return flgPointInside;

        },


        /**
        * Shortcut for geolib.isPointInside()
        */
        isInside: function() {
            return this.isPointInside.apply(this, arguments);
        },


        /**
        * Checks whether a point is inside of a circle or not.
        *
        * @param        object      coordinate to check (e.g. {latitude: 51.5023, longitude: 7.3815})
        * @param        object      coordinate of the circle's center (e.g. {latitude: 51.4812, longitude: 7.4025})
        * @param        integer     maximum radius in meters
        * @return       bool        true if the coordinate is within the given radius
        */
        isPointInCircle: function(latlng, center, radius) {
            return this.getDistance(latlng, center) < radius;
        },


        /**
        * Shortcut for geolib.isPointInCircle()
        */
        withinRadius: function() {
            return this.isPointInCircle.apply(this, arguments);
        },


        /**
        * Gets rhumb line bearing of two points. Find out about the difference between rhumb line and
        * great circle bearing on Wikipedia. It's quite complicated. Rhumb line should be fine in most cases:
        *
        * http://en.wikipedia.org/wiki/Rhumb_line#General_and_mathematical_description
        *
        * Function heavily based on Doug Vanderweide's great PHP version (licensed under GPL 3.0)
        * http://www.dougv.com/2009/07/13/calculating-the-bearing-and-compass-rose-direction-between-two-latitude-longitude-coordinates-in-php/
        *
        * @param        object      origin coordinate (e.g. {latitude: 51.5023, longitude: 7.3815})
        * @param        object      destination coordinate
        * @return       integer     calculated bearing
        */
        getRhumbLineBearing: function(originLL, destLL) {

            // difference of longitude coords
            var diffLon = this.longitude(destLL).toRad() - this.longitude(originLL).toRad();

            // difference latitude coords phi
            var diffPhi = Math.log(
                Math.tan(
                    this.latitude(destLL).toRad() / 2 + Geolib.PI_DIV4
                ) /
                Math.tan(
                    this.latitude(originLL).toRad() / 2 + Geolib.PI_DIV4
                )
            );

            // recalculate diffLon if it is greater than pi
            if(Math.abs(diffLon) > Math.PI) {
                if(diffLon > 0) {
                    diffLon = (Geolib.PI_X2 - diffLon) * -1;
                }
                else {
                    diffLon = Geolib.PI_X2 + diffLon;
                }
            }

            //return the angle, normalized
            return (Math.atan2(diffLon, diffPhi).toDeg() + 360) % 360;

        },


        /**
        * Gets great circle bearing of two points. See description of getRhumbLineBearing for more information
        *
        * @param        object      origin coordinate (e.g. {latitude: 51.5023, longitude: 7.3815})
        * @param        object      destination coordinate
        * @return       integer     calculated bearing
        */
        getBearing: function(originLL, destLL) {

            destLL['latitude'] = this.latitude(destLL);
            destLL['longitude'] = this.longitude(destLL);
            originLL['latitude'] = this.latitude(originLL);
            originLL['longitude'] = this.longitude(originLL);

            var bearing = (
                (
                    Math.atan2(
                        Math.sin(
                            destLL['longitude'].toRad() -
                            originLL['longitude'].toRad()
                        ) *
                        Math.cos(
                            destLL['latitude'].toRad()
                        ),
                        Math.cos(
                            originLL['latitude'].toRad()
                        ) *
                        Math.sin(
                            destLL['latitude'].toRad()
                        ) -
                        Math.sin(
                            originLL['latitude'].toRad()
                        ) *
                        Math.cos(
                            destLL['latitude'].toRad()
                        ) *
                        Math.cos(
                            destLL['longitude'].toRad() - originLL['longitude'].toRad()
                        )
                    )
                ).toDeg() + 360
            ) % 360;

            return bearing;

        },


        /**
        * Gets the compass direction from an origin coordinate to a destination coordinate.
        *
        * @param        object      origin coordinate (e.g. {latitude: 51.5023, longitude: 7.3815})
        * @param        object      destination coordinate
        * @param        string      Bearing mode. Can be either circle or rhumbline
        * @return       object      Returns an object with a rough (NESW) and an exact direction (NNE, NE, ENE, E, ESE, etc).
        */
        getCompassDirection: function(originLL, destLL, bearingMode) {

            var direction;
            var bearing;

            if(bearingMode == 'circle') {
                // use great circle bearing
                bearing = this.getBearing(originLL, destLL);
            } else {
                // default is rhumb line bearing
                bearing = this.getRhumbLineBearing(originLL, destLL);
            }

            switch(Math.round(bearing/22.5)) {
                case 1:
                    direction = {exact: "NNE", rough: "N"};
                    break;
                case 2:
                    direction = {exact: "NE", rough: "N"};
                    break;
                case 3:
                    direction = {exact: "ENE", rough: "E"};
                    break;
                case 4:
                    direction = {exact: "E", rough: "E"};
                    break;
                case 5:
                    direction = {exact: "ESE", rough: "E"};
                    break;
                case 6:
                    direction = {exact: "SE", rough: "E"};
                    break;
                case 7:
                    direction = {exact: "SSE", rough: "S"};
                    break;
                case 8:
                    direction = {exact: "S", rough: "S"};
                    break;
                case 9:
                    direction = {exact: "SSW", rough: "S"};
                    break;
                case 10:
                    direction = {exact: "SW", rough: "S"};
                    break;
                case 11:
                    direction = {exact: "WSW", rough: "W"};
                    break;
                case 12:
                    direction = {exact: "W", rough: "W"};
                    break;
                case 13:
                    direction = {exact: "WNW", rough: "W"};
                    break;
                case 14:
                    direction = {exact: "NW", rough: "W"};
                    break;
                case 15:
                    direction = {exact: "NNW", rough: "N"};
                    break;
                default:
                    direction = {exact: "N", rough: "N"};
            }

            direction['bearing'] = bearing;
            return direction;

        },


        /**
        * Shortcut for getCompassDirection
        */
        getDirection: function(originLL, destLL, bearingMode) {
            return this.getCompassDirection.apply(this, arguments);
        },


        /**
        * Sorts an array of coords by distance from a reference coordinate
        *
        * @param        object      reference coordinate e.g. {latitude: 51.5023, longitude: 7.3815}
        * @param        mixed       array or object with coords [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        * @return       array       ordered array
        */
        orderByDistance: function(latlng, coords) {

            var coordsArray = [];

            for(var coord in coords) {

                var distance = this.getDistance(latlng, coords[coord]);
                var augmentedCoord = Object(coords[coord]);
                augmentedCoord.distance = distance;
                augmentedCoord.key = coord;

                coordsArray.push(augmentedCoord);

            }

            return coordsArray.sort(function(a, b) {
                return a.distance - b.distance;
            });

        },

        /**
        * Check if a point lies in line created by two other points
        *
        * @param    object    Point to check: {latitude: 123, longitude: 123}
        * @param    object    Start of line {latitude: 123, longitude: 123}
        * @param    object    End of line {latitude: 123, longitude: 123}
        * @return   boolean
        */
        isPointInLine: function(point, start, end) {

            return this.getDistance(start, point, 1, 3)+this.getDistance(point, end, 1, 3)==this.getDistance(start, end, 1, 3);
        },

                /**
        * Check if a point lies within a given distance from a line created by two other points
        *
        * @param    object    Point to check: {latitude: 123, longitude: 123}
        * @param    object    Start of line {latitude: 123, longitude: 123}
        * @param    object    End of line {latitude: 123, longitude: 123}
        * @pararm   float     maximum distance from line
        * @return   boolean
        */
        isPointNearLine: function(point, start, end, distance) {
            return this.getDistanceFromLine(point, start, end) < distance;
        },

                     /**
        * return the minimum distance from a point to a line
        *
        * @param    object    Point away from line
        * @param    object    Start of line {latitude: 123, longitude: 123}
        * @param    object    End of line {latitude: 123, longitude: 123}
        * @return   float     distance from point to line
        */
        getDistanceFromLine: function(point, start, end) {
            var d1 = this.getDistance(start, point, 1, 3);
            var d2 = this.getDistance(point, end, 1, 3);
            var d3 = this.getDistance(start, end, 1, 3);
            var distance = 0;

            // alpha is the angle between the line from start to point, and from start to end //
            var alpha = Math.acos((d1*d1 + d3*d3 - d2*d2)/(2*d1*d3));
            // beta is the angle between the line from end to point and from end to start //
            var beta = Math.acos((d2*d2 + d3*d3 - d1*d1)/(2*d2*d3));

            // if the angle is greater than 90 degrees, then the minimum distance is the
            // line from the start to the point //
            if(alpha>Math.PI/2) {
                distance = d1;
            }
            // same for the beta //
            else if(beta > Math.PI/2) {
                distance = d2;
            }
            // otherwise the minimum distance is achieved through a line perpendular to the start-end line,
            // which goes from the start-end line to the point //
            else {
                distance = Math.sin(alpha) * d1;
            }

            return distance;
        },

        /**
        * Finds the nearest coordinate to a reference coordinate
        *
        * @param        object      reference coordinate e.g. {latitude: 51.5023, longitude: 7.3815}
        * @param        mixed       array or object with coords [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        * @return       array       ordered array
        */
        findNearest: function(latlng, coords, offset, limit) {

            offset = offset || 0;
            limit = limit || 1;
            var ordered = this.orderByDistance(latlng, coords);

            if(limit === 1) {
                return ordered[offset];
            } else {
                return ordered.splice(offset, limit);
            }

        },


        /**
        * Calculates the length of a given path
        *
        * @param        mixed       array or object with coords [{latitude: 51.5143, longitude: 7.4138}, {latitude: 123, longitude: 123}, ...]
        * @return       integer     length of the path (in meters)
        */
        getPathLength: function(coords) {

            var dist = 0;
            var last;

            for (var i = 0, l = coords.length; i < l; ++i) {
                if(last) {
                    //console.log(coords[i], last, this.getDistance(coords[i], last));
                    dist += this.getDistance(this.coords(coords[i]), last);
                }
                last = this.coords(coords[i]);
            }

            return dist;

        },


        /**
        * Calculates the speed between to points within a given time span.
        *
        * @param        object      coords with javascript timestamp {latitude: 51.5143, longitude: 7.4138, time: 1360231200880}
        * @param        object      coords with javascript timestamp {latitude: 51.5502, longitude: 7.4323, time: 1360245600460}
        * @param        object      options (currently "unit" is the only option. Default: km(h));
        * @return       float       speed in unit per hour
        */
        getSpeed: function(start, end, options) {

            var unit = options && options.unit || 'km';

            if(unit == 'mph') {
                unit = 'mi';
            } else if(unit == 'kmh') {
                unit = 'km';
            }

            var distance = geolib.getDistance(start, end);
            var time = ((end.time*1)/1000) - ((start.time*1)/1000);
            var mPerHr = (distance/time)*3600;
            var speed = Math.round(mPerHr * this.measures[unit] * 10000)/10000;
            return speed;

        },


        /**
         * Computes the destination point given an initial point, a distance
         * and a bearing
         *
         * see http://www.movable-type.co.uk/scripts/latlong.html for the original code
         *
         * @param        object     start coordinate (e.g. {latitude: 51.5023, longitude: 7.3815})
         * @param        float      longitude of the inital point in degree
         * @param        float      distance to go from the inital point in meter
         * @param        float      bearing in degree of the direction to go, e.g. 0 = north, 180 = south
         * @param        float      optional (in meter), defaults to mean radius of the earth
         * @return       object     {latitude: destLat (in degree), longitude: destLng (in degree)}
         */
        computeDestinationPoint: function(start, distance, bearing, radius) {

            var lat = this.latitude(start);
            var lng = this.longitude(start);

            radius = (typeof radius === 'undefined') ? this.radius : Number(radius);

            var δ = Number(distance) / radius; // angular distance in radians
            var θ = Number(bearing).toRad();

            var φ1 = Number(lat).toRad();
            var λ1 = Number(lng).toRad();

            var φ2 = Math.asin( Math.sin(φ1)*Math.cos(δ) +
                Math.cos(φ1)*Math.sin(δ)*Math.cos(θ) );
            var λ2 = λ1 + Math.atan2(Math.sin(θ)*Math.sin(δ)*Math.cos(φ1),
                    Math.cos(δ)-Math.sin(φ1)*Math.sin(φ2));
            λ2 = (λ2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180°

            return {
                latitude: φ2.toDeg(),
                longitude: λ2.toDeg()
            };

        },


        /**
        * Converts a distance from meters to km, mm, cm, mi, ft, in or yd
        *
        * @param        string      Format to be converted in
        * @param        float       Distance in meters
        * @param        float       Decimal places for rounding (default: 4)
        * @return       float       Converted distance
        */
        convertUnit: function(unit, distance, round) {

            if(distance === 0) {

                return 0;

            } else if(typeof distance === 'undefined') {

                if(this.distance === null) {
                    throw new Error('No distance was given');
                } else if(this.distance === 0) {
                    return 0;
                } else {
                    distance = this.distance;
                }

            }

            unit = unit || 'm';
            round = (null == round ? 4 : round);

            if(typeof this.measures[unit] !== 'undefined') {
                return this.round(distance * this.measures[unit], round);
            } else {
                throw new Error('Unknown unit for conversion.');
            }

        },


        /**
        * Checks if a value is in decimal format or, if neccessary, converts to decimal
        *
        * @param        mixed       Value(s) to be checked/converted (array of latlng objects, latlng object, sexagesimal string, float)
        * @return       float       Input data in decimal format
        */
        useDecimal: function(value) {

            if(Object.prototype.toString.call(value) === '[object Array]') {

                var geolib = this;

                value = value.map(function(val) {

                    //if(!isNaN(parseFloat(val))) {
                    if(geolib.isDecimal(val)) {

                        return geolib.useDecimal(val);

                    } else if(typeof val == 'object') {

                        if(geolib.validate(val)) {

                            return geolib.coords(val);

                        } else {

                            for(var prop in val) {
                                val[prop] = geolib.useDecimal(val[prop]);
                            }

                            return val;

                        }

                    } else if(geolib.isSexagesimal(val)) {

                        return geolib.sexagesimal2decimal(val);

                    } else {

                        return val;

                    }

                });

                return value;

            } else if(typeof value === 'object' && this.validate(value)) {

                return this.coords(value);

            } else if(typeof value === 'object') {

                for(var prop in value) {
                    value[prop] = this.useDecimal(value[prop]);
                }

                return value;

            }


            if (this.isDecimal(value)) {

                return parseFloat(value);

            } else if(this.isSexagesimal(value) === true) {

                return parseFloat(this.sexagesimal2decimal(value));

            }

            throw new Error('Unknown format.');

        },

        /**
        * Converts a decimal coordinate value to sexagesimal format
        *
        * @param        float       decimal
        * @return       string      Sexagesimal value (XX° YY' ZZ")
        */
        decimal2sexagesimal: function(dec) {

            if (dec in this.sexagesimal) {
                return this.sexagesimal[dec];
            }

            var tmp = dec.toString().split('.');

            var deg = Math.abs(tmp[0]);
            var min = ('0.' + (tmp[1] || 0))*60;
            var sec = min.toString().split('.');

            min = Math.floor(min);
            sec = (('0.' + (sec[1] || 0)) * 60).toFixed(2);

            this.sexagesimal[dec] = (deg + '° ' + min + "' " + sec + '"');

            return this.sexagesimal[dec];

        },


        /**
        * Converts a sexagesimal coordinate to decimal format
        *
        * @param        float       Sexagesimal coordinate
        * @return       string      Decimal value (XX.XXXXXXXX)
        */
        sexagesimal2decimal: function(sexagesimal) {

            if (sexagesimal in this.decimal) {
                return this.decimal[sexagesimal];
            }

            var regEx = new RegExp(this.sexagesimalPattern);
            var data = regEx.exec(sexagesimal);
            var min = 0, sec = 0;

            if(data) {
                min = parseFloat(data[2]/60);
                sec = parseFloat(data[4]/3600) || 0;
            }

            var dec = ((parseFloat(data[1]) + min + sec)).toFixed(8);
            //var   dec = ((parseFloat(data[1]) + min + sec));

                // South and West are negative decimals
                dec = (data[7] == 'S' || data[7] == 'W') ? parseFloat(-dec) : parseFloat(dec);
                //dec = (data[7] == 'S' || data[7] == 'W') ? -dec : dec;

            this.decimal[sexagesimal] = dec;

            return dec;

        },


        /**
        * Checks if a value is in decimal format
        *
        * @param        string      Value to be checked
        * @return       bool        True if in sexagesimal format
        */
        isDecimal: function(value) {

            value = value.toString().replace(/\s*/, '');

            // looks silly but works as expected
            // checks if value is in decimal format
            return (!isNaN(parseFloat(value)) && parseFloat(value) == value);

        },


        /**
        * Checks if a value is in sexagesimal format
        *
        * @param        string      Value to be checked
        * @return       bool        True if in sexagesimal format
        */
        isSexagesimal: function(value) {

            value = value.toString().replace(/\s*/, '');

            return this.sexagesimalPattern.test(value);

        },

        round: function(value, n) {
            var decPlace = Math.pow(10, n);
            return Math.round(value * decPlace)/decPlace;
        }

    });

    // Node module
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {

        module.exports = geolib;

        // react native
        if (typeof global === 'object') {
          global.geolib = geolib;
        }

    // AMD module
    } else if (typeof define === "function" && define.amd) {

        define("geolib", [], function () {
            return geolib;
        });

    // we're in a browser
    } else {

        global.geolib = geolib;

    }

}(this));
