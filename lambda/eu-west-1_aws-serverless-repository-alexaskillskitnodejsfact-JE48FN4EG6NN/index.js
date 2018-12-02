/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const https = require('https')



const NextFlightHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'NextFlight');
  },
  async handle(handlerInput) {
    //const speechOutput = "hello " + handlerInput.requestEnvelope.request.intent.slots.name.value;
    
    const response = await httpGet(0);
    
    console.log(response);
  
    return handlerInput.responseBuilder
      .speak(response.details)
      .getResponse();
  },
};

const LastFlightHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'LastFlight');
  },
  async handle(handlerInput) {
    //const speechOutput = "hello " + handlerInput.requestEnvelope.request.intent.slots.name.value;
    
    const response = await httpGet();
    
    console.log(response);
  
    return handlerInput.responseBuilder
      .speak(response.details)
      .getResponse();
  },
};

const NumberFlightHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'FlightNumber');
  },
  async handle(handlerInput) {
    const flightNumber = handlerInput.requestEnvelope.request.intent.slots.number.value
    //const speechOutput = "hello " + handlerInput.requestEnvelope.request.intent.slots.name.value;
    if (flightNumber < 53){
    return handlerInput.responseBuilder
      .speak("Sorry flights for 2018 starts from the 53rd")
      .getResponse();
  }
    const response = await httpGet(flightNumber);
    
    console.log(response);
  
    return handlerInput.responseBuilder
      .speak(response.details)
      .getResponse();
  },
};


const FactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'factSpaceX');
  },
  async handle(handlerInput) {
    const response = await httpGetfact();
    console.log(response[Math.floor(Math.random() * response.length)].details);
    
    return handlerInput.responseBuilder
      .speak(response[Math.floor(Math.random() * response.length)].details)
      .getResponse();
  },
};

function httpGet(which) {
  return new Promise(((resolve, reject) => {
    if (which == 0){
    var options = {
        host: 'api.spacexdata.com',
        port: 443,
        path: '/v3/launches/next',
        method: 'GET',
    };
    }else if (which == 1) {
      var options = {
        host: 'api.spacexdata.com',
        port: 443,
        path: '/v3/launches/latest',
        method: 'GET',
    };
    }else{
      var options = {
        host: 'api.spacexdata.com',
        port: 443,
        path: '/v3/launches/'+ which,
        method: 'GET',
    };
    }
    
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}


function httpGetfact(which) {
  return new Promise(((resolve, reject) => {
    var options = {
        host: 'api.spacexdata.com',
        port: 443,
        path: '/v3/history',
        method: 'GET',
    };

    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}








const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'factSpaceX');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'spacex launches';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'Ok.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    FactHandler,
    NumberFlightHandler,
    LastFlightHandler,
    NextFlightHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
