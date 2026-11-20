import { Loader2, SearchX, CircleAlert, Clock } from 'lucide-react';
import { ISPU_LEVELS, ispuMeta, scalePosition } from '../utils/ispu';

export function StatusBadge({ kategori }) {
    const m = ispuMeta(kategori);
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold ${m.badge}`}>
            <m.Icon size={16} aria-hidden="true" />
            {m.label}
        </span>
    );
}

export function AqiScale({ value, kategori }) {
    const m = ispuMeta(kategori);
    return (
        <div role="img" aria-label={`Estimasi ISPU ${value}, kategori ${m.label}`} className="relative flex h-2 w-full gap-0.5">
            {ISPU_LEVELS.map((l) => <span key={l.key} className={`flex-1 rounded-[2px] ${l.bar}`} />)}
            <span className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-sm bg-ink ring-2 ring-white" style={{ left: `${scalePosition(value)}%` }} />
        </div>
    );
}

export function SourceMeta({ fetchedAt, className = '' }) {
    return (
        <p className={`flex items-start gap-2 text-sm text-muted ${className}`}>
            <Clock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
                Estimasi ISPU dihitung dari PM2.5 pada data model Open-Meteo, bukan pengukuran stasiun atau citra satelit langsung.
                {fetchedAt && <> Dimuat pukul {fetchedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}.</>}
            </span>
        </p>
    );
}

const STATE_ICON = { loading: Loader2, empty: SearchX, error: CircleAlert };

export function StateMessage({ kind = 'empty', title, children, action }) {
    const Icon = STATE_ICON[kind];
    return (
        <div role={kind === 'error' ? 'alert' : 'status'} className="flex items-start gap-3 p-4 text-sm">
            <Icon size={20} className={`mt-0.5 shrink-0 ${kind === 'loading' ? 'animate-spin text-muted' : kind === 'error' ? 'text-danger' : 'text-muted'}`} aria-hidden="true" />
            <div>
                <p className="font-semibold text-ink">{title}</p>
                {children && <p className="mt-0.5 text-muted">{children}</p>}
                {action && <div className="mt-3">{action}</div>}
            </div>
        </div>
    );
}
