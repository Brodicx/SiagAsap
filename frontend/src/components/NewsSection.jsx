import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

function NewsItem({ news }) {
    const [imageAvailable, setImageAvailable] = useState(Boolean(news.image));
    const sourceName = news.source?.name
        ? news.source.name.replace(/\b(\w)(\w*)/g, (match, first, rest) => first + rest.toLowerCase())
        : 'Sumber tidak diketahui';

    return (
        <li>
            <a href={news.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 py-4 sm:grid-cols-[132px_minmax(0,1fr)] md:grid-cols-[180px_minmax(0,1fr)] md:gap-6">
                {imageAvailable ? (
                    <img
                        src={news.image}
                        alt={`Foto berita: ${news.title}`}
                        width="360"
                        height="203"
                        loading="lazy"
                        decoding="async"
                        onError={() => setImageAvailable(false)}
                        className="aspect-video w-full rounded-control border border-line bg-canvas object-cover"
                    />
                ) : (
                    <span className="flex aspect-video w-full items-center justify-center rounded-control border border-line bg-canvas px-2 text-center text-xs text-muted">
                        Foto tidak tersedia
                    </span>
                )}
                <span className="min-w-0">
                    <span className="block text-sm font-semibold text-muted">{sourceName}</span>
                    <span className="mt-1 flex items-start gap-1.5 text-lg font-semibold leading-snug group-hover:text-brand">
                        {news.title}
                        <ArrowUpRight size={18} className="mt-1 shrink-0" aria-hidden="true" />
                    </span>
                    {news.description && <span className="mt-1 block text-[15px] text-muted line-clamp-2">{news.description}</span>}
                </span>
            </a>
        </li>
    );
}

export default function NewsSection({ newsList, isLoading }) {
    return (
        <section id="berita" aria-labelledby="h-berita" className="scroll-mt-24">
            <h2 id="h-berita" className="text-2xl font-semibold">Berita terkini</h2>
            <p className="mt-1 text-[15px] text-muted">Dikumpulkan dari RSS Antara News dan Republika. Judul dan ringkasan milik penerbit; buka tautan untuk membaca selengkapnya.</p>
            {!newsList || newsList.length === 0 ? (
                <p className="mt-4 text-[15px] text-muted">{isLoading ? 'Memuat berita…' : 'Belum ada berita yang dapat dimuat saat ini.'}</p>
            ) : (
                <ul className="mt-4 divide-y divide-line border-y border-line">
                    {newsList.map((news) => <NewsItem key={news.url || news.title} news={news} />)}
                </ul>
            )}
        </section>
    );
}
