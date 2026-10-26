import db from '../config/db.mjs';

export const getReports = async (req, res) => {
    try {
        const query = `
            SELECT r.report_id, u_pelapor.nama AS nama_pelapor, r.lokasi_deskripsi,
                   r.kepekatan_asap, r.status_penanganan, r.tgl_lapor
            FROM reports_kebakaran r
            JOIN users u_pelapor ON r.user_id = u_pelapor.user_id
            ORDER BY r.tgl_lapor DESC;
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log("🔥 ERROR DARI VPS:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const createReport = async (req, res) => {
    const { nama_pelapor, lokasi_deskripsi, latitude, longitude, kepekatan_asap } = req.body;
    try {
        const emailGuest = `guest_${Date.now()}@mail.com`;
        const [userRes] = await db.query(
            `INSERT INTO users (nama, email, password, role) VALUES (?, ?, '123', 'Warga')`,
            [nama_pelapor || 'Anonim', emailGuest]
        );
        const newUserId = userRes.insertId;

        const query = `
            INSERT INTO reports_kebakaran (user_id, lokasi_deskripsi, latitude, longitude, kepekatan_asap)
            VALUES (?, ?, ?, ?, ?);
        `;
        await db.query(query, [newUserId, lokasi_deskripsi, latitude || -2.1985, longitude || 113.8820, kepekatan_asap]);
        res.json({ success: true, message: 'Laporan berhasil terkirim!' });
    } catch (err) {
        console.log("🔥 ERROR POST REPORT:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateReportStatus = async (req, res) => {
    const { id } = req.params;
    const { status_penanganan } = req.body;
    try {
        await db.query(`UPDATE reports_kebakaran SET status_penanganan = ? WHERE report_id = ?`, [status_penanganan, id]);
        res.json({ success: true, message: 'Status berhasil diperbarui!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM reports_kebakaran WHERE report_id = ?`, [id]);
        res.json({ success: true, message: 'Laporan berhasil dihapus!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};