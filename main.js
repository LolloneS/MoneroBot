const TelegramBot = require('node-telegram-bot-api');

const STRING_ERROR_KRAKEN = "Something's wrong with Kraken. Try again later";

const STRING_RESPONSE_START = "Welcome to the ultimate Monero Bot. For more information, contacts, etc: type /help :)";

const STRING_RESPONSE_HELP =
         "Welcome to the ultimate Monero Bot.\n"
         + "Feel free to suggest me improvements and fixes @LolloneS. I'll try to get back to you as soon as I can.\n"
         + "<b>I know this isn't perfect</b>, I'm just an enthusiast trying to learn something :)\n"
         + "Wanna know how to use me? Just type /xmr :)";

const STRING_RESPONSE_XMR = "<b>Value</b>: ";


// Let's get kraken ready
var KrakenClient = require('kraken-api');
var kraken = new KrakenClient();

// Telegram token you receive from @BotFather
const token = '308637942:AAGZEofpggf06Rzqav5K5tfZu-TOEfZPosY';


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


// start
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, STRING_RESPONSE_START, {parse_mode : "html"});
});

// help
bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, STRING_RESPONSE_HELP, {parse_mode : "html"});
});

bot.onText(/\/xmr/, (msg, match) => {
  const chatId = msg.chat.id;
  krakenXMREURWrapped().then((a) => {
    bot.sendMessage(chatId, STRING_RESPONSE_XMR + a + "€", {parse_mode : "html"})
  }).catch((e) => {
    bot.sendMessage(chatId, STRING_ERROR_KRAKEN, {parse_mode : "html"});    
  })
})

function krakenXMREURWrapped() {
    return new Promise((resolve, reject) => {
      kraken.api('Ticker', { pair: 'XMREUR' }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          const arr = Object.keys(data.result.XXMRZEUR);
          arr.forEach((i) => {
            if (i === 'c') {
              resolve(parseFloat(data.result.XXMRZEUR[i][0]));
            }
          });
        }
      });
    });
  }