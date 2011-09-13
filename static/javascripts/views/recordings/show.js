var RecordingView = Backbone.View.extend({
  tagName: 'div',
  template: '#mobile-recording-template',

  render: function() {
    $(this.el).children().remove();
    $(this.el).parents('div.page').find('header h1').text(this.model.get('title'));
    $(this.template).tmpl(this.model.toJSON()).appendTo($(this.el));
  }
});
