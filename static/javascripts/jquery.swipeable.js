(function($) {
  $.fn.swipeable = function(options) {
    var options = $.extend({
      xdistance: 30,
      ydistance: 30
    }, options);
    
    return this.each(function() {
      var xStart = null;
      var yStart = null;
      var target = null;

      $(this).bind({
        'touchstart mousedown': function(e) {
          var event = e.originalEvent,
          touch = event.targetTouches ? event.targetTouches[0] : e;
          xStart = touch.pageX;
          yStart = touch.pageY;
          target = this;
        },
        'touchend mouseup': function(e) {
          if(this != target) {
            xStart = null;
            yStart = null;
            target = null;
            return false;
          }
          var event = e.originalEvent,
          touch = event.changedTouches ? event.changedTouches[0] : e,
          diffX = touch.pageX - xStart;
          diffY = touch.pageY - yStart;
          
          var swipe = {
            up: false,
            right: false,
            down: false,
            left: false
          };
          
          var trigger = false;
          if(Math.abs(diffX) > options.xdistance) {
            if(diffX < 0) {
              swipe.left = true;
            } else {
              swipe.right = true;
            }
            trigger = true;
          }

          if(Math.abs(diffY) > options.ydistance) {
            if(diffY < 0) {
              swipe.up = true;
            } else {
              swipe.down = true;
            }
            trigger = true;
          }

          if(trigger) { 
            $(this).trigger($.Event('swipe', swipe));
          }
        }
      });
    });
  };
})(jQuery);
