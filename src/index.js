const Alexa = require('alexa-sdk');

const handlers = {
  RandomEpisodeIntent() {
    this.emit(':tell', 'Hello World');
  },
};

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
