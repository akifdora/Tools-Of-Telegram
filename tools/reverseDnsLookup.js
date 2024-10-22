const dns = require('dns');

function handleReverseDnsLookup(bot, chatId) {
    bot.sendMessage(chatId, "💭 Reverse DNS yapmak istediğiniz IP adresini yazın:");

    bot.once('message', (msg) => {
        const ip = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${ip} için reverse DNS yapılıyor...`);
        dns.reverse(ip, (err, hostnames) => {
            if (err) {
                bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
                return;
            }

            const resultMessage = hostnames.length > 0 ? hostnames.join('\n') : "Herhangi bir domain bulunamadı.";
            bot.sendMessage(chatId, `🌐 *IP:* \`${ip}\`\n${resultMessage}`, { parse_mode: 'Markdown' });
        });
    });
}

module.exports = { handleReverseDnsLookup };
