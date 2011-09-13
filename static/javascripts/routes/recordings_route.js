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
    
    recordings.fetch({
      success: function(collection) {
        context.lastFetch = collection;

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
    console.log(this.lastFetch);

    if(this.lastFetch === null) {

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
