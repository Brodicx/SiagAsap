import { Lock, CircleAlert } from 'lucide-react';

export default function AdminLogin({ adminEmail, setAdminEmail, adminPassword, setAdminPassword, loginError, handleLoginSubmit }) {
    return (
        <div className="mx-auto my-10 max-w-md panel p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-2xl font-semibold"><Lock size={22} aria-hidden="true" />Masuk petugas</h2>
            <p className="mt-1 text-[15px] text-muted">Khusus petugas BPBD dan Damkar.</p>
            {loginError && <p role="alert" className="mt-4 flex items-start gap-2 rounded-control bg-[#FBE0E0] p-3 text-sm font-medium text-[#8A1212]"><CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{loginError}</p>}
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                <div>
                    <label htmlFor="adm-user" className="field-label">Nama pengguna</label>
                    <input id="adm-user" type="text" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="field" autoComplete="username" />
                </div>
                <div>
                    <label htmlFor="adm-pass" className="field-label">Kata sandi</label>
                    <input id="adm-pass" type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="field" autoComplete="current-password" />
                </div>
                <button type="submit" className="btn-ink w-full">Masuk</button>
            </form>
        </div>
    );
}
