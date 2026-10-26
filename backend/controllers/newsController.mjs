import Parser from 'rss-parser';

const parser = new Parser();

export const getNews = async (req, res) => {
    try {
        // Daftar beberapa RSS Feed berita nasional
        const feedUrls = [
            'https://www.antaranews.com/rss/terkini.xml',
            'https://www.antaranews.com/rss/lingkungan.xml',
            'https://www.republika.co.id/rss/nusantara'
        ];

        // Ambil semua feed secara bersamaan
        const feedPromises = feedUrls.map(url => parser.parseURL(url).catch(() => null));
        const results = await Promise.all(feedPromises);

        // Gabungkan seluruh artikel dari semua sumber
        let allArticles = [];
        results.forEach((feed, index) => {
            if (feed && feed.items) {
                const sourceName = index === 2 ? 'REPUBLIKA' : 'ANTARA NEWS';
                feed.items.forEach(item => {
                    allArticles.push({ ...item, sourceName });
                });
            }
        });

        // Kata kunci spesifik Karhutla
        const keywords = ['karhutla', 'asap', 'kebakaran', 'hutan', 'ispu', 'bencana', 'bmkg', 'bpbd'];

        // Filter artikel yang memiliki kata kunci Karhutla
        let filteredArticles = allArticles.filter(item => {
            const title = (item.title || '').toLowerCase();
            const content = (item.contentSnippet || item.content || '').toLowerCase();
            return keywords.some(key => title.includes(key) || content.includes(key));
        });

        // Ambil 4 berita teratas
        const finalArticles = (filteredArticles.length > 0 ? filteredArticles : allArticles).slice(0, 4);

        // Format data agar sesuai dengan Frontend
        const formattedData = finalArticles.map(item => ({
            title: item.title,
            description: item.contentSnippet || item.content || 'Klik untuk membaca detail berita.',
            url: item.link,
            image: item.enclosure?.url || 'https://via.placeholder.com/300x200?text=Berita+Karhutla',
            source: { name: item.sourceName || 'BERITA TERKINI' }
        }));

        return res.json({ success: true, data: formattedData });
    } catch (err) {
        console.error("🔥 ERROR MULTI-RSS NEWS:", err.message);
        return res.json({ success: true, data: [] });
    }
};