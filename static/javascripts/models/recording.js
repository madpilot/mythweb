var Recording = Backbone.Model.extend({
  urlRoot: '/recordings',

  url : function() {
    var getUrl = function(object) {
      if (!(object && object.url)) return null;
      return _.isFunction(object.url) ? object.url() : object.url;
    }; 
   
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    }

    var base = getUrl(this.collection) || this.urlRoot || urlError();
    base = base.split('.')[0];

    if (this.isNew()) return base + ".json";
    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id).replace("_", "/") + ".json";
  },  

  play: function() {
    $.ajax({
      url: '/programs/' + this.id.replace('_', '/') + '/play.json',
      type: 'post'
    });
  },

  toggleAutoexpire: function() {
    $.ajax({
      url: '/programs/' + this.id.replace('_', '/') + '/toggle-autoexpire.json',
      type: 'post'
    });
  },

  destroy: function(options) {
    options || (options = {});
    var rerecord = false;
    if(options.rerecord) {
      rerecord = options.rerecord;
    }
    options['rerecord'] = null;
    options.url = this.url() + "?rerecord=" + (rerecord ? "true" : "false");
    return Backbone.Model.prototype.destroy.call(this, options);
  }
});

var Recordings = Backbone.Collection.extend({
  url: '/recordings.json',
  
  model: Recording,

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
