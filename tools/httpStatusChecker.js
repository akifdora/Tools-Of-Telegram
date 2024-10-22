const https = require('https');

function handleHTTPStatusChecker(bot, chatId) {
    bot.sendMessage(chatId, "💭 HTTP durumunu kontrol etmek istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için HTTP durumu sorgulanıyor...`);
        checkHTTPStatus(domain).then(status => {
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\nHTTP Durumu: *${status}*`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function checkHTTPStatus(domain) {
    return new Promise((resolve, reject) => {
        https.get(`https://${domain}`, (res) => {
            resolve(res.statusCode);
        }).on('error', (err) => {
            reject(new Error('HTTP durumu kontrol edilemedi.'));
        });
    });
}

module.exports = { handleHTTPStatusChecker };
