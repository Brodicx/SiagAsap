import { useState } from 'react';
import { Menu, X, MapPin, Lock, LogOut, LayoutDashboard, Siren } from 'lucide-react';

const NAV = [
    { href: '#kualitas-udara', label: 'Kualitas udara' },
    { href: '#posko', label: 'Fasilitas kesehatan' },
    { href: '#berita', label: 'Berita' },
];

export default function Navbar({ currentView, setCurrentView, headerLocation, isAdminLoggedIn, handleLogout }) {
    const [open, setOpen] = useState(false);
    const isPublic = currentView === 'user';
    const goHome = () => { setCurrentView('user'); setOpen(false); window.scrollTo(0, 0); };
    const openReport = () => { setCurrentView('report'); setOpen(false); window.scrollTo(0, 0); };

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-surface">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-2.5 md:px-6">
                <div className="flex items-center gap-8">
                    <button onClick={goHome} className="flex min-h-11 items-center cursor-pointer" aria-label="SiagAsap, ke beranda">
                        <img src="/logo-siagasap.png" alt="SiagAsap" width="154" height="44" className="h-11 w-auto object-contain" />
                    </button>
                    {isPublic && (
                        <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1">
                            {NAV.map((n) => (
                                <a key={n.href} href={n.href} className="rounded-control px-3 py-2 text-[15px] font-medium text-muted hover:bg-canvas hover:text-ink">{n.label}</a>
                            ))}
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isPublic && (
                        <span className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted" title="Wilayah yang sedang ditampilkan">
                            <MapPin size={16} aria-hidden="true" />
                            <span className="max-w-[180px] truncate">{headerLocation}</span>
                        </span>
                    )}
                    {isPublic && <button type="button" onClick={openReport} className="btn-brand hidden sm:inline-flex"><Siren size={18} aria-hidden="true" />Lapor titik api</button>}

                    {!isAdminLoggedIn ? (
                        <button onClick={() => { setCurrentView('login'); setOpen(false); }} className="btn-line hidden sm:inline-flex" aria-current={currentView === 'login' ? 'page' : undefined}>
                            <Lock size={16} aria-hidden="true" />Admin
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setCurrentView('admin')} className="btn-line" aria-current={currentView === 'admin' ? 'page' : undefined}><LayoutDashboard size={16} aria-hidden="true" /><span className="hidden sm:inline">Dasbor</span></button>
                            <button onClick={handleLogout} className="btn-line"><LogOut size={16} aria-hidden="true" /><span className="hidden sm:inline">Keluar</span></button>
                        </>
                    )}

                    <button onClick={() => setOpen(!open)} className="btn-line lg:hidden px-3" aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? 'Tutup menu' : 'Buka menu'}>
                        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {open && (
                <nav id="menu-mobile" aria-label="Menu seluler" className="lg:hidden border-t border-line bg-surface px-4 py-2">
                    {isPublic && <p className="flex items-center gap-1.5 py-2 text-sm text-muted"><MapPin size={16} aria-hidden="true" />Wilayah: {headerLocation}</p>}
                    {isPublic && <button type="button" onClick={openReport} className="btn-brand my-2 w-full"><Siren size={18} aria-hidden="true" />Lapor titik api</button>}
                    {isPublic && NAV.map((n) => (
                        <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center border-t border-line text-base font-medium">{n.label}</a>
                    ))}
                    {!isAdminLoggedIn && (
                        <button onClick={() => { setCurrentView('login'); setOpen(false); }} className="flex min-h-11 w-full items-center gap-2 border-t border-line text-base font-medium text-muted cursor-pointer"><Lock size={16} aria-hidden="true" />Masuk admin</button>
                    )}
                </nav>
            )}
        </header>
    );
}
