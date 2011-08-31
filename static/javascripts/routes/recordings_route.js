var RecordingsRouter = Backbone.Router.extend({
  routes: {
    "/recordings": "index",
    "/recordings/:chanid/:timestamp": "show"
  },

  _lastCollection: null,
      
  index: function() {
    var recordings = new Recordings();
    var context = this;
    recordings.fetch({
      success: function(collection) {
        // Sort reverse order
        collection = collection.toJSON().sort(function(x, y) {
          if (x.recstartts > y.recstartts) return -1;
          if (x.recstartts < y.recstartts) return 1;
          return 0;
        });

        function dateString(d) {
          var today = (new Date()).getTime();
          
          if(d.getTime() >= (today - (60 * 60 * 24 * 1000))) {
            return "Today";
          }
          if(d.getTime() >= (today - (60 * 60 * 24 * 2 * 1000))) {
            return "Yesterday";
          }
          if(d.getTime() >= (today - (60 * 60 * 24 * 8 * 1000))) {
            return 'Last ' + d.getDayName();
          }
          if(d.getYear() == (new Date()).getYear()) {
            return d.getDayName() + ', ' + d.getMonthName() + ' ' + d.getDate();
          }
          return d.getDayName() + ', ' + d.getMonthName() + ' ' + d.getDate() + ' ' + d.getYear();
        }

        // Now partition into dates
        var partitioned = {};
        var last = null;
        
        // Cache the collection as an indexed hash so we don't need to make another call to the server on show.
        context._lastCollection = {};
        for(var i = 0; i < collection.length; i++) {
          var recording = collection[i];
          var date = dateString(recording.recstartts);
          
          if(date != last) {
            last = date;
            partitioned[last] = [];
          }
          partitioned[last].push(recording)
          context._lastCollection[recording.id] = recording;
        }

        var recordingsView = new RecordingsView({
          el: $('#recordings-index section'),
          template: $('#mobile-recordings-template')
        });
        recordingsView.render(partitioned);
      },
      error: function(error) {
        alert(error);
      }
    });
  },

  show: function(chanid, timestamp) {
    var recording = this._lastCollection[chanid + '_' + timestamp];  
    var recordingView = new RecordingView({
      el: $('#recordings-show section'),
      template: $('#mobile-recording-template')
    });
    recordingView.render(recording);
  }
});
var recordingsRouter = new RecordingsRouter();
