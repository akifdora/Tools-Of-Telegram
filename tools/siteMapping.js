const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');

function handleSiteMapping(bot, chatId) {
    bot.sendMessage(chatId, "💭 Haritasını çıkarmak istediğiniz domaini yazın:");

    bot.once('message', (msg) => {
        const domain = msg.text.trim();

        bot.sendMessage(chatId, `🔍 ${domain} için site haritası oluşturuluyor...`);
        crawlDomain(domain).then(results => {
            const resultMessage = results.length > 0 ? results.join('\n') : "Site haritası bulunamadı.";
            bot.sendMessage(chatId, `🌐 *Domain:* \`${domain}\`\n${resultMessage}`, { parse_mode: 'Markdown' });
        }).catch(err => {
            bot.sendMessage(chatId, `❌ *HATA:* ${err.message}`, { parse_mode: 'Markdown' });
        });
    });
}

function crawlDomain(domain) {
    return new Promise(async (resolve, reject) => {
        const visitedUrls = new Set();
        const siteMap = [];

        try {
            if (!domain.startsWith('http')) {
                domain = `http://${domain}`;
            }

            await crawlPage(domain, domain, visitedUrls, siteMap);
            resolve(siteMap);
        } catch (error) {
            reject(new Error('Domain taranırken hata oluştu.'));
        }
    });
}

async function crawlPage(pageUrl, domain, visitedUrls, siteMap) {
    if (visitedUrls.has(pageUrl)) return;
    visitedUrls.add(pageUrl);

    try {
        const response = await axios.get(pageUrl);
        const $ = cheerio.load(response.data);

        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                const absoluteUrl = url.resolve(domain, href);

                if (absoluteUrl.startsWith(domain) && !visitedUrls.has(absoluteUrl)) {
                    siteMap.push(absoluteUrl);
                    crawlPage(absoluteUrl, domain, visitedUrls, siteMap);
                }
            }
        });
    } catch (error) {
    }
}

module.exports = { handleSiteMapping };
