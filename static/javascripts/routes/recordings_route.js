var RecordingsRouter = Backbone.Router.extend({
  routes: {
    "/recordings": "index",
    "/recordings/:chanid/:timestamp": "show"
  },

  _lastCollection: null,
      
  index: function() {
    var recordings = new Recordings();
    recordings.comparator = function(model) {
      return model.get('recstartts').getTime() * -1;
    }
    var context = this;
    
    recordings.fetch({
      success: function(collection) {
        var recordingsView = new RecordingsView({
          el: '#recordings-index section',
          collection: collection
        });
        recordingsView.render();
      },
      error: function(error) {
        alert(error);
      }
    });
  },

  show: function(chanid, timestamp) {
    var recording = this._lastCollection[chanid + '_' + timestamp];  
    var recordingView = new RecordingView({
      el: '#recordings-show section',
      template: $('#mobile-recording-template')
    });
    recordingView.render(recording);
  }
});
var recordingsRouter = new RecordingsRouter();
