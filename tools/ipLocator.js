const axios = require('axios');

function handleIPLocator(bot, chatId) {
    bot.sendMessage(chatId, "💭 Bilgilerini öğrenmek istediğiniz IP adresini yazın (8.8.8.8):");
    
    bot.once('message', (msg) => {
        const ip = msg.text.trim();
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (!ipRegex.test(ip)) {
            bot.sendMessage(chatId, `❌ *HATA:* Geçersiz IP adresi. Lütfen geçerli bir IP adresi girin.`, { parse_mode: 'Markdown' });
            return;
        }

        axios.get(`http://ip-api.com/json/${ip}`).then(response => {
            const data = response.data;
            if (data.status === 'fail') {
                bot.sendMessage(chatId, `❌ *HATA:* \`${ip}\` adresini bulamadım.`, { parse_mode: 'Markdown' });
            } else {
                bot.sendMessage(chatId, `🌐 *IP Adresi:* \`${data.query}\`
📍 *Lokasyon:* ${data.city}, ${data.country}
📏 *Koordinatlar:* ${data.lat}, ${data.lon}
🌍 *Google Maps:* [Konumu gör](https://www.google.com/maps/place/${data.lat},${data.lon})`, { parse_mode: 'Markdown' });
            }
        }).catch(() => {
            bot.sendMessage(chatId, `❌ *HATA:* IP bilgilerini alırken bir sorun oluştu.`, { parse_mode: 'Markdown' });
        });
    });
}

module.exports = { handleIPLocator };