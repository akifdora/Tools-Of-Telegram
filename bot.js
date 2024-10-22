const TelegramBot = require('node-telegram-bot-api');
const token = 'BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });
console.log('\x1b[32m%s\x1b[0m', `Bot başarıyla çalıştırıldı - ${new Date().toLocaleString()}`);
bot.on('polling_error', () => {});

const { handleDomainToIP } = require('./tools/domainToIP.js');
const { handleIPLocator } = require('./tools/ipLocator.js');
const { handlePassChecker } = require('./tools/passChecker.js');
const { handlePortScan } = require('./tools/portScan.js');
const { handleSiteMapping } = require('./tools/siteMapping.js');
const { handleSubdomainScan } = require('./tools/subdomainScan.js');
const { handleSubnetScan } = require('./tools/subnetScan.js');
const { handleWhoIS } = require('./tools/whoIs.js');
const { handleReverseDnsLookup } = require('./tools/reverseDnsLookup.js');
const { handleSSLChecker } = require('./tools/sslChecker.js');
const { handleDNSRecordLookup } = require('./tools/dnsRecordLookup.js');
const { handleHTTPHeaders } = require('./tools/httpHeaders.js');
const { handleHTTPStatusChecker } = require('./tools/httpStatusChecker.js');
const { handleVulnerabilityScanner } = require('./tools/vulnerabilityScanner');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "👋 Selamlar, ben *Tools Of Telegram Bot*\n\nLütfen alttaki menüden yapmak istediğin işlemi seç!", {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                [{ text: "🤖 Araçlar" }],
                [{ text: "🔢 DomainToIP" }, { text: "🌍 IP Locator" }],
                [{ text: "🔑 PassChecker" }, { text: "🔌 PortScan" }],
                [{ text: "🗺️ SiteMapping" }, { text: "📇 SubdomainScan" }],
                [{ text: "🔢 SubnetScan" }, { text: "📋 WhoIS" }],
                [{ text: "🔍 ReverseDnsLookup" }, { text: "🔒 SSLChecker" }],
                [{ text: "📄 DNSRecordLookup" }, { text: "📑 HTTPHeaders" }],
                [{ text: "⚡ HTTPStatusChecker" }, { text: "🛡️ VulnerabilityScanner" }]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '🤖 Araçlar') {
        bot.sendMessage(chatId, `🔢 *DomainToIP:* Girilen domainin IP adresini hızlıca öğrenin.
🌍 *IP Locator:* Belirli bir IP adresinin coğrafi ve ağ bilgilerini alın.
🔑 *PassChecker:* Şifrelerinizin güvenli olup olmadığını kontrol edin.
🔌 *PortScan:* Girilen domain üzerindeki açık ve kapalı portları tespit edin.
🗺️ *SiteMapping:* Girilen domainin site haritasını oluşturun, sayfalar arasındaki bağlantıları görün.
📇 *SubdomainScan:* Girilen domainin alt domainlerini hızlıca tarayın ve tespit edin.
🔢 *SubnetScan:* Girilen IP adresi aralığında açık IP'leri tespit edin ve listeleyin.
📋 *WhoIS:* Girilen domainin detaylı bilgilerini alın ve alan adı hakkında geniş bilgi edinin.
🔍 *ReverseDnsLookup:* Girilen IP adresinin hangi domaine ait olduğunu hızlıca öğrenin.
🔒 *SSLChecker:* Girilen domainin SSL sertifikasını kontrol edin, geçerlilik tarihleri ve sahibi hakkında bilgi edinin.
📄 *DNSRecordLookup:* Girilen domainin DNS kayıtlarını listeler ve kayıtlara dair detaylı bilgi verir.
📑 *HTTPHeaders:* Girilen domainin HTTP Header'larını listeler, sunucudan gelen yanıt bilgilerini gösterir.
⚡ *HTTPStatusChecker:* Girilen domainin HTTP durum kodunu hızlıca öğrenin.
🛡️ *VulnerabilityScanner:* Girilen web sitesindeki potansiyel güvenlik açıklarını tarayın.
`, { parse_mode: 'Markdown' });
    } else if (text === '🔢 DomainToIP') {
        handleDomainToIP(bot, chatId);
    } else if (text === '🌍 IP Locator') {
        handleIPLocator(bot, chatId);
    } else if (text === '🔑 PassChecker') {
        handlePassChecker(bot, chatId);
    } else if (text === '🔌 PortScan') {
        handlePortScan(bot, chatId);
    } else if (text === '🗺️ SiteMapping') {
        handleSiteMapping(bot, chatId);
    } else if (text === '📇 SubdomainScan') {
        handleSubdomainScan(bot, chatId);
    } else if (text === '🔢 SubnetScan') {
        handleSubnetScan(bot, chatId)
    } else if (text === '📋 WhoIS') {
        handleWhoIS(bot, chatId)
    } else if (text === '🔍 ReverseDnsLookup') {
        handleReverseDnsLookup(bot, chatId)
    } else if (text === '🔒 SSLChecker') {
        handleSSLChecker(bot, chatId)
    } else if (text === '📄 DNSRecordLookup') {
        handleDNSRecordLookup(bot, chatId)
    } else if (text === '📑 HTTPHeaders') {
        handleHTTPHeaders(bot, chatId)
    } else if (text === '⚡ HTTPStatusChecker') {
        handleHTTPStatusChecker(bot, chatId)
    } else if (text === '🛡️ VulnerabilityScanner') {
        handleVulnerabilityScanner(bot, chatId)
    }
});
