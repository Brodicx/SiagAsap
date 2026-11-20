import { useState, useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import IspuSection from './components/IspuSection';
import ReportSection from './components/ReportSection';
import PoskoSection from './components/PoskoSection';
import NewsSection from './components/NewsSection';
import SiteFooter from './components/SiteFooter';
import { LocateFixed, ArrowDown, ArrowLeft } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import SatgasDashboard from './components/SatgasDashboard';

import { calculateDistance } from './utils/helpers';
import {
    fetchAllInitialData, fetchIspuByCity, fetchPoskoByCity,
    fetchIspuByCoords, fetchPoskoByCoords, fetchHospitalsByCoords, sendReport,
    updateReportStatusApi, deleteReportApi
} from './services/api';

export default function App() {
    const [currentView, setCurrentView] = useState('user');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [showAllFacilities, setShowAllFacilities] = useState(false);

    const [ispuList, setIspuList] = useState([]);
    const [reportsList, setReportsList] = useState([]);
    const [poskoList, setPoskoList] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const [hospitalError, setHospitalError] = useState('');
    const [isHospitalLoading, setIsHospitalLoading] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [topIspuList, setTopIspuList] = useState([]);

    const [searchIspu, setSearchIspu] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [headerLocation, setHeaderLocation] = useState('Seluruh Wilayah');
    const [userCoords, setUserCoords] = useState(null);

    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [nama, setNama] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [kepekatan, setKepekatan] = useState('Ringan');
    const [reportLat, setReportLat] = useState(null);
    const [reportLng, setReportLng] = useState(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [fetchedAt, setFetchedAt] = useState(null);
    const [geoError, setGeoError] = useState('');
    const [lastQuery, setLastQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportStatus, setReportStatus] = useState(null);

    const fetchData = async () => {
        try {
            const data = await fetchAllInitialData();
            setFetchedAt(new Date());
            setIspuList(data.ispu);
            setReportsList(data.reports);
            setPoskoList(data.posko);
            setNewsList(data.news);
            setTopIspuList(data.topIspu);
        } catch (err) {
            console.error('Gagal mengambil data:', err);
            setLoadError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const refetch = () => {
        setIsLoading(true);
        setLoadError(false);
        return fetchData();
    };

    const loadHospitals = async (coords) => {
        setHospitalError('');
        if (!coords) {
            setHospitalList([]);
            setIsHospitalLoading(false);
            return;
        }

        setIsHospitalLoading(true);
        try {
            const result = await fetchHospitalsByCoords(coords.lat, coords.lng);
            if (!result.success || !Array.isArray(result.data)) throw new Error(result.error || 'Gagal memuat rumah sakit.');
            setHospitalList(result.data);
        } catch (err) {
            console.error('Gagal mengambil rumah sakit:', err);
            setHospitalList([]);
            setHospitalError(err instanceof Error ? err.message : 'Layanan pencarian rumah sakit tidak merespons. Coba lagi nanti.');
        } finally {
            setIsHospitalLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sortedFacilities = [...poskoList, ...hospitalList].map(p => {
        const distance = userCoords ? calculateDistance(userCoords.lat, userCoords.lng, p.latitude, p.longitude) : null;
        return { ...p, distance };
    }).sort((a, b) => {
        if (a.distance != null && b.distance != null) return a.distance - b.distance;
        if (a.distance != null) return -1;
        if (b.distance != null) return 1;
        return 0;
    });

    const handleSearchIspu = async (e) => {
        e.preventDefault();
        setShowAllFacilities(false);
        setGeoError('');
        setLastQuery(searchIspu.trim());
        if (!searchIspu.trim()) {
            setLastQuery('');
            setHeaderLocation('Seluruh Wilayah');
            setUserCoords(null);
            await loadHospitals(null);
            fetchData();
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        setHeaderLocation(searchIspu.toUpperCase());
        setHospitalList([]);
        setHospitalError('');

        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchIspu}&count=1&language=id`).then(r => r.json());
            let coords = null;
            if (geoRes.results && geoRes.results.length > 0) {
                coords = { lat: geoRes.results[0].latitude, lng: geoRes.results[0].longitude };
                setUserCoords(coords);
            } else {
                setUserCoords(null);
            }
            const hospitalRequest = loadHospitals(coords);

            const resIspu = await fetchIspuByCity(searchIspu);
            if (resIspu.success) { setIspuList(resIspu.data); setFetchedAt(new Date()); setLoadError(false); }

            const resPosko = await fetchPoskoByCity(searchIspu);
            if (resPosko.success) setPoskoList(resPosko.data.length > 0 ? resPosko.data : []);
            await hospitalRequest;
        } catch (err) {
            console.error("Gagal mencari kota:", err);
            setIspuList([]);
            setLoadError(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) return setGeoError('Browser ini tidak mendukung lokasi. Cari dengan nama kota.');
        setShowAllFacilities(false);
        setGeoError('');
        setLastQuery('');
        setIsSearching(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const coords = { lat, lng };
            setUserCoords(coords);
            setHospitalList([]);
            setHospitalError('');
            const hospitalRequest = loadHospitals(coords);

            try {
                const resIspu = await fetchIspuByCoords(lat, lng);
                if (resIspu.success) { setIspuList(resIspu.data); setFetchedAt(new Date()); setLoadError(false); }

                const resPosko = await fetchPoskoByCoords(lat, lng);
                if (resPosko.success) setPoskoList(resPosko.data);
                await hospitalRequest;

                setHeaderLocation('LOKASI ANDA (GPS)');
                setSearchIspu('');
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            } finally {
                setIsSearching(false);
            }
        }, () => {
            setGeoError('Lokasi tidak dapat dibaca, mungkin izin ditolak. Cari dengan nama kota sebagai gantinya.');
            setIsSearching(false);
        });
    };

    const handleGetReportLocation = () => {
        if (!navigator.geolocation) return setReportStatus({ type: 'error', message: 'Browser ini tidak mendukung lokasi. Tulis alamat atau patokan lokasi secara manual.' });
        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setUserCoords({ lat, lng });
                setReportLat(lat);
                setReportLng(lng);
                setLokasi(`Titik GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                setIsFetchingLocation(false);
            },
            () => {
                setReportStatus({ type: 'error', message: 'Titik GPS tidak dapat dibaca. Tulis alamat atau patokan lokasi secara manual.' });
                setIsFetchingLocation(false);
            }
        );
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setReportStatus(null);
        try {
            const data = await sendReport({ nama_pelapor: nama, whatsapp, lokasi_deskripsi: lokasi, latitude: reportLat, longitude: reportLng, kepekatan_asap: kepekatan });
            if (data.success) {
                setReportStatus({ type: 'success', message: 'Laporan diterima server dan diteruskan ke petugas untuk diverifikasi.' });
                setNama(''); setWhatsapp(''); setLokasi(''); setReportLat(null); setReportLng(null);
                fetchData();
            } else {
                setReportStatus({ type: 'error', message: 'Server menolak laporan. Data yang Anda isi masih tersimpan, silakan coba kirim lagi.' });
            }
        } catch (err) {
            console.error('Gagal mengirim laporan:', err);
            setReportStatus({ type: 'error', message: 'Laporan belum terkirim karena koneksi gagal. Data yang Anda isi masih tersimpan, silakan coba lagi.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if ((adminEmail === 'admin' || adminEmail === 'admin@bpbd.go.id') && adminPassword === 'admin123') {
            setIsAdminLoggedIn(true); setCurrentView('admin'); setLoginError(''); setAdminEmail(''); setAdminPassword('');
        } else {
            setLoginError('Email/Username atau Password Admin salah!');
        }
    };

    const handleLogout = () => { setIsAdminLoggedIn(false); setCurrentView('user'); };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateReportStatusApi(id, newStatus);
            fetchData();
        } catch (err) { console.error('Gagal update:', err); }
    };

    const handleDeleteReport = async (id) => {
        if (!window.confirm('Hapus laporan?')) return;
        try {
            await deleteReportApi(id);
            fetchData();
        } catch (err) { console.error('Gagal hapus:', err); }
    };

    return (
        <div className="min-h-screen bg-canvas font-sans text-ink">
            <Navbar
                currentView={currentView}
                setCurrentView={setCurrentView}
                headerLocation={headerLocation === 'Seluruh Wilayah' ? 'Kota pantauan' : headerLocation.charAt(0) + headerLocation.slice(1).toLowerCase()}
                isAdminLoggedIn={isAdminLoggedIn}
                handleLogout={handleLogout}
            />

            <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
                {currentView === 'user' && (
                    <div className="space-y-10">
                        <header className="hero-intro max-w-3xl">
                            <h1 className="hero-intro__title text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">Udara, titik api, dan fasilitas kesehatan di sekitar Anda</h1>
                            <p className="hero-intro__copy mt-3 text-base text-muted md:text-lg">Lihat estimasi kualitas udara, kirim laporan titik api, serta temukan rumah sakit dan posko medis di wilayah pilihan.</p>
                            <div className="hero-intro__actions mt-5 flex flex-wrap gap-3">
                                <button onClick={handleMyLocation} disabled={isSearching} className="btn-ink"><LocateFixed size={18} aria-hidden="true" />Cek udara di lokasi saya</button>
                                <a href="#posko" className="btn-line"><ArrowDown size={18} aria-hidden="true" />Cari fasilitas kesehatan</a>
                            </div>
                        </header>

                        <IspuSection
                            ispuList={ispuList}
                            topIspuList={topIspuList}
                            searchIspu={searchIspu}
                            setSearchIspu={setSearchIspu}
                            handleSearchIspu={handleSearchIspu}
                            handleMyLocation={handleMyLocation}
                            isSearching={isSearching}
                            isLoading={isLoading}
                            loadError={loadError}
                            onRetry={refetch}
                            fetchedAt={fetchedAt}
                            geoError={geoError}
                            lastQuery={lastQuery}
                            isDefaultView={headerLocation === 'Seluruh Wilayah'}
                        />

                        <PoskoSection
                            sortedFacilities={sortedFacilities}
                            showAllFacilities={showAllFacilities}
                            setShowAllFacilities={setShowAllFacilities}
                            userCoords={userCoords}
                            headerLocation={headerLocation}
                            isLoading={isLoading}
                            isHospitalLoading={isHospitalLoading}
                            hospitalError={hospitalError}
                            onRetryHospitals={() => loadHospitals(userCoords)}
                        />

                        <NewsSection newsList={newsList} isLoading={isLoading} />
                    </div>
                )}

                {currentView === 'report' && (
                    <div className="mx-auto max-w-2xl">
                        <button
                            type="button"
                            onClick={() => { setCurrentView('user'); window.scrollTo(0, 0); }}
                            className="btn-line mb-4"
                        >
                            <ArrowLeft size={18} aria-hidden="true" />Kembali ke beranda
                        </button>
                        <ReportSection
                            nama={nama} setNama={setNama}
                            whatsapp={whatsapp} setWhatsapp={setWhatsapp}
                            lokasi={lokasi} setLokasi={setLokasi}
                            kepekatan={kepekatan} setKepekatan={setKepekatan}
                            reportLat={reportLat} reportLng={reportLng}
                            handleGetReportLocation={handleGetReportLocation}
                            isFetchingLocation={isFetchingLocation}
                            handleSubmitReport={handleSubmitReport}
                            isSubmitting={isSubmitting}
                            reportStatus={reportStatus}
                        />
                    </div>
                )}

                {currentView === 'login' && (
                    <AdminLogin
                        adminEmail={adminEmail} setAdminEmail={setAdminEmail}
                        adminPassword={adminPassword} setAdminPassword={setAdminPassword}
                        loginError={loginError} handleLoginSubmit={handleLoginSubmit}
                    />
                )}

                {currentView === 'admin' && isAdminLoggedIn && (
                    <SatgasDashboard
                        reportsList={reportsList}
                        handleUpdateStatus={handleUpdateStatus}
                        handleDeleteReport={handleDeleteReport}
                        isLoading={isLoading}
                        loadError={loadError}
                        onRetry={refetch}
                    />
                )}
            </main>
            <SiteFooter />
        </div>
    );
}
