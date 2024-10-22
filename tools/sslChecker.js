const https = require('https');

function handleSSLChecker(bot, chatId) {
    bot.sendMessage(chatId, "💭 SSL sertifikasını kontrol etmek istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için SSL sertifikası kontrol ediliyor...`);
        checkSSL(domain).then(result => {
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n${result}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function checkSSL(domain) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: domain,
            port: 443,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            const cert = res.connection.getPeerCertificate();
            if (cert && Object.keys(cert).length) {
                resolve(`*Sertifika Sahibi:* ${cert.subject.CN}\n*Sertifika Veriliş Tarihi:* ${cert.valid_from}\n*Sertifika Bitiş Tarihi:* ${cert.valid_to}`);
            } else {
                reject(new Error('Sertifika bulunamadı.'));
            }
        });

        req.on('error', (e) => {
            reject(new Error('SSL sorgusunda hata oluştu.'));
        });

        req.end();
    });
}

module.exports = { handleSSLChecker };
