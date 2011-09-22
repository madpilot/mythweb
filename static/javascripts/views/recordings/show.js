var RecordingView = Backbone.View.extend({
  initialize: function() {
    this.model.bind('destroy', function(e) {
      window.history.back();
    });
  },

  template: '#mobile-recording-template',

  events: function() {
    // Maybe I'm declaring this.el incorrectly, but backbone.js doesn't seem to be unbind the delegate correctly. Work around
    // it for the moment until we find out what is going on.
    $(this.el).undelegate();
    return {
      'click a[href=#play]': 'play',
      'click a[href=#delete]': 'del',
      'click a[href=#delete-rerecord]': 'delAndReRecord',
      'click a[href=#autoexpire]': 'autoexpire'
    }
  },

  play: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.model.play();
  },

  del: function(e) {
    e.stopPropagation();
    e.preventDefault();
   
    if(confirm("Are you sure you want to delete this recording?")) {
      this.model.destroy({ rerecord: false });
    }
  },

  delAndReRecord: function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    if(confirm("Are you sure you want to delete and re-record this recording?")) {
      this.model.destroy({ rerecord: true });
    }
  },

  autoexpire: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.model.toggleAutoexpire();
  },

  render: function() {
    $(this.el).find("section").children().remove();
    $(this.el).find('header h1').text(this.model.get('title'));
    $(this.template).tmpl(this.model.toJSON()).appendTo($(this.el).find("section"));
  }
});
