
require('dotenv').config()


var WebSocketServer = require('websocket').server;

var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var dispatcher     = new HttpDispatcher();
const fs = require('fs');
var AsrClient = require('./lib/asrClient')
var asrActive = false
var myAsrClient;
var engineStartedMs;
var connections = []


//Create a server
var server = http.createServer(function(req, res) {
    handleRequest(req,res);
});

// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
});


var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
    binaryType: 'arraybuffer'
});


//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //Dispatch
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}
dispatcher.setStatic('/public');
dispatcher.setStaticDirname('public');
dispatcher.onGet("/", function(req, res) {

   fs.readFile('./public/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});
dispatcher.onGet("/nexmo_num", function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(process.env.NEXMO_NUMBER);
});

dispatcher.onGet("/answer", function(req, res) {
  var json = [
    {
        "action": "connect",
        "from": process.env.NEXMO_NUMBER,
        "endpoint": [
            {
                "type": "websocket",
                "uri": 'ws://' + req.headers.host + '/socket',
                "content-type": "audio/l16;rate=16000",
                "headers": {
                    "app": "audiosocket"
                }
            }
        ]
    }
]
  console.log("answer", json);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(json), 'utf-8');
});

dispatcher.onPost("/events", function(req, res) {
  console.log(req.body)
 res.writeHead(200, { 'Content-Type': 'application/json' });
 res.end();
});

dispatcher.onPost("/terminate", function(req, res) {
     wsServer.closeAllConnections();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end();
});

wsServer.on('connect', function(connection) {
    connections.push(connection);

    console.log((new Date()) + ' Connection accepted' + ' - Protocol Version ' + connection.webSocketVersion);
    connection.on('message', function(message) {

        if (message.type === 'utf8') {
            try {
              var json = JSON.parse(message.utf8Data);
              console.log("json", json['app']);

              if (json['app'] == "audiosocket") {
                VBConnect();
                console.log('connecting to VB');
              }
              
            } catch (e) {
              console.log("message error catch", e)
            }
            console.log("utf ",message.utf8Data);
        }
        else if (message.type === 'binary') {
            // Reflect the message back
            // connection.sendBytes(message.binaryData);
            if (myAsrClient != null && asrActive) {  
              myAsrClient.onAudio(message.binaryData)
            }
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        wsServer.closeAllConnections();

    });
});

wsServer.on('close', function(connection) {
  console.log('socket closed');
  if (asrActive) {
      io.sockets.emit('status',  "disconnected");
      console.log('trying to close ASR client');
      myAsrClient.endOfAudio();
      myAsrClient = null;
      asrActive = false;
  }
  else {
    console.log('asr not active, cant close');
  }
})

wsServer.on('error', function(error) {
  console.log('Websocket error', error);
})

var port = process.env.PORT || 8000
server.listen(port, function(){
    console.log("Server listening on ", port);
});

function VBConnect() {

    console.log('load AsrClient');
    myAsrClient = new AsrClient()
    var url = process.env.ASR_URL;
        client_key = process.env.ASR_CLIENT_KEY;
        client_secret = process.env.ASR_CLIENT_SECRET;
    myAsrClient.setup(url, client_key, client_secret, (err) => {
      if (err) {
        return console.error('AsrClient error:', err)
      }
    var controlMessage = {}
      controlMessage.language = 'en-US' // default starting value 
      controlMessage.targetSampleRate = '8' // default starting value 
      controlMessage.sampleRate = '16000'
      controlMessage.windowSize = 10
      myAsrClient.reserveAsr(controlMessage)
      console.log("sending control message", controlMessage);

      myAsrClient.subscribeEvent('engineState', (msg) => {
        console.log('Engine State Event', msg)
        if (msg === 'ready') {
          asrActive = true
          engineStartedMs = Date.now()
          console.log('Setting asrActive to true: ', asrActive, ' this.asrActive ', this.asrActive)
          io.sockets.emit('status',  "connected");
        }
      })

      myAsrClient.subscribeEvent('transcript', (msg) => {
        console.log('transcript', msg);
        io.sockets.emit('transcript', msg);
      })

      myAsrClient.subscribeEvent('sentiment', (msg) => {
        console.log('sentiment', msg);
        io.sockets.emit('sentiment', msg);

      })

      myAsrClient.subscribeEvent('nlp', (msg) => {
          console.log('nlp', msg);
          io.sockets.emit('nlp', msg);
      })

      myAsrClient.subscribeEvent('keywords', (msg) => {
          console.log('keywords', msg);
          io.sockets.emit('keywords', msg);
      })


       myAsrClient.subscribeEvent('latency', (msg) => {
          console.log('latency', msg);
          io.sockets.emit('latency', msg);
      })
    })
}
