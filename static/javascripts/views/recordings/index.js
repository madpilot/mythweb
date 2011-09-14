var RecordingViewItem = Backbone.View.extend({
  initialize: function() {
    var context = this;
    this.model.bind('destroy', function(e) {
      $(context.el).slideUp('fast', function() {
        $(this).remove();
      });
    });
  },

  tagName: 'li',
  template: '#mobile-recording-item-template',
  events: {
    'click div.details': 'showDetails',
    'click a[href=#play]': 'play',
    'click a[href=#delete]': 'del',
    'click a[href=#delete-rerecord]': 'delAndReRecord',
    'click a[href=#autoexpire]': 'autoexpire'
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
    var id = this.model.get('id');
    pageStack.changePage($('#recordings-show'), '/recordings/' + id.replace('_', '/'), { animation: 'push' });
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
    $(this.template).tmpl(this.model.toJSON()).appendTo($(this.el))

    var context = this;
    $(this.el).swipeable({ xdistance: 90 }).bind('swipe', function(e) {
      context.swipe(e);
    });
    return this;
  }
});

var RecordingsView = Backbone.View.extend({
  tagName: 'ul',

  render: function() {
    $(this.el).find("section li").unbind('swipe').children().remove();

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

    var context = this;
    var last = null;
    var ul = null;
    
    $(this.el).find("section").children().remove();
    this.collection.each(function(recording) {
      var date = dateString(recording.get('recstartts'));

      if(date != last) {
        if(ul != null) {
          $(context.el).find("section").append(ul);
        }
        $(context.el).find("section").append('<h2>' + date + '</h2>');
        ul = $('<ul></ul>');
        last = date;
      }
      
      var view = new RecordingViewItem({ model: recording });
      ul.append(view.render().el);
    });
  }
});
