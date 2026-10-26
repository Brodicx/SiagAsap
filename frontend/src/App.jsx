import { useState, useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import IspuSection from './components/IspuSection';
import ReportSection from './components/ReportSection';
import PoskoSection from './components/PoskoSection';
import NewsSection from './components/NewsSection';
import AdminLogin from './components/AdminLogin';
import SatgasDashboard from './components/SatgasDashboard';

import { calculateDistance } from './utils/helpers';
import {
    fetchAllInitialData, fetchIspuByCity, fetchPoskoByCity,
    fetchIspuByCoords, fetchPoskoByCoords, sendReport,
    updateReportStatusApi, deleteReportApi
} from './services/api';

export default function App() {
    const [currentView, setCurrentView] = useState('user');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [showAllPosko, setShowAllPosko] = useState(false);

    const [ispuList, setIspuList] = useState([]);
    const [reportsList, setReportsList] = useState([]);
    const [poskoList, setPoskoList] = useState([]);
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
    const [lokasi, setLokasi] = useState('');
    const [kepekatan, setKepekatan] = useState('Ringan');
    const [reportLat, setReportLat] = useState(null);
    const [reportLng, setReportLng] = useState(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const fetchData = async () => {
        try {
            const data = await fetchAllInitialData();
            setIspuList(data.ispu);
            setReportsList(data.reports);
            setPoskoList(data.posko);
            setNewsList(data.news);
            setTopIspuList(data.topIspu);
        } catch (err) {
            console.error('Gagal mengambil data:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sortedPosko = [...poskoList].map(p => {
        const distance = userCoords ? calculateDistance(userCoords.lat, userCoords.lng, p.latitude, p.longitude) : null;
        return { ...p, distance };
    }).sort((a, b) => {
        if (a.distance && b.distance) return a.distance - b.distance;
        return 0;
    });

    const handleSearchIspu = async (e) => {
        e.preventDefault();
        setShowAllPosko(false);
        if (!searchIspu.trim()) {
            setHeaderLocation('Seluruh Wilayah');
            setUserCoords(null);
            fetchData();
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        setHeaderLocation(searchIspu.toUpperCase());

        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchIspu}&count=1&language=id`).then(r => r.json());
            if (geoRes.results && geoRes.results.length > 0) {
                setUserCoords({ lat: geoRes.results[0].latitude, lng: geoRes.results[0].longitude });
            } else {
                setUserCoords(null);
            }

            const resIspu = await fetchIspuByCity(searchIspu);
            if (resIspu.success) setIspuList(resIspu.data.length > 0 ? resIspu.data : []);

            const resPosko = await fetchPoskoByCity(searchIspu);
            if (resPosko.success) setPoskoList(resPosko.data.length > 0 ? resPosko.data : []);
        } catch (err) {
            console.error("Gagal mencari kota:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) return alert("Browser tidak mendukung lokasi GPS.");
        setShowAllPosko(false);
        setIsSearching(true);
        setSearchIspu('Melacak...');

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserCoords({ lat, lng });

            try {
                const resIspu = await fetchIspuByCoords(lat, lng);
                if (resIspu.success) setIspuList(resIspu.data);

                const resPosko = await fetchPoskoByCoords(lat, lng);
                if (resPosko.success) setPoskoList(resPosko.data);

                setHeaderLocation('LOKASI ANDA (GPS)');
                setSearchIspu('');
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            } finally {
                setIsSearching(false);
            }
        }, () => {
            alert("Izin lokasi ditolak.");
            setSearchIspu('');
            setIsSearching(false);
        });
    };

    const handleGetReportLocation = () => {
        if (!navigator.geolocation) return alert("Browser tidak mendukung lokasi GPS.");
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
                alert("Gagal mengambil lokasi GPS.");
                setIsFetchingLocation(false);
            }
        );
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        try {
            const data = await sendReport({ nama_pelapor: nama, lokasi_deskripsi: lokasi, latitude: reportLat, longitude: reportLng, kepekatan_asap: kepekatan });
            if (data.success) {
                alert('Laporan berhasil dikirim ke Satgas Damkar!');
                setNama(''); setLokasi(''); setReportLat(null); setReportLng(null);
                fetchData();
            }
        } catch (err) {
            console.error('Gagal mengirim laporan:', err);
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
            <Navbar
                currentView={currentView}
                setCurrentView={setCurrentView}
                headerLocation={headerLocation}
                isAdminLoggedIn={isAdminLoggedIn}
                handleLogout={handleLogout}
            />

            <main className="max-w-6xl mx-auto p-5 space-y-8 mt-6">
                {currentView === 'user' && (
                    <>
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-8 rounded-3xl shadow-lg">
                            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Pusat Informasi & Pelaporan Karhutla</h2>
                            <p className="text-base md:text-lg text-red-50 opacity-90">
                                Pantau kualitas udara, cari posko medis terdekat, dan laporkan titik api dengan cepat.
                            </p>
                        </div>

                        <IspuSection
                            ispuList={ispuList}
                            topIspuList={topIspuList}
                            searchIspu={searchIspu}
                            setSearchIspu={setSearchIspu}
                            handleSearchIspu={handleSearchIspu}
                            handleMyLocation={handleMyLocation}
                            isSearching={isSearching}
                        />

                        <ReportSection
                            nama={nama} setNama={setNama}
                            lokasi={lokasi} setLokasi={setLokasi}
                            kepekatan={kepekatan} setKepekatan={setKepekatan}
                            reportLat={reportLat} reportLng={reportLng}
                            handleGetReportLocation={handleGetReportLocation}
                            isFetchingLocation={isFetchingLocation}
                            handleSubmitReport={handleSubmitReport}
                        />

                        <PoskoSection
                            sortedPosko={sortedPosko}
                            showAllPosko={showAllPosko}
                            setShowAllPosko={setShowAllPosko}
                            userCoords={userCoords}
                            headerLocation={headerLocation}
                        />

                        <NewsSection newsList={newsList} />
                    </>
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
                    />
                )}
            </main>
        </div>
    );
}