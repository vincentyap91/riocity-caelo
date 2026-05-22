import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, CircleCheckBig, ShieldAlert } from 'lucide-react';
import {
    DEMO_ROLLOVER_STATUS,
    formatRolloverAmount,
    getRolloverProgressPercent,
} from '../constants/rolloverStatus';
import ProgressBar from './ui/ProgressBar';

function Metric({ label, value, dark = false }) {
    return (
        <div className={`rounded-xl px-3 py-2 ${dark ? 'bg-white/[0.05]' : 'bg-[var(--color-surface-muted)]/90'}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-white/55' : 'text-[var(--color-text-soft)]'}`}>
                {label}
            </p>
            <p className={`mt-1 text-sm font-bold tabular-nums ${dark ? 'text-white' : 'text-[var(--color-text-strong)]'}`}>
                {formatRolloverAmount(value)}
            </p>
        </div>
    );
}

function SupportRequestRow({ eligible, dark = false, onRequestSupport }) {
    return (
        <div className={`flex flex-col gap-2 rounded-xl border px-3 py-3 sm:flex-row sm:items-center sm:justify-between ${
            dark
                ? 'border-white/10 bg-white/[0.04]'
                : 'border-[var(--color-border-default)] bg-white/70'
        }`}>
            <div className="min-w-0">
                <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-[var(--color-text-strong)]'}`}>
                    Clear Deposit Rollover
                </p>
                <p className={`mt-1 text-xs leading-snug ${dark ? 'text-white/65' : 'text-[var(--color-text-muted)]'}`}>
                    Need help? Ask customer service to clear this rollover.
                </p>
            </div>
            <button
                type="button"
                onClick={() => onRequestSupport?.()}
                className={`inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-lg px-3 py-2 text-xs font-bold transition ${
                    dark
                        ? 'bg-[var(--color-nav-text-accent)] text-[var(--color-nav-surface)] hover:brightness-105'
                        : 'bg-[var(--color-accent-600)] text-white hover:bg-[var(--color-accent-700)]'
                }`}
            >
                Contact Support
            </button>
        </div>
    );
}

export default function RolloverStatusCard({
    status = DEMO_ROLLOVER_STATUS,
    variant = 'detail',
    onClick,
    onRequestSupport,
}) {
    const percent = getRolloverProgressPercent(status);
    const isComplete = Boolean(status?.requirementMet) || Number(status?.remainingAmount) <= 0;
    const title = status?.title || 'Deposit Rollover';
    const badgeLabel = isComplete ? 'Completed' : 'In Progress';
    const targetAmount = Number(status?.targetAmount) || 0;
    const completedAmount = Number(status?.completedAmount) || 0;
    const canRequestClear = Boolean(status?.canRequestClear ?? (targetAmount > 0 && completedAmount >= targetAmount && !status?.requirementMet));
    const [detailsOpen, setDetailsOpen] = useState(false);

    if (variant === 'compact-dark') {
        const compactContent = (
            <>
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-nav-text-accent)]">
                            Rollover Summary
                        </p>
                        <p className="mt-1 truncate text-base font-bold text-white">{title}</p>
                    </div>
                    <p className="shrink-0 text-xs font-bold text-[rgb(255_240_160)]">{Math.round(percent)}%</p>
                </div>

                <div className="mt-2">
                    <ProgressBar percent={percent} variant="dark" />
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-xs text-white/70">
                        {isComplete ? 'Withdrawal is available.' : `Remaining ${formatRolloverAmount(status?.remainingAmount)} to unlock withdrawal.`}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setDetailsOpen((open) => !open);
                            }}
                            className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-xs font-bold text-[var(--color-nav-text-accent)] transition hover:text-white"
                            aria-expanded={detailsOpen}
                        >
                            Details
                            <ChevronDown size={12} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {onClick ? (
                            <button
                                type="button"
                                onClick={onClick}
                                className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-xs font-bold text-white/75 transition hover:text-white"
                            >
                                Cashier
                                <ChevronRight size={12} />
                            </button>
                        ) : null}
                    </div>
                </div>

                {detailsOpen && (
                    <div className="mt-2 space-y-2 border-t border-white/10 pt-2">
                        <div className="grid grid-cols-3 gap-2">
                            <Metric label="Target" value={status?.targetAmount} dark />
                            <Metric label="Done" value={status?.completedAmount} dark />
                            <Metric label="Left" value={status?.remainingAmount} dark />
                        </div>
                        <SupportRequestRow eligible={canRequestClear} dark onRequestSupport={onRequestSupport} />
                    </div>
                )}
            </>
        );

        return (
            <div className="dark-nav-tile mt-2.5 w-full rounded-[18px] p-2.5 text-left">
                {compactContent}
            </div>
        );
    }

    if (variant === 'warning') {
        return (
            <div className="surface-card overflow-hidden rounded-2xl border-[#f3d28b] bg-[linear-gradient(180deg,rgba(255,247,219,0.98)_0%,rgba(255,255,255,0.98)_100%)] shadow-[var(--shadow-card-soft)]">
                <div className="flex flex-col gap-3 p-4 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.95fr)_auto] md:items-center md:gap-5 md:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#fff1cc] text-[#b7791f] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
                            <AlertTriangle size={17} />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold leading-tight text-[var(--color-text-strong)] md:text-base">
                                    {title}
                                </h2>
                                <span className="inline-flex items-center rounded-full bg-[#fff1cc] px-2 py-0.5 text-xs font-bold text-[#b7791f]">
                                    {badgeLabel}
                                </span>
                            </div>
                            <p className="max-w-[34ch] text-sm leading-snug text-[var(--color-text-main)] md:text-sm">
                                Complete deposit rollover to enable withdrawal.
                            </p>
                        </div>
                    </div>

                    <div className="min-w-0 md:self-center">
                        <ProgressBar percent={percent} />
                    </div>

                    <div className="flex items-center justify-between gap-3 md:min-w-[210px] md:justify-end md:gap-4">
                        <div className="rounded-xl bg-white/55 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] md:text-right">
                            <p className="text-sm font-bold leading-none text-[var(--color-text-strong)]">{Math.round(percent)}% completed</p>
                            <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">{formatRolloverAmount(status?.remainingAmount)} remaining</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDetailsOpen((open) => !open)}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[var(--color-accent-700)] transition hover:bg-white/40 hover:text-[var(--color-accent-600)]"
                            aria-expanded={detailsOpen}
                        >
                            {detailsOpen ? 'Hide Details' : 'View Details'}
                            <ChevronDown size={14} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {detailsOpen && (
                    <div className="border-t border-[#f3d28b] bg-[rgba(255,255,255,0.45)] px-4 py-3 md:px-5">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                <Metric label="Target amount" value={status?.targetAmount} />
                                <Metric label="Completed amount" value={status?.completedAmount} />
                                <Metric label="Remaining amount" value={status?.remainingAmount} />
                            </div>
                            <SupportRequestRow eligible={canRequestClear} onRequestSupport={onRequestSupport} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'summary-inline') {
        return (
            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="flex flex-col gap-3 p-4 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.95fr)_auto] md:items-center md:gap-5 md:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.38)] ${
                            isComplete
                                ? 'bg-[color-mix(in_srgb,var(--color-success-main)_12%,white)] text-[var(--color-success-main)]'
                                : 'bg-[color-mix(in_srgb,var(--color-accent-600)_10%,white)] text-[var(--color-accent-600)]'
                        }`}>
                            {isComplete ? <CircleCheckBig size={17} /> : <ShieldAlert size={17} />}
                        </div>
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-base font-bold leading-tight text-[var(--color-text-strong)]">
                                    {title}
                                </p>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                                    isComplete
                                        ? 'bg-[color-mix(in_srgb,var(--color-success-main)_12%,white)] text-[var(--color-success-main)]'
                                        : 'bg-[color-mix(in_srgb,var(--color-accent-600)_10%,white)] text-[var(--color-accent-700)]'
                                }`}>
                                    {badgeLabel}
                                </span>
                            </div>
                            <p className="max-w-[34ch] text-sm leading-snug text-[var(--color-text-main)] md:text-sm">
                                Complete rollover before withdrawal
                            </p>
                        </div>
                    </div>

                    <div className="min-w-0 md:self-center">
                        <ProgressBar percent={percent} />
                    </div>

                    <div className="flex items-center justify-between gap-3 md:min-w-[210px] md:justify-end md:gap-4">
                        <div className="rounded-xl bg-white/55 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] md:text-right">
                            <p className="text-sm font-bold leading-none text-[var(--color-text-strong)]">{Math.round(percent)}% completed</p>
                            <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">{formatRolloverAmount(status?.remainingAmount)} remaining</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDetailsOpen((open) => !open)}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[var(--color-accent-700)] transition hover:bg-white/40 hover:text-[var(--color-accent-600)]"
                            aria-expanded={detailsOpen}
                        >
                            {detailsOpen ? 'Hide Details' : 'View Details'}
                            <ChevronDown size={14} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {detailsOpen && (
                    <div className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]/80 px-4 py-4 md:px-5">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <Metric label="Target amount" value={status?.targetAmount} />
                                <Metric label="Completed amount" value={status?.completedAmount} />
                                <Metric label="Remaining amount" value={status?.remainingAmount} />
                            </div>
                            <SupportRequestRow eligible={canRequestClear} onRequestSupport={onRequestSupport} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
            <div className="border-b border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-soft-panel-end)_100%)] px-5 py-4 md:px-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            isComplete
                                ? 'bg-[color-mix(in_srgb,var(--color-success-main)_12%,white)] text-[var(--color-success-main)]'
                                : 'bg-[color-mix(in_srgb,var(--color-accent-600)_10%,white)] text-[var(--color-accent-600)]'
                        }`}>
                            {isComplete ? <CircleCheckBig size={20} /> : <ShieldAlert size={20} />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-700)]">
                                Wallet / Cashier
                            </p>
                            <h2 className="mt-1 text-lg font-bold text-[var(--color-text-strong)]">{title}</h2>
                            <p className="mt-1 text-sm text-[var(--color-text-main)]">
                                {isComplete
                                    ? 'Your rollover is complete and withdrawal is available.'
                                    : 'Track your progress here before making a withdrawal.'}
                            </p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        isComplete
                            ? 'bg-[color-mix(in_srgb,var(--color-success-main)_14%,white)] text-[var(--color-success-main)]'
                            : 'bg-[color-mix(in_srgb,var(--color-accent-600)_10%,white)] text-[var(--color-accent-700)]'
                    }`}>
                        {badgeLabel}
                    </span>
                </div>
            </div>

            <div className="space-y-4 p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                            {Math.round(percent)}% completed
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Latest qualifying amount: {formatRolloverAmount(status?.latestQualifiedAmount)}{status?.updatedAt ? ` | Updated ${status.updatedAt}` : ''}
                        </p>
                    </div>
                    <p className="text-right text-sm font-semibold text-[var(--color-text-main)]">
                        {isComplete
                            ? 'No remaining rollover.'
                            : `${formatRolloverAmount(status?.remainingAmount)} remaining`}
                    </p>
                </div>

                <ProgressBar percent={percent} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Metric label="Target amount" value={status?.targetAmount} />
                    <Metric label="Completed amount" value={status?.completedAmount} />
                    <Metric label="Remaining amount" value={status?.remainingAmount} />
                </div>
            </div>
        </div>
    );
}

