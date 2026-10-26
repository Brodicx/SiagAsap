import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 1. Memuat konfigurasi dari file .env
dotenv.config();

// 2. Membuat Pool Koneksi menggunakan variabel dari .env
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Batas koneksi maksimal ke VPS
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// 3. Tes Koneksi Awal (Otomatis berjalan saat server.mjs dinyalakan)
const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log(`✅ BERHASIL: Terhubung ke database MySQL di VPS (${process.env.DB_HOST})`);
        connection.release(); // Lepaskan kembali koneksi setelah dites
    } catch (error) {
        console.error('🔥 GAGAL KONEKSI KE DATABASE:');
        console.error('Pesan Error:', error.message);
    }
};

testConnection();

// 4. Ekspor 'db' agar bisa digunakan di server.mjs
export default db;