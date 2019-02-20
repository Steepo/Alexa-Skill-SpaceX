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
    
    var responseBuilder = handlerInput.responseBuilder;
    
    var responseText = response.details;
      if (responseText == null){
        console.log("Entrato");
        responseText = response.mission_name + "does not have any details available, try again later"
      }
    if (supportsDisplay(handlerInput)) {
      var links = response.links.flickr_images[1];
      console.log(links);
      if (links == undefined){
        var links = "https://c1.staticflickr.com/5/4711/40126461411_aabc643fd8_b.jpg";
      }
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance(links)
        .getImage();
      const title = "Title"; //getCardTitle(selectedState);
      const bodyTemplate = "BodyTemplate1"; //bodyTemplateChoice(getCardTitle(selectedState));
      const primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText(responseText)//;getTextDescription(selectedState, '<br/>'))
        .getTextContent();
      
      handlerInput.responseBuilder.addRenderTemplateDirective({
        type: 'BodyTemplate1',
        token: 'string',
        backButton: 'HIDDEN',
        backgroundImage: bgImage,
        title: "Last Flight",
        textContent: primaryText,
      });
      console.log("TRUE");
      //speechOutput = `This is the ${getBodyTemplateName(bodyTemplate)} template, also known as body template number ${getBodyTemplateNumber(bodyTemplate)}. `;
    }else{
      console.log("FALSE");
    }
    
    console.log(response);
  
    return responseBuilder
      .speak(responseText)
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
    const response = await httpGet(1);
    
    var responseBuilder = handlerInput.responseBuilder;
    var links = response.links.flickr_images[Math.floor(Math.random() * response.links.flickr_images.length)];
      console.log(links);
      if (links == undefined){
        var links = "https://c1.staticflickr.com/5/4711/40126461411_aabc643fd8_b.jpg";
      }
    if (supportsDisplay(handlerInput)) {
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance(links)
        .getImage();
      const title = "Title"; //getCardTitle(selectedState);
      const bodyTemplate = "BodyTemplate1"; //bodyTemplateChoice(getCardTitle(selectedState));
      const primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText(response.details)//;getTextDescription(selectedState, '<br/>'))
        .getTextContent();
      
      handlerInput.responseBuilder.addRenderTemplateDirective({
        type: 'BodyTemplate1',
        token: 'string',
        backButton: 'HIDDEN',
        backgroundImage: bgImage,
        title: "Last Flight",
        textContent: primaryText,
      });
      console.log("TRUE");
      //speechOutput = `This is the ${getBodyTemplateName(bodyTemplate)} template, also known as body template number ${getBodyTemplateNumber(bodyTemplate)}. `;
    }else{
      console.log("FALSE");
    }
    
    console.log(response);
  
    return responseBuilder
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
    const fatto = response[Math.floor(Math.random() * response.length)].details;
    var responseBuilder = handlerInput.responseBuilder;
    if (supportsDisplay(handlerInput)) {
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance("https://c1.staticflickr.com/5/4711/40126461411_aabc643fd8_b.jpg")
        .getImage();
      const title = "Title"; //getCardTitle(selectedState);
      const bodyTemplate = "BodyTemplate1"; //bodyTemplateChoice(getCardTitle(selectedState));
      const primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText(fatto)//;getTextDescription(selectedState, '<br/>'))
        .getTextContent();
      
      handlerInput.responseBuilder.addRenderTemplateDirective({
        type: 'BodyTemplate1',
        token: 'string',
        backButton: 'HIDDEN',
        backgroundImage: bgImage,
        title: "Fact",
        textContent: primaryText,
      });
      console.log("TRUE");
      //speechOutput = `This is the ${getBodyTemplateName(bodyTemplate)} template, also known as body template number ${getBodyTemplateNumber(bodyTemplate)}. `;
    }else{
      console.log("FALSE");
    }
    //console.log(response[Math.floor(Math.random() * response.length)].details);
    
    return responseBuilder
      .speak(fatto)
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



function supportsDisplay(handlerInput) {
  const hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
  return hasDisplay;
}




const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' || request.type === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    
    var responseBuilder = handlerInput.responseBuilder;
    
    if (supportsDisplay(handlerInput)) {
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance("https://c1.staticflickr.com/5/4711/40126461411_aabc643fd8_b.jpg")
        .getImage();
      const title = "Title"; //getCardTitle(selectedState);
      const bodyTemplate = "BodyTemplate1"; //bodyTemplateChoice(getCardTitle(selectedState));
      const primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText("What you want to know?")//;getTextDescription(selectedState, '<br/>'))
        .getTextContent();
      
      handlerInput.responseBuilder.addRenderTemplateDirective({
        type: 'BodyTemplate1',
        token: 'string',
        backButton: 'HIDDEN',
        backgroundImage: bgImage,
        title: "Welcome to SpaceX launches",
        textContent: primaryText,
      });
      console.log("TRUE");
      //speechOutput = `This is the ${getBodyTemplateName(bodyTemplate)} template, also known as body template number ${getBodyTemplateNumber(bodyTemplate)}. `;
    }else{
      console.log("FALSE");
    }
    
    
    
    return responseBuilder
    .speak("Welcome to SpaceX launches, ask me what's the next or the last launch, or a random fact")
      .reprompt("What you want to know?")
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

const FALLBACK_MESSAGE = "Welcome to SpaceX launches, ask me what's the next or the last launch, or a random fact";
const FALLBACK_REPROMPT = 'What can I help you with?';

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallbackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  
  
  handle(handlerInput) {
    
    var responseBuilder = handlerInput.responseBuilder;
      
      if (supportsDisplay(handlerInput)) {
        const bgImage = new Alexa.ImageHelper()
          .addImageInstance("https://c1.staticflickr.com/5/4711/40126461411_aabc643fd8_b.jpg")
          .getImage();
        const title = "Title"; //getCardTitle(selectedState);
        const bodyTemplate = "BodyTemplate1"; //bodyTemplateChoice(getCardTitle(selectedState));
        const primaryText = new Alexa.RichTextContentHelper()
          .withPrimaryText("What you want to know?")//;getTextDescription(selectedState, '<br/>'))
          .getTextContent();
        
        handlerInput.responseBuilder.addRenderTemplateDirective({
          type: 'BodyTemplate1',
          token: 'string',
          backButton: 'HIDDEN',
          backgroundImage: bgImage,
          title: "Welcome to SpaceX launches",
          textContent: primaryText,
        });
        console.log("TRUE");
        //speechOutput = `This is the ${getBodyTemplateName(bodyTemplate)} template, also known as body template number ${getBodyTemplateNumber(bodyTemplate)}. `;
      }else{
        console.log("FALSE");
      }
      
    return responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const HELP_MESSAGE = 'You can say tell me the next or the last launch, or a random fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';

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



const SKILL_NAME = 'spacex launches';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'Ok.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    FactHandler,
    NumberFlightHandler,
    LastFlightHandler,
    NextFlightHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
