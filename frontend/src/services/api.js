const API_URL = 'http://localhost:3000/api';

export const fetchAllInitialData = async () => {
    const [resIspu, resReports, resPosko, resNews, resTopIspu] = await Promise.all([
        fetch(`${API_URL}/ispu`).then(r => r.json()),
        fetch(`${API_URL}/reports`).then(r => r.json()),
        fetch(`${API_URL}/posko`).then(r => r.json()),
        fetch(`${API_URL}/news`).then(r => r.json()),
        fetch(`${API_URL}/ispu/top`).then(r => r.json())
    ]);

    return {
        ispu: resIspu?.success ? resIspu.data : [],
        reports: resReports?.success ? resReports.data : [],
        posko: resPosko?.success ? resPosko.data : [],
        news: resNews?.success ? resNews.data : [],
        topIspu: resTopIspu?.success ? resTopIspu.data : []
    };
};

export const fetchIspuByCity = (city) => fetch(`${API_URL}/ispu?city=${city}`).then(r => r.json());
export const fetchPoskoByCity = (city) => fetch(`${API_URL}/posko?city=${city}`).then(r => r.json());
export const fetchIspuByCoords = (lat, lng) => fetch(`${API_URL}/ispu?lat=${lat}&lng=${lng}`).then(r => r.json());
export const fetchPoskoByCoords = (lat, lng) => fetch(`${API_URL}/posko?lat=${lat}&lng=${lng}`).then(r => r.json());

export const sendReport = (data) => fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}).then(r => r.json());

export const updateReportStatusApi = (id, newStatus) => fetch(`${API_URL}/reports/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status_penanganan: newStatus })
}).then(r => r.json());

export const deleteReportApi = (id) => fetch(`${API_URL}/reports/${id}`, {
    method: 'DELETE'
}).then(r => r.json());