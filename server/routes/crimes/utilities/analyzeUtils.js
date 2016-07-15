const utilities = {
  getDaysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
  },

  each(collection, callback) {
    if(Array.isArray(collection)) {
      for(var i = 0; i < collection.length; i++) {
        callback(collection[i], i, collection);
      }
    } else {
      for (var key in collection) {
        callback(collection[key], key, collection);
      }
    }
  }
}

export default utilities;
