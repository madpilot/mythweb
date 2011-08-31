h1. MythWeb Reloaded

The original MythWeb plugin for MythTV was a set of PHP and PERL scripts that allow users to view recordings, create recordings, update options and stream flash version of TV shows via a browser. While it works pretty well, I have had a couple of problems with it:

# Requiring Apache or even Lighttpd seems like complete overkill for a website that will only ever be accessed by a couple of people
# The mobile version is so limited, that it's unusable.
# Creating recordings is difficult - there are so many options, it can be over-whelming
# It has a lot of geek oriented cruft. It needs a bit of UI and UX tender loving care
# The music and video browsers down't work with large libraries; and
# It's ugly.

The point of this re-write is to address these issues.

h2 Design Brief

# Should not rely on PHP or Apache or Lighttpd
# Should work on mobiles, tablets and web browsers
# The UI should be as simple as required (But no more)
# It should look good.

h2. Status

So far, I've only started the mobile interface (tested mainly on iOS - I'm still waiting for the Android emulator to boot up), and only implemented the remote and recordings. There is still heaps of stuff missing, so give me some time - or better yet get forking. Just remember the brief.

h2. Getting started

# Clone this repo
# Copy mythtv.cfg.sample to mythtv.cfg
# Change the database settings in mythtv.cfg
# python app.py
# Point your browser http://[ip_address]:4567 - replace the ip_address with the ip of your mythbox.

Make sure you have compiled the MythTV Python bindings!

h2. Design rationale

Building this is in PHP is a non-starter. For starters, it has no built in webserver so it relies on an external server, like Apache. Also, PHP is an ugly, ugly language, and if you create new websites in it now, you are doing it wrong. A Ruby or Python based framework makes much more sense, as we can use Rack or WSGI to serve up the site.

While I am a Ruby on Rails programmer by trade, Python makes much more sense in this case, because MythV comes wtith built in Python bindings. Now because I'm a Ruby on Rails programmer, and don't know Python (Seriously, this is the first time I've touched python), so I decided to push as much logic to the browser as possible. Therefore, I've created thin wrapper around the Python binding, and turned it into a RESTful web app using flask. If you are a Python guru, and want to laugh when looking at my code, PLEASE send me notes on how to make it better. Seriously, I want to know the best to do this stuff.

The web app is HTML5, CSS3 and uses a whole lot of stuff that only works in new browsers. No, I'm not going to make it work on IE6 or 7 - IE 8 will probably work, as will IE 9. I'll test against the latest Firefox (probably version 3243 by the time you read this), Safari and Chrome (more often on OSX than Windows, rarely on Linux - if you find an issue let me know, and I'll find an Ubuntu box or something).

Since the browser is doing the work, I'm using backbone.js, and history.js to some nice pushStats URLs. I'm also using jQuery.tmpl for templating. If you have been doing any serious web development recently, you should be sweet.
