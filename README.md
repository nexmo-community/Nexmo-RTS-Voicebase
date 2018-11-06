# Nexmo-RTS-Voicebase
This is a demo of using a Nexmo Websocket to transcribe audio in real-time using Voicebase. 
To view a live version of the demo, go to https://nexmo-vb.herokuapp.com/ and dial the phone number listed on the page.
Then, begin speaking, you will see the transciption of the speech at the bottom of the page.
On the left, you will see the sentiment of the converstaion. When positive words are spoken('happy','joy', 'exite'..etc), the sentiment line will move higher. When negitive words are spoken, this line will decrease. 
On the right, shows a graph of keywords spoken in the conversation.


In the repo, you will see 2 folders, `server` and `WS-node`. The `server` folder contains a simple VAPI call from a Nexmo number into the websocket. The `WS-node` folder, contains the websocket, as well as the code to connect to Voicebase

##Get Started
In order to run this demo, you will need a few things first.
- Create an application on Nexmo
- Set the `event_url` to {your-url}/events and `answer_url` to {your-url}/answer. To run locally, use [Ngrok](https://ngrok.com)
- Copy the private key and save to a file, name it `private.key`
- Purchase a nexmo phone number
- Assign this phone number to this application
- Create a `.env` file will the following variables
```
API_KEY={NEXMO-API-KEY}
API_SECRET={NEXMO-API-SECRET}
APPLICATION_ID={NEXMO-APPLICATION-ID}
NEXMO_NUMBER={NEXMO PHONE NUMBER ASSIGNED TO APPLICATION
NEXMO_DEBUG=true
WEB_SOCKET_URL={URL OF WEBSOCKET}
CONFERENCE_NAME={NAME OF CONFERENCE}
PRIVATE_KEY_PATH={PATH TO PRIVATE KEY}
```

finally run `npm start` to begin the server


The other folder, `WS-node` is the webocket. 
In this folder, create a `.env` file with the following 
```
ASR_URL={VOICEBASE_URL}
ASR_CLIENT_KEY={VOICEBASE_CLIENT_KEY}
ASR_CLIENT_SECRET={VOICEBASE_CLIENT_SECRET}
```
Then run `npm start` in this folder to begin the websocket, and navigate to the url on your browser
Note, to run this locally, you will need 2 ngrok's running. One will be for the VAPI call, the other is for the websocket.
