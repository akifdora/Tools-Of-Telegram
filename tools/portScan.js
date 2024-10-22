const net = require('net');

function handlePortScan(bot, chatId) {
    bot.sendMessage(chatId, "💭 Portlarını kontrol etmek istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();
        const ports = [21, 22, 25, 80, 81, 110, 143, 443, 587, 2525, 3306];

        bot.sendMessage(chatId, `🔍 ${domain} için portlar taranıyor...`);
        scanPorts(domain, ports).then(results => {
            const resultMessage = results.join('\n');
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n${resultMessage}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function scanPorts(domain, ports) {
    return new Promise((resolve) => {
        const results = [];
        let checkedPorts = 0;

        ports.forEach((port) => {
            const socket = new net.Socket();
            socket.setTimeout(2000);

            socket.connect(port, domain, () => {
                results.push(`*${port}:* Açık ✅`);
                socket.destroy();
                checkedPorts++;
                if (checkedPorts === ports.length) resolve(results);
            });

            socket.on('error', () => {
                results.push(`*${port}:* Kapalı ❌`);
                checkedPorts++;
                if (checkedPorts === ports.length) resolve(results);
            });

            socket.on('timeout', () => {
                results.push(`*${port}:* Zaman aşımı ❌`);
                checkedPorts++;
                socket.destroy();
                if (checkedPorts === ports.length) resolve(results);
            });
        });
    });
}

module.exports = { handlePortScan };
