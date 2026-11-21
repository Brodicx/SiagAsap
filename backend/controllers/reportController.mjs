import db from '../config/db.mjs';

export const getReports = async (req, res) => {
    try {
        const query = `
            SELECT r.report_id, u_pelapor.nama AS nama_pelapor, r.whatsapp, r.lokasi_deskripsi,
                   r.kepekatan_asap, r.status_penanganan, r.tgl_lapor
            FROM reports_kebakaran r
            JOIN users u_pelapor ON r.user_id = u_pelapor.user_id
            ORDER BY r.tgl_lapor DESC;
        `;
        const result = await db.query(query);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.log("🔥 ERROR DARI VPS:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const createReport = async (req, res) => {
    const { nama_pelapor, whatsapp, lokasi_deskripsi, latitude, longitude, kepekatan_asap } = req.body;
    try {
        const emailGuest = `guest_${Date.now()}@mail.com`;
        const userResult = await db.query(
            `INSERT INTO users (nama, email, password, role) VALUES ($1, $2, '123', 'Warga') RETURNING user_id`,
            [nama_pelapor || 'Anonim', emailGuest]
        );
        const newUserId = userResult.rows[0].user_id;

        const query = `
            INSERT INTO reports_kebakaran (user_id, whatsapp, lokasi_deskripsi, latitude, longitude, kepekatan_asap)
            VALUES ($1, $2, $3, $4, $5, $6);
        `;
        await db.query(query, [newUserId, whatsapp, lokasi_deskripsi, latitude || -2.1985, longitude || 113.8820, kepekatan_asap]);
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
        await db.query(`UPDATE reports_kebakaran SET status_penanganan = $1 WHERE report_id = $2`, [status_penanganan, id]);
        res.json({ success: true, message: 'Status berhasil diperbarui!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM reports_kebakaran WHERE report_id = $1`, [id]);
        res.json({ success: true, message: 'Laporan berhasil dihapus!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};