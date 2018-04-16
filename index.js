// Heroku Set up
const TOKEN = process.env.TELEGRAM_TOKEN || '486802239:AAFJMEJb7UB7Ys2GFE9yPoz5yQZyjf3Sja4';
const TelegramBot = require('node-telegram-bot-api');
const options = {
    webHook: {
        port: process.env.PORT
    }
};

const url = process.env.APP_URL || 'https://sintbirrnw.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);












let fileSize;
let type;
// There are 2 types 
// Mebibyte = 1024^2 bytes but Megabyte = 1000^2 
function calcPrice(size, p) {
    let rate = .35;
    if (p) {
        rate = .23
    }
    let cost = (rate * size) / 1048576;
    return cost.toFixed(2) + ' Birr';


}

function returnPrice(size, p, type) {
    let cnvrtd = calcPrice(size, p);
    bot.sendMessage(msg.chat.id, `This ${type} file costs around **${cnvrtd}**`, { parse_mode: "markdown" });


}

bot.on('message', (msg) => {


    if (msg.audio != null) {
        fileSize = msg.audio.file_size;
        type = 'audio'
    } else if (msg.video != null) {
        fileSize = msg.video.file_size;
        type = 'video'

    } else if (msg.voice != null) {
        fileSize = msg.voice.file_size;
        type = 'voice'

    } else if (msg.photo != null) {
        fileSize = msg.photo.file_size;
        type = 'photo'

    } else if (msg.document != null) {
        fileSize = msg.document.file_size;
        type = 'document'

    } else if (msg.file != null) {
        fileSize = msg.file.file_size;
        type = ''


    } else if (msg.text === '/start' || msg.text === '/help') {
        return;
    } else {
        bot.sendMessage(msg.chat.id, 'Please send/forward me any type of file like audio, video, pictures.')
        return;
    }

    bot.sendMessage(msg.chat.id, 'Are you on package? \n ፓኬጅ አየተጠቀሙ ነው?', {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Yes',
                    callback_data: 'p'
                }],
                [{
                    text: 'No',
                    callback_data: 'noP'

                }]
            ]
        }
    })




})
bot.on('callback_query', (msg) => {
    let c_data = msg.data;

    if (c_data === 'step1') {
        bot.sendPhoto(msg.from.id, '')
    } else if (c_data === 'step2') {

    } else if (c_data === 'step3') {

    } else if (c_data === 'p') {
        bot.answerCallbackQuery(msg.from.id);
        returnPrice(fileSize, true, type);

    } else if (c_data === 'noP') {
        bot.answerCallbackQuery(msg.from.id);
        returnPrice(fileSize, false, type);

    }

})

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.from.id, 'Ok nice, Now ➡️forward any file to me. if you need any help send /help');
})

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.from.id, 'This bot will show you how much $$$ a file (audio, video...) costs before downloading it on mobile data. just forward any file you want to know the price for. ');

});