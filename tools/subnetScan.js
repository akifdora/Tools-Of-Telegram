const net = require('net');

function handleSubnetScan(bot, chatId) {
    bot.sendMessage(chatId, "💭 Tarama yapmak istediğiniz IP adresini ve aralığı (ör. 192.168.1.1-192.168.1.10) yazın:");

    bot.once('message', (msg) => {
        const input = msg.text.trim();
        const [startIP, endIP] = input.split('-');

        if (!startIP || !endIP) {
            bot.sendMessage(chatId, "❌ Geçersiz IP aralığı.");
            return;
        }

        bot.sendMessage(chatId, `🔍 ${startIP}-${endIP} aralığında açık IP'ler taranıyor...`);
        scanSubnet(startIP, endIP).then(results => {
            const resultMessage = results.length > 0 ? results.join('\n') : "Açık IP bulunamadı.";
            bot.sendMessage(chatId, `🌐 *IP Aralığı:* \`${startIP}-${endIP}\`\n${resultMessage}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function scanSubnet(startIP, endIP) {
    return new Promise((resolve) => {
        const start = ipToLong(startIP);
        const end = ipToLong(endIP);
        const results = [];
        let checkedIPs = 0;

        for (let i = start; i <= end; i++) {
            const ip = longToIp(i);
            const socket = new net.Socket();
            socket.setTimeout(1000);

            socket.connect(80, ip, () => {
                results.push(`*${ip}:* Açık ✅`);
                socket.destroy();
                checkedIPs++;
                if (checkedIPs === (end - start + 1)) resolve(results);
            });

            socket.on('error', () => {
                checkedIPs++;
                if (checkedIPs === (end - start + 1)) resolve(results);
            });

            socket.on('timeout', () => {
                checkedIPs++;
                socket.destroy();
                if (checkedIPs === (end - start + 1)) resolve(results);
            });
        }
    });
}

function ipToLong(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

function longToIp(long) {
    return [long >>> 24, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join('.');
}

module.exports = { handleSubnetScan };
