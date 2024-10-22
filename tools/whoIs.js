const whois = require('whois');

function handleWhoIS(bot, chatId) {
    bot.sendMessage(chatId, "💭 Detaylı bilgilerini öğrenmek istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için WHOIS bilgileri alınıyor...`);
        whois.lookup(domain, (err, data) => {
            if (err) {
                bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
                return;
            }

            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n\`\`\`${data}\`\`\``, { parse_mode: 'Markdown' });
        });
    });
}

module.exports = { handleWhoIS };
