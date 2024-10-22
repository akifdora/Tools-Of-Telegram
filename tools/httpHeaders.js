const http = require('http');

function handleHTTPHeaders(bot, chatId) {
    bot.sendMessage(chatId, "💭 HTTP headerlarını görmek istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için HTTP headerları sorgulanıyor...`);
        getHTTPHeaders(domain).then(headers => {
            const headerMessage = Object.entries(headers).map(([key, value]) => `*${key}:* ${value}`).join('\n');
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n${headerMessage}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function getHTTPHeaders(domain) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: domain,
            method: 'HEAD',
        };

        const req = http.request(options, (res) => {
            resolve(res.headers);
        });

        req.on('error', (e) => {
            reject(new Error('HTTP headerları sorgulamada hata oluştu.'));
        });

        req.end();
    });
}

module.exports = { handleHTTPHeaders };
