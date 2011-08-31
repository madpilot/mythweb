var RecordingView = Backbone.View.extend({
  events: {},

  render: function(recording) {
    $(this.el).children().remove();
    $(this.el).parents('div.page').find('header h1').text(recording.title);
    $(this.options.template).tmpl(recording).appendTo($(this.el));
  }
});
