const fs = require('fs');
const { checkPwnedPasswords } = require('../utils/checkPwnedPasswords.js');

function handlePassChecker(bot, chatId) {
    bot.sendMessage(chatId, "💭 RockYou veya PwnedPasswords veritabanından birini seçin:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "RockYou", callback_data: 'rockyou' }],
                [{ text: "PwnedPasswords", callback_data: 'pwnedpasswords' }]
            ]
        }
    });

    bot.on('callback_query', (query) => {
        const selectedDB = query.data;
        bot.sendMessage(chatId, `💭 Şifrenizi girin:`);
        
        bot.once('message', (msg) => {
            const password = msg.text.trim();

            if (selectedDB === 'rockyou') {
                checkRockYou(password).then(found => {
                    bot.sendMessage(chatId, found ? "❌ Bu şifre RockYou veritabanında bulundu!" : "✅ Bu şifre bulunamadı.");
                });
            } else {
                checkPwnedPasswords(password).then(count => {
                    bot.sendMessage(chatId, count > 0 ? `❌ Bu şifre ${count} defa sızdırılmış!` : "✅ Bu şifre sızdırılmamış.");
                });
            }
        });

        bot.answerCallbackQuery(query.id);
    });
}

function checkRockYou(password) {
    return new Promise((resolve) => {
        const filePath = './utils/rockyou.txt';
        if (fs.existsSync(filePath)) {
            const stream = fs.createReadStream(filePath, 'utf8');
            let found = false;
            stream.on('data', (chunk) => {
                if (chunk.includes(password)) {
                    found = true;
                    stream.close();
                }
            });
            stream.on('close', () => resolve(found));
        } else {
            resolve(false);
        }
    });
}

module.exports = { handlePassChecker };