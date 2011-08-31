Date.prototype.formatDate = function(format) {
  var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
  var yyyy = this.getFullYear();
  var yy = yyyy.toString().substring(2);
  var m = this.getMonth() + 1;
  var mm = m < 10 ? "0" + m : m;
  var mmm = months[m - 1];
  var d = this.getDate();
  var dd = d < 10 ? "0" + d : d;
  
  var h = this.getHours();
  var hh = h < 10 ? "0" + h : h;
  var n = this.getMinutes();
  var nn = n < 10 ? "0" + n : n;
  var s = this.getSeconds();
  var ss = s < 10 ? "0" + s : s;

  format = format.replace(/yyyy/i, yyyy);
  format = format.replace(/yy/i, yy);
  format = format.replace(/mmm/i, mmm);
  format = format.replace(/mm/i, mm);
  format = format.replace(/m/i, m);
  format = format.replace(/dd/i, dd);
  format = format.replace(/d/i, d);
  format = format.replace(/hh/i, hh);
  format = format.replace(/h/i, h);
  format = format.replace(/nn/i, nn);
  format = format.replace(/n/i, n);
  format = format.replace(/ss/i, ss);
  format = format.replace(/s/i, s);

  return format;
};

Date.prototype.getMonthName = function() {
  switch(this.getMonth()) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
  }
}

Date.prototype.getShortMonthName = function() {
  return this.getMonthName().substring(0, 2);
}

Date.prototype.getDayName = function() {
  switch(this.getDay()) {
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    case 0:
      return 'Sunday';
  }
}

Date.prototype.getShortDayName = function() {
  return this.getDayName.substring(0, 2);
}
