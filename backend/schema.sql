CREATE DATABASE IF NOT EXISTS siagasap
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE siagasap;

CREATE TABLE IF NOT EXISTS users (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Warga',
    PRIMARY KEY (user_id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reports_kebakaran (
    report_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    whatsapp VARCHAR(24) NOT NULL,
    lokasi_deskripsi VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL DEFAULT -2.1985000,
    longitude DECIMAL(10, 7) NOT NULL DEFAULT 113.8820000,
    kepekatan_asap VARCHAR(50) NOT NULL,
    status_penanganan VARCHAR(50) NOT NULL DEFAULT 'Menunggu Verifikasi',
    tgl_lapor TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (report_id),
    KEY reports_kebakaran_user_id_idx (user_id),
    KEY reports_kebakaran_tgl_lapor_idx (tgl_lapor),
    CONSTRAINT reports_kebakaran_user_fk
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posko_kesehatan (
    posko_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nama_posko VARCHAR(200) NOT NULL,
    lokasi VARCHAR(500) NOT NULL,
    kontak VARCHAR(50) NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    nama_barang VARCHAR(200) NULL,
    jumlah_stok INT NULL,
    satuan VARCHAR(50) NULL,
    PRIMARY KEY (posko_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
