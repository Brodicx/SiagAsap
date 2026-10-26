export default function NewsSection({ newsList }) {
    return (
        <section id="berita" className="card-panel">
            <h2 className="section-title"><span>📰</span> Pantauan Berita Terkini</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {!newsList || newsList.length === 0 ? (
                    <p className="text-base font-bold text-slate-400 p-4">Belum ada pembaruan berita hari ini.</p>
                ) : (
                    newsList.map((news, idx) => (
                        <a key={idx} href={news.url} target="_blank" rel="noreferrer" className="group flex flex-col sm:flex-row gap-5 p-5 border-2 rounded-2xl hover:bg-slate-50 transition border-slate-100 hover:border-slate-300">
                            <img src={news.image || 'https://via.placeholder.com/150x150?text=No+Image'} alt="Berita" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150x150?text=Berita'; }} className="w-full sm:w-36 h-32 object-cover rounded-xl bg-slate-200 shrink-0" />
                            <div className="flex flex-col justify-center">
                                <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-red-600 transition line-clamp-2">{news.title}</h3>
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{news.description}</p>
                                {/* PENGGUNAAN OPTIONAL CHAINING (?.name) */}
                                <span className="text-xs font-black text-red-500 mt-3 tracking-widest">
                                    {news.source?.name ? news.source.name.toUpperCase() : 'BERITA'}
                                </span>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </section>
    );
}