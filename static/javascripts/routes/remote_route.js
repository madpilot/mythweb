var RemoteRouter = Backbone.Router.extend({
  routes: {
    "": "remote",
    "/remote": "remote"
  },
      
  remote: function() {
    var remoteView = new RemoteView({
      el: $('#remote-index')
    });
    remoteView.render();
  }
});
var remoteRouter = new RemoteRouter();
