const utilities = {
  getDistance(latU, longU, latP, longP) {
    return Math.sqrt(Math.pow((latP - latU) * 69.1128, 2) + Math.pow((longP - longU) * 57.2807, 2));
  }
}

export default utilities;
