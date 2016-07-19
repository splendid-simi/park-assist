const utilities = {
  buildQuery(hasEndDate, destLoc) {
    let loc = '';
    let endDateQuery = '';

    if(destLoc) {
      loc = ' AND within_box(map_point,' + destLoc + ')'
    }

    if(hasEndDate) {
      endDateQuery = ' AND ' + 'date_occurred < ' + '"' + (new Date().getFullYear()) + '-01-01' + '"'
    }

    let query = [
      'https:\/\/data.smgov.net/resource/kn6p-4y74.json?',
      '$select=date_occurred,ucr',
      '&$where=date_occurred > ' + '"' + (new Date().getFullYear()-3) + '-01-01' + '"' + endDateQuery,
      ' AND (ucr=' + "'" + '0640' + "'" + ' OR ucr= ' + "'" + '0650' + "'" + ' OR ucr=' +  "'" + '0804' + "'" + ' OR ucr=' + "'" + '0710' + "')",
      loc,
      '&$order=date_occurred desc'
    ]
    return query.join('');
  }
}

// const buildCrimeQuery = () => {
//   let url = 'https:\/\/data.smgov.net/resource/kn6p-4y74.json?'
//   let select = '$select=date_occurred,ucr'
//   let date = '&$where=date_occurred > ' + '"' + (new Date().getFullYear() - 3) + '-01-01' + '"'
//   let ucr = ' AND (ucr=' + "'" + '0640' + "'" + ' OR ucr= ' + "'" + '0650' + "'" + ' OR ucr=' +  "'" + '0804' + "'" + ' OR ucr=' + "'" + '0710' + "')"
//   let coords = ''
//   let order = '&$order=date_occurred desc'
//   if(destLoc) {
//     coords = ' AND within_box(map_point,' + destLoc + ')';
//   }
//
//   console.log('QUERY:', url + select + date + ucr + coords + order);
//   return url + select + date + ucr + coords + order;
// }

export default utilities;
