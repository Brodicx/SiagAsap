export default function SiteFooter() {
    return (
        <footer className="mt-12 border-t border-line bg-surface">
            <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 text-sm text-muted md:grid-cols-[1.2fr_1fr] md:px-6">
                <div>
                    <p className="text-base font-semibold text-ink">SiagAsap</p>
                    <p className="mt-1 max-w-md">Informasi kualitas udara, pelaporan titik api, rumah sakit, dan posko medis untuk penanganan kebakaran hutan dan lahan.</p>
                </div>
                <div>
                    <p className="font-semibold text-ink">Sumber dan batasan data</p>
                    <p className="mt-1">Estimasi ISPU dihitung dari PM2.5 data model Open-Meteo dan bukan data resmi KLHK atau BMKG. Untuk keputusan darurat, ikuti arahan BPBD setempat.</p>
                </div>
            </div>
        </footer>
    );
}
