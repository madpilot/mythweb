var RecordingsView = Backbone.View.extend({
  events: {
    'click div.details': 'showDetails',
    'click a[href=#play]': 'play'
  },

  _swipeLeft: function(li) {
    var details = li.find('.details');
    details.css('z-index', 10);
   
    if(!("WebKitTransitionEvent" in window)) {
        li.removeClass('show-options');
        return;
    }

    if(!li.hasClass('show-options')) {
      return;
    }
    li.removeClass('show-options');
      
    details.one('webkitAnimationEnd', function() {
      $(this).removeClass('slide in');
      details.css('z-index','auto');
    });
    details.addClass('slide in');
  },

  _swipeRight: function(li) {
    var details = li.find('.details');
    details.css('z-index', 10);
    if(!("WebKitTransitionEvent" in window)) {
      li.addClass('show-options');
      return;
    }
        
    if(li.hasClass('show-options')) {
      return;
    }

    details.one('webkitAnimationEnd', function() {
      $(this).removeClass('slide out');
      li.addClass('show-options');
      details.css('z-index','auto');
    });
    
    details.addClass('slide out');
  },

  swipe: function(e) {
    var li = $(e.target);
    if(e.left) {
      this._swipeLeft(li);
    } else {
      this._swipeRight(li);
    }
  },

  showDetails: function(e) {
    e.preventDefault();
    
    var id = $(e.target).parents('li').attr('id');
    pageStack.changePage($('#recordings-show'), '/recordings/' + id.replace('_', '/'), 'push', false);
  },

  play: function(e) {
    var id = $(e.target).parents('li').attr('id');
    $.ajax({
      url: '/programs/' + id.replace('_', '/') + '/play.json',
      type: 'post'
    });
  },

  render: function(collection) {
    (this.el).find('li').unbind('swipe');
    $(this.options.template).tmpl(collection).appendTo($(this.el));

    var context = this;
    $(this.el).find('li').swipeable({ xdistance: 90 }).bind('swipe', function(e) {
      context.swipe(e);
    });
  }
});
