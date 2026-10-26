import db from '../config/db.mjs';

export const getPosko = async (req, res) => {
    try {
        const { city } = req.query;
        let query = `
            SELECT
                posko_id, nama_posko, lokasi, kontak,
                latitude, longitude, nama_barang, jumlah_stok, satuan
            FROM posko_kesehatan
        `;
        let params = [];

        if (city) {
            const cleanCity = city.replace(/\s+/g, '');
            query += ` WHERE REPLACE(lokasi, ' ', '') LIKE ?`;
            params.push(`%${cleanCity}%`);
        }

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("Error Get Posko:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};