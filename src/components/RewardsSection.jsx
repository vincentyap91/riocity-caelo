import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Check,
    ChevronDown,
    Clock,
    Coins,
    History,
    Lock,
    Trophy,
    Wallet,
} from 'lucide-react';
import RewardsActivityRecordModal from './RewardsActivityRecordModal';
import HorizontalScrollTabRow, { scrollTabIntoViewSmooth } from './HorizontalScrollTabRow';
import { REWARDS_ACTIVITY_RECORD_TYPES, REWARDS_PROGRAM_IDS, REWARDS_PROGRAMS } from '../constants/rewardsPrograms';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

/** Demo main wallet balance (Spin / Voucher / Prize rewards area — hidden on Daily Bonus) */
const REWARDS_WALLET_BALANCE = '201.00';

const REWARDS_RECORD_COLUMNS = [
    { key: 'time', label: 'Time', align: 'left' },
    { key: 'type', label: 'Type', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
];

const ACTIVITY_PROGRAM_IDS = new Set(REWARDS_ACTIVITY_RECORD_TYPES.map((p) => p.id));

const DAILY_CHECKIN_TOTAL_DAYS = 31;
const DAILY_CHECKIN_CURRENT_DAY = 8;

function rewardForDay(day) {
    if (day === 31) return 'MYR 150';
    if (day === 28) return 'MYR 80';
    if (day === 21) return 'MYR 50';
    if (day === 14) return 'MYR 30';
    if (day === 7) return 'MYR 25';
    if (day % 7 === 0) return 'MYR 20';
    if (day % 5 === 0) return 'MYR 10';
    return 'MYR 5';
}

function buildDailyCheckinDays(total = DAILY_CHECKIN_TOTAL_DAYS, currentDay = DAILY_CHECKIN_CURRENT_DAY) {
    return Array.from({ length: total }, (_, i) => {
        const day = i + 1;
        let status = 'locked';
        if (day < currentDay) status = 'claimed';
        else if (day === currentDay) status = 'claimable';
        return {
            id: `d${day}`,
            day,
            label: `Day ${day}`,
            reward: rewardForDay(day),
            status,
        };
    });
}

const DAILY_CHECKIN_DAYS = buildDailyCheckinDays();

const VOUCHERS = [
    { id: 'v1', title: 'Scratch RM 5', value: '5' },
    { id: 'v2', title: 'Scratch RM 28', value: '28' },
    { id: 'v3', title: 'Scratch RM 150', value: '150' },
];

const SPIN_OFFERS = [
    { id: 'sp1', title: 'Daily free spin', value: '5', blurb: '1 free spin per day \u00B7 MYR credits to wallet' },
    { id: 'sp2', title: 'Lucky wheel', value: '88', blurb: 'Boosted segments during live promos' },
    { id: 'sp3', title: 'Mega spin', value: '500', blurb: 'VIP eligible \u00B7 rollover may apply' },
];

const PRIZE_ITEMS = [
    {
        id: '4551',
        campaign: 'VW Shiro Test',
        expires: 'No Expiry',
        available: false,
        amount: '50',
    },
    {
        id: '4552',
        campaign: 'Weekend Boost',
        expires: 'Expires in 3d',
        available: false,
        amount: '120',
    },
];

function parseRewardsProgramFromLocation() {
    if (typeof window === 'undefined') return 'daily-bonus';
    if (window.location.pathname !== '/loyalty-rewards') return 'daily-bonus';
    const h = window.location.hash.slice(1);
    return REWARDS_PROGRAM_IDS.includes(h) ? h : 'daily-bonus';
}

function useRewardsProgramFromHash() {
    const [program, setProgram] = useState(parseRewardsProgramFromLocation);
    useEffect(() => {
        const sync = () => setProgram(parseRewardsProgramFromLocation());
        window.addEventListener('hashchange', sync);
        window.addEventListener('popstate', sync);
        return () => {
            window.removeEventListener('hashchange', sync);
            window.removeEventListener('popstate', sync);
        };
    }, []);
    return program;
}

function TermsBlock({ title, subtitle, children }) {
    return (
        <div className="mt-8 border-t border-[var(--color-border-default)] pt-6">
            <h3 className="text-base font-bold text-[var(--color-text-strong)]">{title}</h3>
            {subtitle && (
                <p className="mt-1 text-sm font-semibold text-[var(--color-accent-700)] underline decoration-[var(--color-accent-200)] underline-offset-2">
                    {subtitle}
                </p>
            )}
            <div className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">{children}</div>
        </div>
    );
}

/** Shared “scratch voucher” visual: neon gradient hero, scan lines, corner badge, footer CTA */
function ScratchStyleRewardCard({
    badge,
    heroCenter,
    metaTopLeft,
    metaTopRight,
    title,
    description,
    ctaLabel,
    ctaDisabled = false,
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] shadow-sm transition hover:border-[var(--color-accent-200)]">
            <div className="relative aspect-[16/10] bg-[linear-gradient(145deg,rgb(15_23_42)_0%,rgb(30_58_138)_50%,rgb(59_130_246)_100%)]">
                {metaTopLeft ? (
                    <div className="absolute left-2 top-2 z-10 max-w-[58%]">{metaTopLeft}</div>
                ) : null}
                {metaTopRight ? (
                    <div className="absolute right-2 top-2 z-10 max-w-[58%] text-right">{metaTopRight}</div>
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">{heroCenter}</div>
                <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgb(255_255_255_/_0.06)_2px,rgb(255_255_255_/_0.06)_4px)] opacity-80" />
                <span className="absolute bottom-2 left-2 z-10 rounded bg-black/40 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                    {badge}
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="font-bold text-[var(--color-text-strong)]">{title}</p>
                {description ? (
                    <p className="text-xs font-medium text-[var(--color-text-muted)]">{description}</p>
                ) : null}
                <button
                    type="button"
                    disabled={ctaDisabled}
                    className="mt-auto w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-2.5 text-sm font-bold text-[var(--color-text-strong)] transition hover:bg-[var(--color-accent-50)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
}

function RewardsWalletBar({ balance, onRecordClick }) {
    return (
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-5 shadow-[var(--shadow-card-soft)] md:p-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)] shadow-[var(--shadow-cta-soft)] ring-1 ring-[var(--color-cta-border)]/60">
                    <Wallet className="h-6 w-6" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-main)]">Wallet Balance:</p>
                    <p className="mt-0.5 text-xl font-bold leading-tight text-[var(--color-accent-600)] md:text-2xl tabular-nums">{balance}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onRecordClick}
                className="btn-theme-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] sm:min-w-[148px]"
            >
                <History size={18} strokeWidth={2.5} className="shrink-0 text-white" aria-hidden />
                Record
            </button>
        </div>
    );
}

function CongratsClaimModal({ open, amount, onClose, autoCloseMs = 3000 }) {
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return undefined;
        const timer = setTimeout(() => onClose?.(), autoCloseMs);
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose, autoCloseMs]);

    if (!open) return null;
    if (typeof document === 'undefined') return null;

    const coinCount = 14;

    const viewportStyle = {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        minHeight: '100vh',
        margin: 0,
    };

    return createPortal(
        <div
            className="z-[240] flex items-center justify-center p-4 sm:p-6"
            style={viewportStyle}
        >
            <button
                type="button"
                aria-label="Close congratulations"
                onClick={onClose}
                className="bg-[var(--color-nav-overlay)] backdrop-blur-[2px]"
                style={{ ...viewportStyle, zIndex: 0 }}
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Reward claimed"
                className="claim-congrats-pop relative z-[1] flex w-full max-w-[420px] flex-col items-center overflow-hidden rounded-[22px] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-6 py-7 text-center shadow-[var(--shadow-modal)] sm:px-8 sm:py-9"
                onClick={(e) => e.stopPropagation()}
            >
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    {Array.from({ length: coinCount }).map((_, i) => (
                        <span
                            key={i}
                            className="claim-coin-fall absolute text-[var(--color-cta-strong-end)]"
                            style={{
                                left: `${(i * (100 / coinCount)).toFixed(2)}%`,
                                animationDelay: `${(i % 5) * 0.18}s`,
                                animationDuration: `${1.6 + (i % 4) * 0.25}s`,
                                opacity: 0.85,
                            }}
                        >
                            <Coins size={i % 3 === 0 ? 20 : 16} strokeWidth={2.25} />
                        </span>
                    ))}
                </div>

                <span
                    className="claim-coin-burst relative z-[1] flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[rgb(15_23_42)] shadow-[0_18px_36px_rgba(255,178,45,0.4)] ring-2 ring-[var(--color-nav-accent)] sm:h-24 sm:w-24"
                    aria-hidden
                >
                    <Coins className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2.25} />
                </span>

                <h2 className="relative z-[1] mt-5 text-lg font-bold tracking-tight text-[var(--color-text-strong)] sm:text-xl">
                    Congratulations!
                </h2>
                <p className="relative z-[1] mt-2 text-2xl font-bold text-[var(--color-cta-strong-end)] sm:text-3xl">
                    You got {amount}
                </p>
                <p className="relative z-[1] mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-[15px]">
                    Come back tomorrow to keep your streak going and unlock a bigger reward.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn-theme-primary relative z-[1] mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl px-6 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                >
                    Awesome
                </button>

                <p className="relative z-[1] mt-2.5 text-[11px] font-medium text-[var(--color-text-soft)]">
                    Auto-closing in {Math.round(autoCloseMs / 1000)} seconds
                </p>
            </section>
        </div>,
        document.body
    );
}

const DailyStreakNode = React.forwardRef(function DailyStreakNode({ day, position }, ref) {
    const isClaimed = day.status === 'claimed';
    const isToday = day.status === 'claimable';

    const circleClass = isClaimed
        ? 'bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-accent-700)_100%)] text-white ring-2 ring-[var(--color-accent-200)] shadow-[var(--shadow-subtle)]'
        : isToday
          ? 'bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[rgb(15_23_42)] ring-2 ring-[var(--color-nav-accent)] shadow-[var(--shadow-cta-soft)]'
          : 'bg-[var(--color-surface-muted)] text-[var(--color-text-soft)] ring-1 ring-[var(--color-border-default)]';

    const labelClass = isToday
        ? 'text-[var(--color-cta-strong-end)]'
        : isClaimed
          ? 'text-[var(--color-accent-700)]'
          : 'text-[var(--color-text-soft)]';

    const rewardClass = isToday || isClaimed
        ? 'text-[rgb(18_63_128)]'
        : 'text-[var(--color-text-soft)]';

    return (
        <div
            ref={ref}
            className="relative flex shrink-0 flex-col items-center gap-1.5"
            aria-current={isToday ? 'step' : undefined}
        >
            <span
                className={`relative flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold transition sm:h-14 sm:w-14 ${circleClass}`}
                aria-hidden
            >
                {isClaimed ? (
                    <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} />
                ) : isToday ? (
                    <Coins className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
                ) : (
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} />
                )}
                {isToday && (
                    <span
                        className="pointer-events-none absolute -inset-1 animate-ping rounded-full ring-2 ring-[var(--color-nav-accent)]/50"
                        aria-hidden
                    />
                )}
            </span>
            <p
                className={`text-center text-[10px] font-bold uppercase tracking-wide sm:text-xs ${labelClass}`}
            >
                {isToday ? 'Today' : day.label}
            </p>
            <p
                className={`text-center text-[10px] font-bold leading-tight sm:text-xs ${rewardClass}`}
            >
                {day.reward}
            </p>
            <span className="sr-only">
                {day.label} · {day.reward} ·{' '}
                {isClaimed ? 'completed' : isToday ? 'available today' : 'upcoming'}
            </span>
            <span className="sr-only">{position}</span>
        </div>
    );
});

function DailyBonusPanel() {
    const [days, setDays] = useState(DAILY_CHECKIN_DAYS);
    const [congratsAmount, setCongratsAmount] = useState(null);
    const scrollerRef = useRef(null);
    const todayRef = useRef(null);
    const streakDays = days.filter((d) => d.status === 'claimed').length;
    const todayIdx = days.findIndex((d) => d.status === 'claimable');
    const todayDay = todayIdx >= 0 ? days[todayIdx] : null;

    useEffect(() => {
        const scroller = scrollerRef.current;
        const node = todayRef.current;
        if (!scroller || !node) return;
        const parentRect = scroller.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const delta = nodeRect.left - parentRect.left - parentRect.width / 2 + nodeRect.width / 2;
        scroller.scrollTo({ left: scroller.scrollLeft + delta, behavior: 'auto' });
    }, []);

    const handleClaimToday = () => {
        if (todayIdx < 0) return;
        const reward = days[todayIdx].reward;
        setDays((prev) =>
            prev.map((d, i) => (i === todayIdx ? { ...d, status: 'claimed' } : d))
        );
        setCongratsAmount(reward);
    };

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[var(--radius-panel-lg)] border border-[var(--color-border-brand)] bg-[var(--color-surface-base)] shadow-[var(--shadow-card-soft)]">
                {/* Light blue header — matches screenshot top block */}
                <div className="bg-[linear-gradient(180deg,var(--color-accent-50)_0%,rgb(219_234_254)_100%)] px-5 py-5 sm:px-6 sm:py-6">
                    <h3 className="text-lg font-bold text-[rgb(18_63_128)] md:text-xl">Daily Check In</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-main)]">
                        You have accumulated{' '}
                        <span className="font-bold text-[var(--color-cta-strong-end)]">Day {streakDays}</span> check-in
                    </p>
                </div>
                {/* Gray-blue info banner + square yellow trophy */}
                <div className="flex flex-wrap items-center gap-4 border-t border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--color-surface-muted)_0%,var(--color-accent-50)_40%)] px-5 py-4 sm:px-6 sm:py-5">
                    <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] shadow-[var(--shadow-subtle)] ring-1 ring-[var(--color-cta-border)]/50"
                        aria-hidden
                    >
                        <Trophy className="h-7 w-7 text-[rgb(15_23_42)]" strokeWidth={2} />
                    </div>
                    <p className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-[var(--color-text-main)]">
                        Claim MYR rewards each day. Some days may require minimum valid turnover on your main wallet.
                    </p>
                </div>
                {/* 31-day horizontal streak */}
                <div className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-base)] pb-4 sm:pb-5">
                    <div
                        ref={scrollerRef}
                        className="overflow-x-auto scroll-smooth px-3 py-1 [-webkit-overflow-scrolling:touch] sm:px-6 sm:py-2"
                    >
                        <ol
                            role="list"
                            aria-label={`${days.length}-day check-in streak`}
                            className="flex flex-nowrap items-start gap-2 pb-3 pt-7 sm:gap-3 sm:pb-4 sm:pt-8"
                        >
                            {days.map((d, idx) => {
                                const isTodayNode = d.status === 'claimable';
                                return (
                                    <React.Fragment key={d.id}>
                                        <li className="flex shrink-0">
                                            <div className="w-14 sm:w-16">
                                                <DailyStreakNode
                                                    ref={isTodayNode ? todayRef : undefined}
                                                    day={d}
                                                    position={`Step ${idx + 1} of ${days.length}`}
                                                />
                                            </div>
                                        </li>
                                        {idx < days.length - 1 && (
                                            <span
                                                aria-hidden
                                                className={`mt-5 h-1 w-6 shrink-0 rounded-full sm:mt-7 sm:w-8 ${
                                                    d.status === 'claimed'
                                                        ? 'bg-[var(--color-accent-400)]'
                                                        : 'bg-[var(--color-border-default)]'
                                                }`}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ol>
                    </div>

                    <div className="mt-2 px-3 sm:px-6">
                        <p className="text-center text-[11px] font-medium text-[var(--color-text-soft)]">
                            Scroll to see all {days.length} days &middot; {streakDays}/{days.length} claimed
                        </p>
                    </div>

                    <div className="px-3 sm:px-6">

                    {todayDay ? (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-control)] border-2 border-[var(--color-nav-accent)] bg-[linear-gradient(180deg,var(--color-accent-50)_0%,var(--color-surface-base)_100%)] px-4 py-3 shadow-[var(--shadow-subtle)] sm:px-5">
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] shadow-[var(--shadow-subtle)] ring-1 ring-[var(--color-cta-border)]/60"
                                    aria-hidden
                                >
                                    <Coins className="h-5 w-5 text-[rgb(15_23_42)]" strokeWidth={2.5} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">
                                        Today&rsquo;s reward
                                    </p>
                                    <p className="truncate text-base font-bold text-[var(--color-text-strong)]">
                                        {todayDay.label} &middot; {todayDay.reward}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClaimToday}
                                className="btn-theme-primary inline-flex h-11 shrink-0 items-center justify-center rounded-[var(--radius-control-xs)] px-6 text-sm font-bold text-white shadow-sm transition hover:brightness-105 active:brightness-95"
                            >
                                Claim now
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-accent-200)] bg-[var(--color-accent-50)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-accent-700)]">
                            All caught up &mdash; see you tomorrow for the next streak day.
                        </div>
                    )}
                    </div>
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Daily Check-In T&C">
                <ol className="list-decimal space-y-2 pl-4">
                    <li>Daily rewards are paid in MYR to your main wallet after you claim.</li>
                    <li>Selected days may require minimum valid turnover before the reward unlocks.</li>
                    <li>Only bets from your main wallet count toward turnover unless stated otherwise.</li>
                    <li>Unclaimed rewards may expire per campaign rules.</li>
                    <li>Claimed amounts may carry a one-time rollover before withdrawal.</li>
                </ol>
            </TermsBlock>

            <CongratsClaimModal
                open={Boolean(congratsAmount)}
                amount={congratsAmount}
                onClose={() => setCongratsAmount(null)}
            />
        </div>
    );
}

function SpinWheelPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-strong)]">Spin offers</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Same scratch-card look — spin for random MYR; prizes credit to your wallet after claim.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SPIN_OFFERS.map((s) => (
                        <ScratchStyleRewardCard
                            key={s.id}
                            badge="Spin"
                            heroCenter={
                                <span className="text-4xl font-bold text-white/90 drop-shadow-lg">
                                    RM {s.value}
                                </span>
                            }
                            title={s.title}
                            description={s.blurb}
                            ctaLabel="Spin now"
                        />
                    ))}
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Spin Wheel T&C">
                <ul className="list-disc space-y-2 pl-4">
                    <li>Spins are tied to your verified account.</li>
                    <li>MYR prizes must be claimed to your main wallet from this area.</li>
                    <li>Bonus winnings may require rollover before withdrawal.</li>
                </ul>
            </TermsBlock>
        </div>
    );
}

function VoucherScratchPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-strong)]">Scratch &amp; redeem</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Reveal vouchers — MYR credit applies to your main wallet when you complete redemption.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {VOUCHERS.map((v) => (
                        <ScratchStyleRewardCard
                            key={v.id}
                            badge="Scratch"
                            heroCenter={
                                <span className="text-4xl font-bold text-white/90 drop-shadow-lg">
                                    RM {v.value}
                                </span>
                            }
                            title={v.title}
                            description={`Win up to MYR ${v.value} \u00B7 Credit to wallet after claim`}
                            ctaLabel="Scratch & claim"
                        />
                    ))}
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Voucher &amp; scratch T&C">
                <ul className="list-disc space-y-2 pl-4">
                    <li>Scratch outcomes pay MYR to your main wallet when claimed.</li>
                    <li>Redemptions are final once confirmed.</li>
                    <li>Rollover may apply before withdrawal.</li>
                </ul>
            </TermsBlock>
        </div>
    );
}

function PrizeBoxPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-strong)]">Your rewards</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Campaign items appear here when available for claim.</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {PRIZE_ITEMS.map((item) => (
                        <ScratchStyleRewardCard
                            key={item.id}
                            badge="Prize"
                            metaTopLeft={
                                <span className="rounded-md bg-black/45 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                    Reward #{item.id}
                                </span>
                            }
                            metaTopRight={
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                    <Clock size={11} className="shrink-0 opacity-90" />
                                    {item.expires}
                                </span>
                            }
                            heroCenter={
                                <span className="text-4xl font-bold text-white/90 drop-shadow-lg">
                                    RM {item.amount}
                                </span>
                            }
                            title={item.campaign}
                            description="Campaign reward \u00B7 MYR credits main wallet when claimed"
                            ctaLabel={item.available ? 'Claim to wallet' : 'Unavailable'}
                            ctaDisabled={!item.available}
                        />
                    ))}
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Prize Box T&C">
                <ul className="list-disc space-y-2 pl-4">
                    <li>Rewards follow campaign rules; MYR credits the main wallet when claimed.</li>
                    <li>Expiry dates apply per item.</li>
                    <li>Rollover may apply before withdrawal.</li>
                </ul>
            </TermsBlock>
        </div>
    );
}

export default function RewardsSection({ embedInPage = false }) {
    const programTabRefs = useRef({});
    const activeProgram = useRewardsProgramFromHash();
    const [recordModalOpen, setRecordModalOpen] = useState(false);
    const [recordActivityType, setRecordActivityType] = useState('spin-wheel');

    const setProgramHash = (id) => {
        if (typeof window === 'undefined') return;
        window.location.hash = id;
    };

    useEffect(() => {
        if (activeProgram === 'daily-bonus') {
            setRecordModalOpen(false);
        }
    }, [activeProgram]);

    useEffect(() => {
        if (recordModalOpen && ACTIVITY_PROGRAM_IDS.has(activeProgram)) {
            setRecordActivityType(activeProgram);
        }
    }, [recordModalOpen, activeProgram]);

    const openRecordModal = () => {
        if (ACTIVITY_PROGRAM_IDS.has(activeProgram)) {
            setRecordActivityType(activeProgram);
        } else {
            setRecordActivityType('spin-wheel');
        }
        setRecordModalOpen(true);
    };

    const showWalletBar = activeProgram !== 'daily-bonus';

    const recordTypeLabel = REWARDS_ACTIVITY_RECORD_TYPES.find((t) => t.id === recordActivityType)?.label ?? '';

    const recordTypeFilterSlot = (
        <label className="block w-full">
            <span className="mb-2 block text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Type</span>
            <div className="relative">
                <select
                    value={recordActivityType}
                    onChange={(e) => setRecordActivityType(e.target.value)}
                    aria-label="Record type"
                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] pl-4 pr-10 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none transition focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                >
                    {REWARDS_ACTIVITY_RECORD_TYPES.map(({ id, label }) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-600)]"
                    aria-hidden
                />
            </div>
        </label>
    );

    return (
        <>
        <section id="loyalty-rewards" className="surface-card rounded-2xl p-6 transition-all md:p-8">
            {!embedInPage && (
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                            <Trophy size={22} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">
                                Rewards
                            </h2>
                            <p className="mt-1 text-xs font-medium leading-snug text-[var(--color-text-muted)] md:text-sm">
                                Check in, spin, scratch, and open prizes — claim MYR to your wallet.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {embedInPage && (
                <>
                    <div className="mb-6 md:hidden">
                        <label htmlFor="rewards-program-select" className="block">
                            <span className="mb-2 block text-sm font-semibold text-[var(--color-text-strong)]">
                                Program
                            </span>
                            <div className="relative">
                                <select
                                    id="rewards-program-select"
                                    value={activeProgram}
                                    onChange={(e) => setProgramHash(e.target.value)}
                                    aria-label="Rewards programme"
                                    className="h-11 w-full cursor-pointer appearance-none rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] pl-4 pr-10 text-sm font-semibold text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none transition focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                >
                                    {REWARDS_PROGRAMS.map(({ id, label }) => (
                                        <option key={id} value={id}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={18}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-600)]"
                                    aria-hidden
                                />
                            </div>
                        </label>
                    </div>

                    <HorizontalScrollTabRow
                        className="mb-6 hidden md:block lg:hidden"
                        wrapBreakpoint="lg"
                        innerListProps={{ role: 'tablist', 'aria-label': 'Rewards programmes' }}
                    >
                        {REWARDS_PROGRAMS.map(({ id, label }) => {
                            const selected = activeProgram === id;
                            return (
                                <button
                                    key={id}
                                    ref={(el) => {
                                        if (el) programTabRefs.current[id] = el;
                                        else delete programTabRefs.current[id];
                                    }}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => {
                                        setProgramHash(id);
                                        scrollTabIntoViewSmooth(programTabRefs.current[id]);
                                    }}
                                    className={`max-lg:snap-start min-h-[44px] shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                                        selected
                                            ? 'border-[var(--color-accent-300)] bg-[var(--color-accent-50)] text-[var(--color-accent-800)] shadow-sm ring-1 ring-[var(--color-accent-100)]'
                                            : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:text-[var(--color-text-strong)]'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </HorizontalScrollTabRow>
                </>
            )}

            {showWalletBar && (
                <div className={`${embedInPage ? 'mt-0' : 'mt-6'} mb-6`}>
                    <RewardsWalletBar balance={REWARDS_WALLET_BALANCE} onRecordClick={openRecordModal} />
                </div>
            )}

            <div className="space-y-6">
                {activeProgram === 'daily-bonus' && <DailyBonusPanel />}
                {activeProgram === 'spin-wheel' && <SpinWheelPanel />}
                {activeProgram === 'voucher-scratch' && <VoucherScratchPanel />}
                {activeProgram === 'prize-box' && <PrizeBoxPanel />}
            </div>
        </section>

        <RewardsActivityRecordModal
            open={recordModalOpen}
            onClose={() => setRecordModalOpen(false)}
            filterSlot={recordTypeFilterSlot}
            columns={REWARDS_RECORD_COLUMNS}
            recordContextKey={recordActivityType}
            tableEmptyMessage={recordTypeLabel ? `No data found for ${recordTypeLabel}` : 'No data found'}
        />
        </>
    );
}


