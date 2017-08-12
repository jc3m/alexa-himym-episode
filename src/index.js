const Alexa = require('alexa-sdk');

const episodes = require('./episodes.json');

function chooseRandomEpisode(eps) {
  return eps[Math.floor(Math.random() * eps.length)];
}

const HELP_RESPONSE = 'You can say, random episode, or specify a minimum rating by saying, random episode with rating above eight point seven';

const handlers = {
  LaunchRequest() {
    this.emit('RandomEpisodeIntent');
  },
  'AMAZON.HelpIntent': function HelpIntent() {
    this.emit(':tell', HELP_RESPONSE);
  },
  RandomEpisodeIntent() {
    const chosen = chooseRandomEpisode(episodes);
    this.emit(':tell', `Season ${chosen.season}, episode ${chosen.episode}, ${chosen.title}`);
  },
  RandomEpisodeRatingIntent() {
    const intent = this.event.request.intent;
    let rating = +intent.slots.rating.value;
    let decimal = +intent.slots.decimal.value;
    if (decimal) {
      while (decimal >= 1) {
        decimal /= 10;
      }
      rating += decimal;
    }
    const filteredEpisodes = episodes.filter(ep => ep.rating > rating);
    if (filteredEpisodes.length === 0) {
      this.emit(':tell', `There are no episodes with a rating higher than ${rating}`);
    }
    const chosen = chooseRandomEpisode(filteredEpisodes);
    this.emit(':tell', `Season ${chosen.season}, episode ${chosen.episode}, ${chosen.title}`);
  },
};

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
