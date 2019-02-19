# Nexmo-RTS-Voicebase
This is a demo of using a Nexmo Websocket to transcribe audio in real-time using Voicebase. 
To view a live version of the demo, go to https://nexmo-vb.herokuapp.com/ and dial the phone number listed on the page.
Then, begin speaking, you will see the transciption of the speech at the bottom of the page.
On the left, you will see the sentiment of the converstaion. When positive words are spoken('happy','joy', 'exite'..etc), the sentiment line will move higher. When negitive words are spoken, this line will decrease. 
On the right, shows a graph of keywords spoken in the conversation.


## Voicebase
Currently, the Voicebase API is in Beta and may not be available for public use. 
Please see https://developer.voicebase.com/#/ for more information.
Before running this application, you will be a Voicebase client and secret, which can be found on https://developer.voicebase.com/#/

### Prerequisites
In order to run this demo, you will need a few things first.
- Create an application on [Nexmo](https://dashboard.nexmo.com/)
- Set the `event_url` to {your-url}/events and `answer_url` to {your-url}/answer. To run locally, use [Ngrok](https://ngrok.com)
- [Purchase a nexmo phone number](https://dashboard.nexmo.com/buy-numbers)
- Assign this phone number to this application
- Create a `.env` file will the following variables
```
NEXMO_NUMBER={NEXMO PHONE NUMBER ASSIGNED TO APPLICATION
ASR_CLIENT_KEY={VOICEBASE CLIENT KEY}
ASR_CLIENT_SECRET={VOICEBASE SECRET}
ASR_URL={VOICEBASE SERVER URL}
```

Then, install the dependencies:

```bash
$ npm install
```
Then run `npm start` to begin the websocket, and navigate to the url on your browser
