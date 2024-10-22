const dns = require('dns');

function handleDomainToIP(bot, chatId) {
    bot.sendMessage(chatId, "💭 IP adresini öğrenmek istediğiniz site adresini yazın (google.com):");
    
    bot.once('message', (msg) => {
        const domain = msg.text.trim();
        dns.lookup(domain, (err, address) => {
            if (err) {
                bot.sendMessage(chatId, `❌ *HATA:* \`${domain}\` adresini bulamadım.`, { parse_mode: 'Markdown' });
            } else {
                bot.sendMessage(chatId, `🌐 *URL:* \`${domain}\`\n✅ *IP Adresi:* \`${address}\``, { parse_mode: 'Markdown' });
            }
        });
    });
}

module.exports = { handleDomainToIP };