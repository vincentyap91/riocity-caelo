import React, { useState } from 'react';
import { Star } from 'lucide-react';
import CalendarDateInput from './CalendarDateInput';
import SegmentedTabs from './ui/SegmentedTabs';

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const REBATE_TABS = [
    { id: 'unclaim', label: 'Unclaim' },
    { id: 'history', label: 'History' },
    { id: 'benefit', label: 'Rebate Benefit' },
];

const BENEFIT_CATEGORY_TABS = [
    { id: 'all', label: 'All' },
    { id: 'slots', label: 'Slots' },
    { id: 'casino', label: 'Casino' },
    { id: 'sports', label: 'Sports' },
    { id: 'fishing', label: 'Fishing' },
    { id: 'rng', label: 'RNG' },
    { id: 'lottery', label: 'Lottery' },
];

const REBATE_BENEFIT_ROWS = [
    { provider: 'JDB', category: 'Slots', rebate: '1.30%' },
    { provider: 'Joker', category: 'Slots', rebate: '1.30%' },
    { provider: 'Pragmatic Play', category: 'Slots', rebate: '1.30%' },
    { provider: 'Funky Games', category: 'Slots', rebate: '1.20%' },
    { provider: 'AFB Slot', category: 'Slots', rebate: '1.20%' },
    { provider: 'SBO Sports', category: 'Sports', rebate: '1.10%' },
    { provider: 'SABA Sports', category: 'Sports', rebate: '1.10%' },
    { provider: 'Evo888SG', category: 'Slots', rebate: '0.90%' },
    { provider: 'SimplePlay', category: 'Slots', rebate: '0.90%' },
    { provider: 'Yggdrasil', category: 'Slots', rebate: '0.90%' },
    { provider: 'Microgaming', category: 'Slots', rebate: '0.90%' },
    { provider: 'IA Gaming', category: 'Slots', rebate: '0.90%' },
    { provider: 'JDB Fishing', category: 'Fishing', rebate: '0.90%' },
    { provider: 'JILI RNG', category: 'RNG', rebate: '0.90%' },
    { provider: 'Pragmatic Play Live Casino', category: 'Casino', rebate: '0.75%' },
    { provider: 'Sexy Gaming', category: 'Casino', rebate: '0.75%' },
    { provider: 'Evolution Gaming', category: 'Casino', rebate: '0.70%' },
    { provider: 'Big Gaming', category: 'Casino', rebate: '0.70%' },
    { provider: 'Playtech LiveCasino', category: 'Casino', rebate: '0.50%' },
    { provider: 'Lottery Provider', category: 'Lottery', rebate: '0.80%' },
];

const HISTORY_QUICK_RANGES = [
    { id: 'today', label: 'Today' },
    { id: '3days', label: 'In 3 days' },
    { id: 'week', label: 'In a week' },
    { id: 'month', label: 'In a month' },
];

const claimButtonClass =
    'btn-theme-primary inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] md:min-h-11 md:w-auto md:min-w-[120px]';

const tableHeadClassLeft =
    'px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] sm:px-4 sm:py-3 md:text-[var(--color-text-muted)]';
const tableHeadClassRight =
    'px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] sm:px-4 sm:py-3 md:text-[var(--color-text-muted)]';

function RebateEarnedSummary() {
    return (
        <div className="flex items-center gap-3 sm:gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)] sm:h-12 sm:w-12">
                <Star className="h-[22px] w-[22px] sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-snug text-[var(--color-text-muted)] sm:text-sm">Total Rebate Earned</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-[var(--color-accent-600)] sm:text-xl md:text-2xl">MYR 0.000</p>
            </div>
        </div>
    );
}

function EmptyTableNotice({ message, hint, colSpan = 2 }) {
    return (
        <td colSpan={colSpan} className="px-4 py-10 md:py-12">
            <div className="mx-auto flex max-w-[20rem] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-muted)]/50 px-4 py-6">
                <p className="text-center text-sm font-semibold text-[var(--color-text-strong)]">{message}</p>
                {hint ? <p className="mt-1 text-center text-xs leading-relaxed text-[var(--color-text-muted)]">{hint}</p> : null}
            </div>
        </td>
    );
}

function GuestLoginCard({ onLoginClick }) {
    return (
        <div className="surface-card rounded-2xl p-4 shadow-[var(--shadow-card-soft)] sm:p-5 md:p-6">
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl bg-[linear-gradient(180deg,var(--color-surface-subtle)_0%,var(--color-surface-muted)_100%)] border border-[var(--color-border-default)] px-4 py-8 shadow-inner md:min-h-[240px]">
                <p className="mb-6 text-center text-lg font-bold text-[var(--color-text-strong)] sm:text-xl">
                    Log In to View Your Rebate Info
                </p>
                <button
                    type="button"
                    onClick={onLoginClick}
                    className="btn-theme-cta-soft inline-flex min-h-[44px] w-[200px] items-center justify-center rounded-xl px-8 text-sm font-bold shadow-sm transition hover:scale-[1.02] md:min-h-[48px] md:text-base"
                >
                    Login Now!
                </button>
            </div>
        </div>
    );
}

export default function RebatePage({ authUser, onLoginClick, guestLayout }) {
    const [activeTab, setActiveTab] = useState('unclaim');
    const [benefitCategory, setBenefitCategory] = useState('all');
    const today = new Date();
    const [historyStart, setHistoryStart] = useState(formatDateForInput(today));
    const [historyEnd, setHistoryEnd] = useState(formatDateForInput(new Date(today.getTime() + 86400000)));
    const [historyQuickRange, setHistoryQuickRange] = useState('today');

    const setHistoryRangeFromQuick = (id) => {
        setHistoryQuickRange(id);
        const end = new Date();
        let start = new Date();
        if (id === 'today') {
            start = new Date(end);
        } else if (id === '3days') {
            start.setDate(start.getDate() - 2);
        } else if (id === 'week') {
            start.setDate(start.getDate() - 6);
        } else if (id === 'month') {
            start.setDate(start.getDate() - 29);
        }
        setHistoryStart(formatDateForInput(start));
        setHistoryEnd(formatDateForInput(end));
    };

    return (
        <div className={guestLayout ? "page-container pt-0" : "page-container"}>
            <h1 className="page-title mb-5 md:mb-8">Our Rebate System</h1>

            <div className="mb-5 md:mb-8">
                <SegmentedTabs activeTab={activeTab} onChange={setActiveTab} items={REBATE_TABS} value={activeTab} />
            </div>

            <div className="space-y-4 md:space-y-6">
                {activeTab === 'unclaim' && (
                    !authUser ? (
                        <GuestLoginCard onLoginClick={onLoginClick} />
                    ) : (
                    <>
                        <div className="surface-card rounded-2xl p-4 shadow-[var(--shadow-card-soft)] sm:p-5 md:p-6">
                            <div className="flex flex-col gap-3 md:hidden">
                                <RebateEarnedSummary />
                                <button type="button" className={claimButtonClass}>
                                    Claim
                                </button>
                            </div>
                            <div className="hidden items-center justify-between gap-4 md:flex">
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)]">
                                        <Star size={24} strokeWidth={2} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--color-text-muted)]">Total Rebate Earned</p>
                                        <p className="mt-1 text-xl font-bold text-[var(--color-accent-600)] md:text-2xl">MYR 0.000</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-theme-primary inline-flex h-11 min-w-[120px] shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02]"
                                >
                                    Claim
                                </button>
                            </div>
                        </div>

                        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[280px] border-collapse text-sm md:min-w-[320px]">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className={tableHeadClassLeft}>Date</th>
                                            <th className={tableHeadClassRight}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <EmptyTableNotice
                                                message="No data found"
                                                hint="Rebate lines will show here when available."
                                            />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                    )
                )}

                {activeTab === 'history' && (
                    !authUser ? (
                        <GuestLoginCard onLoginClick={onLoginClick} />
                    ) : (
                    <div className="space-y-4 md:space-y-6">
                        <div className="surface-card rounded-2xl p-4 shadow-[var(--shadow-card-soft)] sm:p-5 md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CalendarDateInput
                                    label="Start Claim Date"
                                    value={historyStart}
                                    onChange={(e) => setHistoryStart(e.target.value)}
                                />
                                <CalendarDateInput
                                    label="End Claim Date"
                                    value={historyEnd}
                                    onChange={(e) => setHistoryEnd(e.target.value)}
                                />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {HISTORY_QUICK_RANGES.map(({ id, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setHistoryRangeFromQuick(id)}
                                        className={`min-h-11 min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition sm:min-h-0 sm:px-4 ${
                                            historyQuickRange === id
                                                ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-600)]'
                                                : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="btn-theme-cta inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] sm:min-h-11 sm:w-auto sm:min-w-[120px]"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[280px] border-collapse text-sm md:min-w-[320px]">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className={tableHeadClassLeft}>Claimed Time</th>
                                            <th className={tableHeadClassRight}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <EmptyTableNotice
                                                message="No data found"
                                                hint="Submitted history will appear here after claims are processed."
                                            />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    )
                )}

                {activeTab === 'benefit' && (
                    <div className="space-y-4 md:space-y-6">
                        <SegmentedTabs
                            items={BENEFIT_CATEGORY_TABS}
                            value={benefitCategory}
                            onChange={setBenefitCategory}
                        />
                        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[400px] border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className={tableHeadClassLeft}>Game Provider</th>
                                            <th className={tableHeadClassLeft}>Category</th>
                                            <th className={tableHeadClassRight}>Rebate Benefit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {REBATE_BENEFIT_ROWS.filter(
                                            (row) => benefitCategory === 'all' || row.category.toLowerCase() === benefitCategory.toLowerCase(),
                                        ).map((row) => (
                                            <tr
                                                key={`${row.provider}-${row.category}`}
                                                className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                                            >
                                                <td className="px-3 py-3 text-sm font-medium text-[var(--color-text-strong)] md:px-4 md:py-3.5">
                                                    {row.provider}
                                                </td>
                                                <td className="px-3 py-3 text-sm text-[var(--color-text-muted)] md:px-4 md:py-3.5">{row.category}</td>
                                                <td className="px-3 py-3 text-right text-sm font-semibold text-[var(--color-accent-600)] md:px-4 md:py-3.5">
                                                    {row.rebate}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
