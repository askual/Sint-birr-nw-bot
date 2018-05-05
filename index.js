/**
 * 
 */

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const options = {
    polling: true
};
const bot = new TelegramBot(TOKEN, options);



let fileSize; // Size of the file we want to calculate the price for.
let type; // type of the file 

// Mebibyte = 1024^2 bytes(Binery) but Megabyte = 1000^2 bytes(SI) 



function calcPrice(size, isPackage) {
    let rate = .35;
    let str = 'on mobile data';
    if (isPackage) {
        rate = .23;
        str = 'on data package';
    }
    let cost = (rate * size) / 1048576;

    return cost.toFixed(2) + ' Birr ' + str;

}


function returnPrice(size, p, type, msg) {
    let cnvrtd = calcPrice(size, p);
    bot.answerCallbackQuery(msg.id);
    bot.sendMessage(msg.from.id, `This ${type} file costs around *${cnvrtd}*.`, { parse_mode: "markdown" });

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
        bot.sendMessage(msg.chat.id, 'Please send/forward me any type of file like audio, video and other big files.. photos cost almost to noting.')
        return;

    } else if (msg.document != null) {
        fileSize = msg.document.file_size;
        type = 'document'

    } else if (msg.file != null) {
        fileSize = msg.file.file_size;
        type = ''


    } else if (msg.text === '/start' || msg.text === '/help') {
        return;
    } else {
        bot.sendMessage(msg.chat.id, 'Please send/forward me any type of file like audio, video and other big files.')
        return;
    }

    bot.sendMessage(msg.chat.id, 'Are you on data package? \n በፓኬጅ አየተጠቀሙ ነው?', {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Yes, ፓኬጅ ገዝቻለው።',
                    callback_data: 'p'
                }],
                [{
                    text: 'No, ፓኬጅ አልገዛውም።',
                    callback_data: 'noP'

                }]
            ]
        }
    })




})
bot.on('callback_query', (msg) => {
    let c_data = msg.data; // callback data

    if (c_data === 'p') {
        // using data package
        returnPrice(fileSize, true, type, msg);

    } else if (c_data === 'noP') {
        // using mobile data
        returnPrice(fileSize, false, type, msg);

    }

})

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.from.id, 'Ok nice, Now ➡️forward any file to me. if you need any help send /help');
})

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.from.id, 'This bot will show you how much $$$ a file (audio, video...) costs before downloading it on mobile data. just forward any file you want to know the price for. ');

});