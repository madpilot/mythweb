var RemoteView = Backbone.View.extend({
  repeatTimeout: null,
  repeatInterval: null,
  repeating: false,
  repeatTimeoutTime: 1000,
  repeatIntervalTime: 250,

  events: {
    'touchstart a': 'touchStart',
    'touchend a': 'touchEnd',
    'mousedown a': 'touchStart',
    'mouseup a': 'touchEnd'
  },

  touchStart: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    clearInterval(this.repeatInterval);
    clearTimeout(this.repeatTimeout);
    
    var key = $(e.target).attr('href').substring('#'.length);
    this.sendKeyEvent(key);
    
    var context = this;
    context.repeatTimeout = setTimeout(function() {
      context.repeatInterval = setInterval(function() {
        context.sendKeyEvent(key);
      }, context.repeatIntervalTime);
    }, context.repeatTimeoutTime);
  },

  touchEnd: function(e) {
    clearTimeout(this.repeatTimeout);
    clearInterval(this.repeatInterval);
  },

  sendKeyEvent: function(key) {
    $.ajax({
      url: '/keyboard/1.json',
      type: 'post',
      data: 'key=' + key
    });
  },

  render: function() {
    $(this.el).find('section').html('');
    $('#mobile-remote-template').tmpl().appendTo($(this.el).find('section'));
  }
});
