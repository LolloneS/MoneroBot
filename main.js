const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const standardQuery = "https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=";
const STRING_RESPONSE_START = "Welcome to the ultimate Monero Bot. For more information, contacts, etc: type /help :)";
const STRING_RESPONSE_XMR = "<b>1 XMR = ";
const STRING_RESPONSE_HELP =
         "Welcome to the ultimate Monero Bot.\n"
         + "Feel free to suggest me improvements and fixes @LolloneS. I'll try to get back to you as soon as I can.\n"
         + "<b>I know this isn't perfect</b>, I'm just an enthusiast trying to learn something :)\n";
const STRING_ERROR = "I'm sorry, there was a problem with the APIs. Please try again later. If the problem persists, let me [@LolloneS] know."
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true, filepath: false});
const winston = require('winston')

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, STRING_RESPONSE_START, {parse_mode : "html"})
     .catch((e) => {
      winston.log('error', `Error with Telegram's APIs`, {
        "Error Code": e.code,
        "Response Body": e.response.body
      });
     });
});


bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, STRING_RESPONSE_HELP, {parse_mode : "html"})
     .catch((e) => {
        winston.log('error', `Error with Telegram's APIs`, {
        "Error Code": e.code,
        "Response Body": e.response.body
    });
   });
});


bot.onText(/\/eur/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const value = await sendRequest("EUR");
    if (value !== undefined)
      bot.sendMessage(chatId, STRING_RESPONSE_XMR + value.EUR + " €</b>", {parse_mode : "html"})
      .catch((e) => {
        winston.log('error', `Error with Telegram's APIs`, {
          "Error Code": e.code,
          "Response Body": e.response.body
        });
       });
    else
      bot.sendMessage(chatId, STRING_ERROR, {parse_mode : "html"})
      .catch((e) => {
        winston.log('error', `Error with Telegram's APIs`, {
          "Error Code": e.code,
          "Response Body": e.response.body
        });
       });
  } catch (e) {
    bot.sendMessage(chatId, STRING_ERROR, {parse_mode : "html"})
    .catch((e) => {
      winston.log('error', `Error with Telegram's APIs`, {
        "Error Code": e.code,
        "Response Body": e.response.body
      });
     });      
  }
})


bot.onText(/\/usd/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const value = await sendRequest("USD");
    if (value !== undefined)
      bot.sendMessage(chatId, STRING_RESPONSE_XMR + value.USD + " $</b>", {parse_mode : "html"})
      .catch((e) => logTelegramError(e));
    else
      bot.sendMessage(chatId, STRING_ERROR, {parse_mode : "html"})
      .catch((e) => logTelegramError(e));
  } catch (e) {
    bot.sendMessage(chatId, STRING_ERROR, {parse_mode : "html"})
    .catch((e) => logTelegramError(e));    
  }
})


bot.onText(/\/btc/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const value = await sendRequest("BTC");
    if (value !== undefined)
      bot.sendMessage(chatId, STRING_RESPONSE_XMR + value.BTC + " BTC</b>", {parse_mode : "html"})
      .catch((e) => logTelegramError(e));
    else
      bot.sendMessage(chatId, STRING_ERROR, {parse_mode : "html"})
      .catch((e) => logTelegramError(e));
  } catch (e) {
    bot.sendMessage(chatId, STRING_ERROR, {parse_mode : "html"})
    .catch((e) => logTelegramError(e));
  }
})

function logCryptoCompareError(e, f) {
  winston.log('error', `Error with CryptoCompare's APIs`, {
    "Error Returned": e,
    "Function": f
  }); 
}

function logTelegramError(e) {
  winston.log('error', `Error with Telegram's APIs`, {
    "Error Code": e.code,
    "Response Body": e.response.body
  }); 
}

function sendRequest(fiat) {
  return new Promise(function (resolve, reject) {
    https.get(standardQuery + fiat.toUpperCase(), (res) => {
      let returned = '';
      res.on('data', (change) => {
        try { 
          returned = change;         
          tmp = JSON.parse(change);
          resolve(tmp);
        } catch (e) {
          logCryptoCompareError(e, "res.on('data')")          
          reject("Error while parsing JSON in res.on('data')!");
        }
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(returned));
        } catch (e) {
          logCryptoCompareError(e, "res.on('end')")          
          reject("Error while parsing JSON in res.on('end')!");
        }
      });
    }).on("error", (e) => {
      logCryptoCompareError(e, "res.on('error')")          
      reject("Error while parsing JSON in res.on('error')!");
    });
  });
}
