import { useState } from 'react';

export default function Navbar({ currentView, setCurrentView, headerLocation, isAdminLoggedIn, handleLogout }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-red-600 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">

                {/* KIRI: Logo & Navigasi Desktop */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => { setCurrentView('user'); window.scrollTo(0, 0); }}
                        className="hover:opacity-90 transition text-left flex items-center"
                    >
                        <img src="/logopanjang.png" alt="SiagAsap" className="h-10 md:h-14 w-auto object-contain" />
                    </button>

                    {/* Menu Desktop (Layar Laptop/PC) */}
                    {currentView === 'user' && (
                        <nav className="hidden lg:flex items-center gap-5 pl-6 border-l-2 border-red-500/50">
                            <a href="#kualitas-udara" className="text-sm font-bold text-red-50 hover:text-white hover:underline underline-offset-4 transition">💨 Kualitas Udara</a>
                            <a href="#lapor" className="text-sm font-bold text-red-50 hover:text-white hover:underline underline-offset-4 transition">🚨 Lapor Api</a>
                            <a href="#posko" className="text-sm font-bold text-red-50 hover:text-white hover:underline underline-offset-4 transition">🏥 Posko Medis</a>
                            <a href="#berita" className="text-sm font-bold text-red-50 hover:text-white hover:underline underline-offset-4 transition">📰 Berita Terkini</a>
                        </nav>
                    )}
                </div>

                {/* KANAN: Status Lokasi, Tombol Login, & Tombol Hamburger Mobile */}
                <div className="flex items-center gap-3">
                    <span className="text-sm bg-red-800 text-white px-4 py-1.5 rounded-full font-bold shadow-inner border border-red-700/50 items-center gap-1.5 hidden md:flex">
                        📍 <span>{headerLocation}</span>
                    </span>

                    {!isAdminLoggedIn ? (
                        <button onClick={() => setCurrentView('login')} className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${currentView === 'login' ? 'bg-slate-900 text-white shadow' : 'bg-red-700 text-white hover:bg-slate-900'}`}>
                            🔒 Login Admin
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentView('admin')} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${currentView === 'admin' ? 'bg-slate-900 text-white shadow' : 'bg-red-700 text-white hover:bg-slate-900'}`}>
                                🛠️ Dashboard
                            </button>
                            <button onClick={handleLogout} className="text-sm font-bold bg-slate-900 text-rose-300 border border-slate-700 px-4 py-1.5 rounded-xl hover:bg-rose-600 hover:text-white transition">
                                Keluar
                            </button>
                        </div>
                    )}

                    {/* Tombol Hamburger khusus tampilan HP (Mobile) */}
                    {currentView === 'user' && (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xl transition"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown Menu untuk Layar Mobile */}
            {currentView === 'user' && isMobileMenuOpen && (
                <div className="lg:hidden bg-red-700 border-t border-red-500/50 px-5 py-4 space-y-3 shadow-inner">
                    <div className="text-xs bg-red-800 text-red-100 px-3 py-1.5 rounded-lg font-bold mb-3 flex items-center gap-1.5">
                        📍 Lokasi: <span className="text-white">{headerLocation}</span>
                    </div>
                    <a
                        href="#kualitas-udara"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm font-bold text-red-50 hover:text-white border-b border-red-600/60"
                    >
                        💨 Kualitas Udara
                    </a>
                    <a
                        href="#lapor"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm font-bold text-red-50 hover:text-white border-b border-red-600/60"
                    >
                        🚨 Lapor Api
                    </a>
                    <a
                        href="#posko"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm font-bold text-red-50 hover:text-white border-b border-red-600/60"
                    >
                        🏥 Posko Medis
                    </a>
                    <a
                        href="#berita"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm font-bold text-red-50 hover:text-white"
                    >
                        📰 Berita Terkini
                    </a>
                </div>
            )}
        </header>
    );
}