var PageStack = function() {
  var stackSelector = '> div.page';
  var history = [];

  var setRoot = function(el, url, options) {
    $("div.stack.current").removeClass('current');
    $(el).addClass('current');
    
    // Find the first page
    $(el).find(stackSelector + ".current").removeClass('current');
    var to = $(el).find(stackSelector).get(0);
    history = [];
    changePage(to, url);
  }

  var transition = function(toPage, fromPage, options) {
    var options = $.extend({ 
      direction: 'forward',
      animation: 'show',
      onComplete: function() {}
    }, options);

    var fromPage = $(fromPage),
    toPage = $(toPage),
    toClass = options.animation + (options.direction == "forward" ? " in forward" : " out reverse"),
    fromClass = options.animation + (options.direction == "forward" ? " out forward" : " in reverse");

    if(!("WebKitTransitionEvent" in window)) {
      toPage.addClass("current");
      fromPage.removeClass("current");
      options.onComplete.call(toPage);
      return;
    }
 
    toPage
      .css('z-index', 10)
      .addClass(toClass)
      .bind("webkitAnimationEnd", function() {
        
        toPage
          .addClass('current')
          .removeClass(toClass)
          .css('z-index', 'auto')
          .unbind("webkitAnimationEnd");

        options.onComplete.call(toPage);
      });
    
    fromPage
      .css('z-index', 10)
      .addClass(fromClass)
      .bind("webkitAnimationEnd", function() {
        fromPage
          .removeClass("current")
          .removeClass(fromClass)
          .css('z-index', 'auto')
          .unbind("webkitAnimationEnd");
      });
  }  

  var changePage = function(page, url, options) {
    var page = $(page);
    
    window.History.pushState({
      id: page.attr('id'),
      current: history.length,
    }, 'MythTV', url);

    if(history.length > 0) {
      history[history.length - 1].previousScrollPosition = $(window).scrollTop();
    }

    history.push({
      page: page,
      url: url,
      previousScrollPosition: 0
    });
   
    Backbone.history.loadUrl(url);
    $(window).scrollTop(0);
    transition(page, $('.stack.current .page.current'), options); 
  }

  var back = function(options) {
    if(history.length > 0) {
      var from = history.pop();
      var to = history[history.length - 1];
      
      var options = $.extend({
        direction: 'reverse',
        onComplete: function() {
          $(window).scrollTop(to.previousScrollPosition);
        }
      }, options);
      
      transition(to.page, from.page, options);
    }
  }

  var getCurrent = function() {
    return history.length;
  }

  var getHistory = function() {
    return history;
  }

  return {
    setRoot: setRoot,
    transition: transition,
    changePage: changePage,
    back: back,
    getCurrent: getCurrent,
    getHistory: getHistory
  }
};

var pageStack = PageStack();

$(function() {
  window.History.Adapter.bind(window, 'statechange', function(e) {
    var state = History.getState();
    
    if(state.data.current < pageStack.getCurrent()) {
      pageStack.back({ 
        animation: 'push'
      });
    }
  });
 
  pageStack.setRoot('#recordings', '/recordings');

  $('.page header').click(function(e) {
    $('#pull-down').toggle();
  });

  $('#pull-down a').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    pageStack.setRoot($(this).attr('rel'), $(this).attr('href'));
    $('#pull-down').hide();
  });

  $('a').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

function human_size(size, dp) {
  var suffixes = [ 'B', 'kB', 'MB', 'GB', 'TB', 'PT' ];
  var index = 0;
  dp = dp || 0;

  while(size > 1024) {
    size /= 1024;
    index++;
  }
  return (Math.round(size * Math.pow(10, dp)) / Math.pow(10, dp)) + suffixes[index];
}
