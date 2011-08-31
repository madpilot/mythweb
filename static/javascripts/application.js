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
    changePage(to, url, 'show', false);
  }

  var transition = function(toPage, fromPage, type, reverse) {
    var fromPage = $(fromPage),
    toPage = $(toPage),
    reverse = reverse ? " reverse" : "";

    if(!("WebKitTransitionEvent" in window)) {
      toPage.addClass("current");
      fromPage.removeClass("current");
      return;
    }
  
    toPage
      .css('z-index', 10)
      .addClass(type + " in" + reverse)
      .bind("webkitAnimationEnd", function() {
        fromPage.removeClass("current");
        
        toPage
          .addClass('current')
          .removeClass(type + " in" + reverse)
          .css('z-index', 'auto')
          .unbind("webkitAnimationEnd");
      });
  }  

  var changePage = function(page, url, type, reverse) {
    var page = $(page);
    
    window.History.pushState({
      id: page.attr('id'),
      current: history.length
    }, 'MythTV', url);
    
    history.push({
      page: page,
      url: url
    });
   
    Backbone.history.loadUrl(url);
    transition(page, $('.stack.current .page.current'), type, reverse); 
  }

  var back = function(type) {
    if(history.length > 0) {
      var from = history.pop();
      var to = history[history.length - 1];
      transition(to.page, from.page, type, true);
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
      pageStack.back('slide');
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
