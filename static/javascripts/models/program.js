var Program = Backbone.Model.extend({});

var Programs = Backbone.Collection.extend({
  model: Program,
  _parseDate: function(date) {
    parts = _.map(date.replace(/:|-/g, ' ').split(' '), function(n) {
      return parseInt(n.replace(/^0/, ''));
    });
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], 0);
  },

  parse: function(resp) {
    var context = this;
    return _.map(resp, function(p) {
      p.endtime = context._parseDate(p.endtime);
      p.lastmodified = context._parseDate(p.lastmodified);
      p.recendts = context._parseDate(p.recendts);
      p.recstartts = context._parseDate(p.recstartts);
      p.starttime = context._parseDate(p.starttime);
      p.id = p.chanid + "_" + p.recstartts.formatDate("yyyymmddhhnnss");
      return p;
    });
  }
});

var Recordings = Programs.extend({
  url: '/recordings.json'
});
