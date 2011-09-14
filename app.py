from flask import Flask, jsonify, render_template, request, send_from_directory
import ConfigParser, MythTV, threading, jsonpickle, os, os.path

config = ConfigParser.RawConfigParser()
config.read('mythtv.cfg')

app = Flask(__name__)

mythtv_db = MythTV.MythDB(args=(('DBHostName', config.get('Database', 'hostname')),
                             ('DBName', config.get('Database', 'name')),
                             ('DBUserName', config.get('Database', 'username')),
                             ('DBPassword', config.get('Database', 'password'))))

mythtv_backend = MythTV.MythBE(db=mythtv_db)
mythtv_xml = MythTV.MythXML(db=mythtv_db)
mythtv_frontends = []

cache_dir = './cache'

def search_for_frontends():
  global mythtv_frontends
  # TODO: May need to wrap this in mutex lock or something, in case a web query comes through as the array is updated...
  mythtv_frontends = []
 
  fes = MythTV.Frontend.fromUPNP()
  while(True):
    try:
      mythtv_frontends.append(fes.next())
    except MythTV.exceptions.MythFEError:
      # If we can't connect to the frontend, just ignore - it's probably not set up for remote access
      pass
    except StopIteration:
      break
  
  #threading.Timer(60, search_for_frontends).start()

search_for_frontends()

# Recordings
@app.route('/recordings.json')
def recordings():
  return jsonpickle.encode(filter(lambda p: p.recgroup != "LiveTV", mythtv_backend.getRecordings()), unpicklable=False)

@app.route('/recordings/<chanid>/<airdate>.json', methods=['DELETE'])
def recordings_delete(chanid, airdate):
  rerecord = False
  if request.args.has_key('rerecord'):
    rerecord = True if request.args['rerecord'] == 'true' else 'false'
  
  recording = mythtv_backend.getRecording(chanid, airdate)
  recording.delete(force=False,rerecord=rerecord)
  return ''

# Channels
@app.route('/channel/<chanid>/image.png')
def channel_image(chanid):
  height = request.args['height']
  width = request.args['width']
  
  base = chanid
  dest = cache_dir
  dest_file = base + '.png'
  dest_file_resized = base + '-' + width + 'x' + height + '.png'

  if os.path.exists(dest + '/' + dest_file) == False:
    f = open(dest + '/' + dest_file, 'w')
    f.write(mythtv_xml.getChannelIcon(chanid=int(chanid)))
    f.close()

  if os.path.exists(dest + '/' + dest_file_resized) == False:
    os.system('convert ' + dest + '/' + dest_file + ' -resize ' + width + 'x' + height + ' ' + dest + '/' + dest_file_resized)
  
  return send_from_directory(dest, dest_file_resized, as_attachment=False)

# Programs
@app.route('/programs/<chanid>/<airdate>/image.jpg')
def programs_image(chanid, airdate):
  # Check if the program preview has already been generated, if not, generate it using mythpreviewgen
  height = request.args['height']
  width = request.args['width']

  base = chanid + '_' + airdate
  dest = cache_dir
  dest_file_resized = base + '-' + width + 'x' + height + '.jpg'

  if os.path.exists(dest + '/' + dest_file_resized) == False:
    f = open(dest + '/' + dest_file_resized, 'w')
    f.write(mythtv_xml.getPreviewImage(chanid=int(chanid),starttime=airdate,width=width,height=height,secsin=60))
    f.close()

  return send_from_directory(dest, dest_file_resized, as_attachment=False) 

@app.route('/programs/<chanid>/<airdate>/play.json', methods=['POST'])
def programs_play(chanid, airdate):
  recording = mythtv_backend.getRecording(chanid, airdate)
  mythtv_frontends[0].play(recording)
  return ''

# Frontends
@app.route('/frontends.json')
def frontends():
  return jsonpickle.encode(map(lambda f: f.host, mythtv_frontends), unpicklable=False)


#Keyboards
@app.route('/keyboard/<index>.json', methods=['POST'])
def keyboard(index):
  mythtv_frontends[int(index) - 1].key[request.form['key']]
  return ''

# We are going to user popstate to handle URLs, so if it doesn't exist, then actually serve up the index.html page
@app.errorhandler(404)
def index(error):
  return send_from_directory('templates', 'index.html', as_attachment=False)

if __name__ == "__main__":
  app.debug = True
  app.run(host = '0.0.0.0', port = 4567)
