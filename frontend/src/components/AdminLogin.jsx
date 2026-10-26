export default function AdminLogin({ adminEmail, setAdminEmail, adminPassword, setAdminPassword, loginError, handleLoginSubmit }) {
    return (
        <div className="max-w-md mx-auto my-16 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto text-3xl mb-4 shadow-md">🔐</div>
                <h2 className="text-2xl font-black text-slate-800">Area Satgas</h2>
                <p className="text-slate-500 mt-2 text-sm">Login khusus petugas BPBD & Damkar</p>
            </div>
            {loginError && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl font-bold text-center">⚠️ {loginError}</div>}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                    <label className="input-label">Username</label>
                    <input type="text" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="input-field" placeholder="Ketik username..." />
                </div>
                <div>
                    <label className="input-label">Password</label>
                    <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="input-field" placeholder="Ketik password..." />
                </div>
                <button type="submit" className="btn-secondary w-full py-4 text-lg mt-2">Masuk ke Sistem</button>
            </form>
        </div>
    );
}