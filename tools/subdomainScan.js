const dns = require('dns');

function handleSubdomainScan(bot, chatId) {
    bot.sendMessage(chatId, "💭 Alt domainlerini taramak istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için subdomainler taranıyor...`);
        scanSubdomains(domain).then(results => {
            const resultMessage = results.length > 0 ? results.join('\n') : "Alt domain bulunamadı.";
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n${resultMessage}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function scanSubdomains(domain) {
    return new Promise((resolve) => {
        const subdomains = ['www', 'mail', 'ftp', 'localhost', 'login', 'register', 'webmail', 'admin', 'vpn', 'dev', 'test', 'api', 'shop', 'blog', 'm', 'support', 'portal', 'beta', 'secure', 'dashboard']; // Yaygın subdomain'ler
        const foundSubdomains = [];
        let checkedSubdomains = 0;

        subdomains.forEach((subdomain) => {
            const fullDomain = `${subdomain}.${domain}`;
            
            dns.resolve(fullDomain, 'A', (err, addresses) => {
                if (!err && addresses.length > 0) {
                    foundSubdomains.push(`*${fullDomain}:* IP adresleri: ${addresses.join(', ')}`);
                }
                
                checkedSubdomains++;
                if (checkedSubdomains === subdomains.length) {
                    resolve(foundSubdomains);
                }
            });
        });
    });
}

module.exports = { handleSubdomainScan };
