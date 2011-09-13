var RecordingsRouter = Backbone.Router.extend({
  lastFetch: null,
  routes: {
    "/recordings": "index",
    "/recordings/:chanid/:timestamp": "show"
  },

  index: function() {
    var recordings = new Recordings();
    recordings.comparator = function(model) {
      return model.get('recstartts').getTime() * -1;
    }
    var context = this;

    var setView = function() {
    }

    // If we have already fetched the recordings, the view would already have been rendered, so we can take no action.
    // We'll work out how to update the list (hopefully by pushing) later.
    if(this.lastFetch === null) {
      recordings.fetch({
        success: function(collection) {
          context.lastFetch = collection;

          var recordingsView = new RecordingsView({
            el: '#recordings-index section',
            collection: context.lastFetch
          });
          recordingsView.render();
        },
        error: function(error) {
          alert(error);
        }
      });
    }
  },

  show: function(chanid, timestamp) {
    if(this.lastFetch === null) {
      var recordings = new Recordings();
      var context = this;
    
      recordings.fetch({
        success: function(collection) {
          context.lastFetch = collection;
        }
      });
    }
    
    var model = this.lastFetch.get(chanid + "_" + timestamp);
    var recordingView = new RecordingView({
      el: '#recordings-show section',
      model: model
    });
    recordingView.render();
  }
});
var recordingsRouter = new RecordingsRouter();
