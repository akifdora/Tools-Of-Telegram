const dns = require('dns');

function handleDNSRecordLookup(bot, chatId) {
    bot.sendMessage(chatId, "💭 DNS kayıtlarını öğrenmek istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için DNS kayıtları sorgulanıyor...`);
        dnsRecordLookup(domain).then(result => {
            const resultMessage = result.length > 0 ? result.join('\n') : "DNS kaydı bulunamadı.";
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n${resultMessage}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function dnsRecordLookup(domain) {
    return new Promise((resolve, reject) => {
        const records = [];

        dns.resolve4(domain, (err, addresses) => {
            if (!err && addresses.length > 0) {
                records.push(`A Kaydı (IP): ${addresses.join(', ')}`);
            }

            dns.resolveMx(domain, (err, mxRecords) => {
                if (!err && mxRecords.length > 0) {
                    records.push(`MX Kaydı (Mail Exchange): ${JSON.stringify(mxRecords)}`);
                }

                dns.resolveCname(domain, (err, cnameRecords) => {
                    if (!err && cnameRecords.length > 0) {
                        records.push(`CNAME Kaydı (Alias): ${cnameRecords.join(', ')}`);
                    }

                    dns.resolveTxt(domain, (err, txtRecords) => {
                        if (!err && txtRecords.length > 0) {
                            records.push(`TXT Kaydı (Text): ${JSON.stringify(txtRecords)}`);
                        }

                        if (records.length === 0) {
                            return reject(new Error('DNS kaydı bulunamadı.'));
                        }

                        resolve(records);
                    });
                });
            });
        });
    });
}

module.exports = { handleDNSRecordLookup };
