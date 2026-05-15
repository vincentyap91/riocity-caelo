import React, { useRef, useState } from 'react';
import {
    Copy,
    Check,
    Share2,
    Info,
    ChevronDown,
    ChevronRight,
    Gamepad2,
    Dices,
    Fish,
    Trophy,
    Ticket,
    Swords,
    CircleDollarSign,
    TrendingUp,
    Gift,
    Users,
    Zap,
} from 'lucide-react';
import referralFullBanner from '../assets/referral-full.jpg';
import referralCommissionIcon from '../assets/referral_commission_icon.png';
import referralDepositIcon from '../assets/referral_deposit_icon.png';
import step1Image from '../assets/step1.jpg';
import step2Image from '../assets/step2.jpg';
import step3Image from '../assets/step3.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import { useReferralData } from '../context/ReferralDataContext';
import { REFERRAL_GAME_COMMISSION_ROWS } from '../constants/referralCommissionRates';
import DownlineReferralsPanel from './referral/DownlineReferralsPanel';
import HorizontalScrollTabRow, { scrollTabIntoViewSmooth } from './HorizontalScrollTabRow';
import PromotionStyleTabs from './PromotionStyleTabs';
import ReferralGameCommissionTable from './referral/ReferralGameCommissionTable';

const affiliateTabs = ['Invite Friends', 'My Referrals', 'My Rewards', 'How It Works'];

// Placeholder data – replace with real user data when integrated
const REFERRAL_CODE = '589092';
const REFERRAL_URL = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?code=${REFERRAL_CODE}`;

const depositCommissionTiers = [
    { tier: 'Tier 1', rate: 'PKR 2' },
    { tier: 'Tier 2', rate: '3%' },
    { tier: 'Tier 3', rate: '4%' },
    { tier: 'Tier 4', rate: 'PKR 5' },
    { tier: 'Tier 5', rate: 'PKR 5' },
    { tier: 'Tier 6', rate: '7%' },
];

const gameCommissionItems = [
    { id: 'slots', name: 'Slots', icon: Dices },
    { id: 'live-casino', name: 'Live Casino', icon: CircleDollarSign },
    { id: 'fish-hunt', name: 'Fish Hunt', icon: Fish },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'lottery', name: 'Lottery', icon: Ticket },
    { id: 'all', name: 'All', icon: Gamepad2 },
    { id: 'esport', name: 'ESport', icon: Swords },
    { id: 'poker', name: 'Poker', icon: CircleDollarSign },
    { id: 'crash', name: 'Crash', icon: TrendingUp },
];

const REWARD_HISTORY_FILTERS = [
    { id: 'commission', label: 'Referral Commission Bonus' },
    { id: 'deposit', label: 'Referral Deposit Bonus' },
];

function parseReferralMoney(value) {
    const text = String(value ?? '').trim();
    const match = text.match(/^([A-Za-z]+)\s*([\d,.-]+)/);
    const currency = match?.[1] || 'PKR';
    const amount = Number((match?.[2] || '0').replace(/,/g, ''));

    return {
        currency,
        amount: Number.isFinite(amount) ? amount : 0,
    };
}

function formatReferralMoney(currency, amount) {
    return `${currency} ${Number(amount || 0).toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    })}`;
}

function formatRewardHistoryDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function createRewardSummary(title, totalValue, note, icon) {
    const { currency, amount } = parseReferralMoney(totalValue);

    return {
        title,
        currency,
        today: 0,
        thisMonth: amount,
        totalClaimed: 0,
        unclaimed: amount,
        note,
        icon,
    };
}

function createInitialRewardHistory(currency) {
    return {
        commission: [
            {
                id: 'commission-pending-1',
                date: '18 Mar 2026',
                amount: formatReferralMoney(currency, 12),
                status: 'Unclaimed',
                claimedAt: '-',
            },
            {
                id: 'commission-claimed-1',
                date: '09 Mar 2026',
                amount: formatReferralMoney(currency, 24),
                status: 'Claimed',
                claimedAt: '09 Mar 2026, 11:20',
            },
        ],
        deposit: [
            {
                id: 'deposit-pending-1',
                date: '15 Mar 2026',
                amount: formatReferralMoney(currency, 8),
                status: 'Unclaimed',
                claimedAt: '-',
            },
            {
                id: 'deposit-claimed-1',
                date: '02 Mar 2026',
                amount: formatReferralMoney(currency, 16),
                status: 'Claimed',
                claimedAt: '02 Mar 2026, 09:45',
            },
        ],
    };
}

const tabButtonClasses = (selected) =>
    `inline-flex min-h-[46px] shrink-0 whitespace-nowrap items-center justify-center rounded-t-[var(--radius-control)] border-b-0 border px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-200 sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-xs md:text-sm ${
        selected
            ? 'border-[var(--color-border-brand)] border-b-transparent bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-[var(--shadow-subtle)]'
            : 'border-transparent bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-text-strong)]'
    }`;

function ReferralBenefitPromoCards() {
    const promoCards = [
        {
            title: 'Referral Commission Bonus',
            description: 'Invite friends to receive a commission bonus when your downlines play',
            icon: referralCommissionIcon,
            accent: 'text-[var(--color-accent-600)]',
            surface:
                'bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-blue-panel-end)_100%)]',
            glow: 'before:bg-[radial-gradient(circle_at_left_center,rgb(96_165_250_/_0.14),transparent_62%)]',
            iconShadow: 'drop-shadow-[0_10px_20px_rgb(37_99_235_/_0.12)]',
        },
        {
            title: 'Referral Deposit Bonus',
            description: 'Invite friends to receive a bonus when your downlines make a valid deposit',
            icon: referralDepositIcon,
            accent: 'text-[var(--color-brand-deep)]',
            surface:
                'bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--color-surface-panel)_100%)]',
            glow: 'before:bg-[radial-gradient(circle_at_right_center,rgb(255_207_112_/_0.12),transparent_58%)]',
            iconShadow: 'drop-shadow-[0_10px_20px_rgb(242_154_0_/_0.15)]',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {promoCards.map((card) => (
                <article
                    key={card.title}
                    className={`relative overflow-hidden rounded-[var(--radius-panel-lg)] border border-[var(--color-border-brand)] ${card.surface} p-4 shadow-[var(--shadow-register-card)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] md:p-5`}
                >
                    <div className={`pointer-events-none absolute inset-0 ${card.glow}`} />
                    <div className="relative flex min-h-[130px] items-center gap-3 md:min-h-[144px] md:gap-4">
                        <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center md:h-[80px] md:w-[80px]">
                            <img
                                src={card.icon}
                                alt=""
                                className={`h-full w-full object-contain ${card.iconShadow}`}
                                loading="lazy"
                                draggable={false}
                            />
                        </div>
                        <div className="max-w-[24rem]">
                            <h3 className="text-base font-bold leading-tight tracking-[0.01em] text-[var(--color-text-strong)] md:text-xl">
                                {card.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                                Invite friends to receive{' '}
                                <span className="font-semibold text-[var(--color-text-strong)]">
                                    {card.description.replace('Invite friends to receive ', '')}
                                </span>
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

function ReferralGuestState({ onLoginClick }) {
    return (
        <div className="space-y-4">
            <section className="relative overflow-hidden rounded-[var(--radius-shell)] border border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-page-mid)_45%,var(--gradient-register-page-end)_100%)] px-5 py-7 text-center shadow-[var(--shadow-register-card)] md:px-6 md:py-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgb(96_165_250_/_0.1),transparent_55%)]" />
                <div className="relative mx-auto max-w-[720px]">
                    <h2 className="text-lg font-bold tracking-[0.01em] text-[var(--color-text-strong)] sm:text-xl md:text-2xl">
                        Log In to View Your Unique Referral Info
                    </h2>
                    <p className="mx-auto mt-2.5 max-w-[620px] text-sm leading-relaxed text-[var(--color-text-muted)] md:mt-3">
                        Access your personal referral code, invite link, QR code, and reward tracking after signing in.
                    </p>
                    <button
                        type="button"
                        onClick={onLoginClick}
                        className="btn-theme-cta mt-4 inline-flex min-h-11 min-w-[188px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide shadow-[var(--shadow-cta)] transition hover:-translate-y-0.5 hover:brightness-105 md:min-h-11 md:px-8"
                    >
                        Login Now!
                    </button>
                </div>
            </section>

            <ReferralBenefitPromoCards />
        </div>
    );
}

function InviteFriendsContent({ onSwitchTab, authUser, onLoginClick }) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const { totalCommissionBonus, totalDepositBonus } = useReferralData();

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(REFERRAL_CODE);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch {
            setCopiedCode(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(REFERRAL_URL);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        } catch {
            setCopiedLink(false);
        }
    };

    const handleShare = (type) => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on 12WIN',
                text: `Use my referral code ${REFERRAL_CODE} when you sign up!`,
                url: REFERRAL_URL,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(type === 'code' ? REFERRAL_CODE : REFERRAL_URL);
        }
    };

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(REFERRAL_URL)}`;

    if (!authUser) {
        return <ReferralGuestState onLoginClick={onLoginClick} />;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--color-text-strong)] md:text-2xl">Invite friends now to get more reward</h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                        Invite your friends to join through our referral program! Share your unique code or link and earn rewards as they sign up and engage with our platform.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                <Gift size={16} />
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text-strong)]">Commission on deposits</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                <Users size={16} />
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text-strong)]">Unlimited referrals</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                <Zap size={16} />
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text-strong)]">Earn from game play</span>
                        </div>
                    </div>
                </div>
                <div className="surface-card flex flex-col gap-4 rounded-2xl p-5 shadow-[var(--shadow-card-soft)]">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Total Referral Commission Bonus</span>
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]" title="Commission earned from downline activity">
                                <Info size={12} strokeWidth={2.25} />
                            </span>
                        </div>
                        <p className="mt-1 text-xl font-bold text-[var(--color-cta-text)] md:text-2xl">
                            {totalCommissionBonus}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Total Referral Deposit Bonus</span>
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]" title="Bonus from referred deposits">
                                <Info size={12} strokeWidth={2.25} />
                            </span>
                        </div>
                        <p className="mt-1 text-xl font-bold text-[var(--color-cta-text)] md:text-2xl">
                            {totalDepositBonus}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onSwitchTab?.('My Referrals')}
                        className="btn-theme-cta mt-auto inline-flex min-h-11 items-center justify-center rounded-xl px-6 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                    >
                        Downlines
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                <div className="surface-card flex flex-col rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                    <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Copy My Referral Code</h3>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border-brand)] bg-[var(--color-surface-muted)] px-4 py-3 shadow-[var(--shadow-input)]">
                            <input
                                type="text"
                                value={REFERRAL_CODE}
                                readOnly
                                className="flex-1 bg-transparent text-sm font-mono font-medium text-[var(--color-text-strong)] outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]"
                                aria-label="Copy referral code"
                            >
                                {copiedCode ? <Check size={16} className="text-[var(--color-success-main)]" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleShare('code')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-accent-600)]"
                        >
                            <Share2 size={14} />
                            Share your code
                        </button>
                    </div>
                </div>

                <div className="surface-card flex flex-col rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                    <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Copy My Referral Link</h3>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border-brand)] bg-[var(--color-surface-muted)] px-4 py-3 shadow-[var(--shadow-input)]">
                            <input
                                type="text"
                                value={REFERRAL_URL}
                                readOnly
                                className="min-w-0 flex-1 bg-transparent text-xs font-mono font-medium text-[var(--color-text-strong)] outline-none md:text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control-xs)] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-muted)] transition-colors duration-200 hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]"
                                aria-label="Copy referral link"
                            >
                                {copiedLink ? <Check size={16} className="text-[var(--color-success-main)]" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleShare('link')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-accent-600)]"
                        >
                            <Share2 size={14} />
                            Share your link
                        </button>
                    </div>
                </div>

                <div className="surface-card flex flex-col rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:col-span-2 md:p-6 lg:col-span-1">
                    <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Scan my Referral QR Code</h3>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                        <div className="flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-border-brand)] bg-[var(--color-surface-base)] p-4 shadow-[var(--shadow-subtle)]">
                            <img
                                src={qrCodeUrl}
                                alt="Referral QR Code"
                                className="h-[140px] w-[140px] object-contain md:h-[150px] md:w-[150px]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleShare('qr')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-accent-600)]"
                        >
                            <Share2 size={14} />
                            Share your QR code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MyReferralsContent({ authUser, onLoginClick }) {
    return <DownlineReferralsPanel />;
}

function RewardSummaryCard({ reward, onClaim }) {
    const claimDisabled = reward.unclaimed <= 0;

    return (
        <article className="surface-card rounded-2xl p-4 shadow-[var(--shadow-card-soft)] sm:p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                <div className="flex min-w-0 items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-blue-panel-end)_100%)] p-2.5 shadow-[var(--shadow-subtle)] sm:h-12 sm:w-12">
                        <img
                            src={reward.icon}
                            alt=""
                            className="h-full w-full object-contain"
                            loading="lazy"
                            draggable={false}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold leading-tight text-[var(--color-text-strong)] md:text-lg">
                            {reward.title}
                        </h3>
                        <p className="max-w-[28ch] text-sm leading-6 text-[var(--color-text-muted)] sm:max-w-[32ch] lg:max-w-none">
                            Claim your available referral reward when ready.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClaim}
                    disabled={claimDisabled}
                    className="btn-theme-cta inline-flex min-h-[44px] w-full shrink-0 items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-105 sm:min-h-[42px] sm:w-auto sm:min-w-[118px] md:min-w-[120px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    Claim
                </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5">
                <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3.5 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Today</p>
                    <p className="mt-1.5 text-base font-bold text-[var(--color-text-strong)] sm:text-base md:text-lg">
                        {formatReferralMoney(reward.currency, reward.today)}
                    </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3.5 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">This Month</p>
                    <p className="mt-1.5 text-base font-bold text-[var(--color-text-strong)] sm:text-base md:text-lg">
                        {formatReferralMoney(reward.currency, reward.thisMonth)}
                    </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3.5 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Total Claimed</p>
                    <p className="mt-1.5 text-base font-bold text-[var(--color-text-strong)] sm:text-base md:text-lg">
                        {formatReferralMoney(reward.currency, reward.totalClaimed)}
                    </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3.5 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Unclaimed</p>
                    <p className="mt-1.5 text-base font-bold text-[var(--color-accent-600)] sm:text-base md:text-lg">
                        {formatReferralMoney(reward.currency, reward.unclaimed)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-main)]">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                    <Info size={15} />
                </span>
                <span className="leading-6">{reward.note}</span>
            </div>
        </article>
    );
}

function RewardsLoginRequiredState({ onLoginClick }) {
    return (
        <section className="surface-card rounded-2xl px-5 py-8 text-center shadow-[var(--shadow-card-soft)] md:px-6 md:py-10">
            <div className="mx-auto max-w-[560px]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,var(--gradient-soft-panel-start)_0%,var(--gradient-blue-panel-end)_100%)] text-[var(--color-accent-600)] shadow-[var(--shadow-subtle)]">
                    <Gift size={24} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[var(--color-text-strong)] md:text-2xl">
                    Login Required
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                    Sign in to view your reward balances, claim bonuses, and check reward history.
                </p>
                <button
                    type="button"
                    onClick={onLoginClick}
                    className="btn-theme-cta mt-5 inline-flex min-h-11 min-w-[160px] items-center justify-center rounded-xl px-6 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                >
                    Login Now
                </button>
            </div>
        </section>
    );
}

function rewardStatusClassName(status) {
    if (status === 'Claimed') {
        return 'bg-[color-mix(in_srgb,var(--color-success-main)_12%,white)] text-[var(--color-success-main)]';
    }

    if (status === 'Unclaimed') {
        return 'bg-[color-mix(in_srgb,var(--color-brand-secondary)_16%,white)] text-[var(--color-brand-deep)]';
    }

    return 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]';
}

function RewardHistoryTable({ rows, rewardType }) {
    const amountLabel = rewardType === 'deposit' ? 'Bonus Amount' : 'Commission Amount';

    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-subtle)] text-[var(--color-text-soft)]">
                    <Gift size={24} />
                </span>
                <p className="mt-4 text-base font-semibold text-[var(--color-text-strong)]">No claim records yet</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Claimed referral rewards will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Date</th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{amountLabel}</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Claimed Time</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                        >
                            <td className="px-4 py-3.5 font-medium text-[var(--color-text-strong)]">{row.date}</td>
                            <td className="px-4 py-3.5 text-right font-semibold text-[var(--color-accent-600)]">{row.amount}</td>
                            <td className="px-4 py-3.5 text-center">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${rewardStatusClassName(row.status)}`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className="px-4 py-3.5 text-[var(--color-text-muted)]">{row.claimedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function MyRewardsContent({ authUser, onLoginClick }) {
    const {
        totalCommissionBonus,
        totalDepositBonus,
        setTotalCommissionBonus,
        setTotalDepositBonus,
    } = useReferralData();
    const initialCommissionReward = createRewardSummary(
        'Referral Commission Bonus',
        totalCommissionBonus,
        'Bonus will be credited to Main Wallet.',
        referralCommissionIcon,
    );
    const initialDepositReward = createRewardSummary(
        'Referral Deposit Bonus',
        totalDepositBonus,
        'Bonus will be credited to Bonus Wallet (Coin).',
        referralDepositIcon,
    );
    const [activeHistoryFilter, setActiveHistoryFilter] = useState('commission');
    const [rewardSummaries, setRewardSummaries] = useState(() => ({
        commission: initialCommissionReward,
        deposit: initialDepositReward,
    }));
    const [rewardHistory, setRewardHistory] = useState(() => createInitialRewardHistory(initialDepositReward.currency || initialCommissionReward.currency));

    const handleClaimReward = (rewardId) => {
        const reward = rewardSummaries[rewardId];
        if (!reward || reward.unclaimed <= 0) return;

        const now = new Date();
        const amountLabel = formatReferralMoney(reward.currency, reward.unclaimed);

        setRewardSummaries((prev) => ({
            ...prev,
            [rewardId]: {
                ...prev[rewardId],
                totalClaimed: prev[rewardId].totalClaimed + prev[rewardId].unclaimed,
                unclaimed: 0,
            },
        }));

        setRewardHistory((prev) => ({
            ...prev,
            [rewardId]: [
                {
                    id: `${rewardId}-${now.getTime()}`,
                    date: new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    }).format(now),
                    amount: amountLabel,
                    status: 'Claimed',
                    claimedAt: formatRewardHistoryDate(now),
                },
                ...prev[rewardId],
            ],
        }));

        if (rewardId === 'commission') {
            setTotalCommissionBonus(formatReferralMoney(reward.currency, 0));
        } else {
            setTotalDepositBonus(formatReferralMoney(reward.currency, 0));
        }
    };

    if (!authUser) {
        return <RewardsLoginRequiredState onLoginClick={onLoginClick} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <RewardSummaryCard reward={rewardSummaries.commission} onClaim={() => handleClaimReward('commission')} />
                <RewardSummaryCard reward={rewardSummaries.deposit} onClaim={() => handleClaimReward('deposit')} />
            </div>

            <section className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="border-b border-[var(--color-border-default)] px-5 py-4 md:px-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-strong)] md:text-xl">Reward History</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Review your past referral reward claims by reward type.
                    </p>
                </div>

                <div className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-4 md:px-6">
                    <PromotionStyleTabs
                        items={REWARD_HISTORY_FILTERS}
                        value={activeHistoryFilter}
                        onChange={setActiveHistoryFilter}
                        ariaLabel="Rewards history type"
                        gapClassName="!gap-2"
                    />
                </div>

                <RewardHistoryTable rows={rewardHistory[activeHistoryFilter] ?? []} rewardType={activeHistoryFilter} />
            </section>
        </div>
    );
}

function GameCommissionRow({ item, isOpen, onToggle }) {
    const Icon = item.icon;
    const rows = REFERRAL_GAME_COMMISSION_ROWS[item.id] ?? [];

    return (
        <div className="border-b border-[var(--color-border-default)] last:border-b-0">
            <button
                type="button"
                onClick={() => onToggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-[var(--color-surface-subtle)]"
            >
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                        <Icon size={18} />
                    </span>
                    <span className="font-medium text-[var(--color-text-strong)]">{item.name}</span>
                </div>
                {isOpen ? <ChevronDown size={18} className="text-[var(--color-text-muted)]" /> : <ChevronRight size={18} className="text-[var(--color-text-muted)]" />}
            </button>
            {isOpen && (
                <div className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                    {rows.length > 0 ? (
                        <div className="p-3 md:p-4">
                            <ReferralGameCommissionTable rows={rows} />
                        </div>
                    ) : (
                        <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                            Commission rates vary by provider. Contact support for detailed breakdown.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function HowItWorksContent() {
    const [expandedGame, setExpandedGame] = useState(null);
    const steps = [
        { num: '01', title: 'Share your Registration Link or Referral Code', image: step1Image },
        { num: '02', title: 'Friends Registered Successfully', image: step2Image },
        { num: '03', title: 'Earn Bonus from Your Downlines', image: step3Image },
    ];

    return (
        <div className="space-y-6">
            <div className="surface-card rounded-2xl p-6 md:p-8">
                <h3 className="text-center text-xl font-bold text-[var(--color-text-strong)] md:text-2xl">Invite Your Friends to Earn Passive Income</h3>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
                    {steps.map((step) => (
                            <div
                                key={step.num}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--color-surface-base)_0%,var(--color-surface-subtle)_100%)] shadow-[var(--shadow-subtle)]"
                            >
                                <span className="absolute left-4 top-4 z-10 rounded-md bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-cta-text)] shadow-sm">
                                    Step {step.num}
                                </span>
                                <div className="flex flex-1 flex-col items-center px-4 pb-7 pt-14 text-center md:px-5 md:pb-8">
                                    <div
                                        className="mb-5 flex w-full max-w-[280px] flex-1 items-center justify-center md:max-w-[300px]"
                                        aria-hidden
                                    >
                                        <div className="relative w-full overflow-hidden rounded-xl px-2 py-3 md:py-4">
                                            <img
                                                src={step.image}
                                                alt=""
                                                className="mx-auto h-auto max-h-[200px] w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02] sm:max-h-[220px] md:max-h-[240px]"
                                                loading="lazy"
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                    <p className="max-w-[16rem] text-sm font-bold leading-snug text-[var(--color-text-strong)] md:max-w-none md:text-base md:leading-relaxed">
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="border-b border-[var(--color-border-default)] px-5 py-4 md:px-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-strong)] md:text-xl">Deposit Commission Rate</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Minimum Deposit PKR 30.00</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                            <tr>
                                {depositCommissionTiers.map((t) => (
                                    <th
                                        key={t.tier}
                                        className="border-b border-r border-white/25 bg-[linear-gradient(180deg,var(--color-brand-secondary)_0%,var(--color-brand-deep)_100%)] px-4 py-3 text-center font-bold text-white last:border-r-0"
                                    >
                                        {t.tier}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {depositCommissionTiers.map((t) => (
                                    <td key={t.tier} className="border-b border-[var(--color-border-default)] bg-white px-4 py-3 text-center font-medium text-[var(--color-text-strong)]">{t.rate}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="border-b border-[var(--color-border-default)] px-5 py-4 md:px-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-strong)] md:text-xl">Game Commission Rate</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Listing of commission rates you earn from your downlines&apos; bets by game type and provider.</p>
                </div>
                <div className="divide-y divide-[var(--color-border-default)]">
                    {gameCommissionItems.map((item) => (
                        <GameCommissionRow key={item.id} item={item} isOpen={expandedGame === item.id} onToggle={(id) => setExpandedGame((prev) => (prev === id ? null : id))} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ReferralPage({ authUser, onLoginClick }) {
    const topTabRefs = useRef({});
    const [activeTab, setActiveTab] = useState('Invite Friends');

    return (
        <main className="w-full bg-[var(--color-page-default)] pb-14">
            {/* Hero — Live Casino layout, no CTA / no provider logo */}
            <section className="w-full pt-5 md:pt-7">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                    <div className="page-hero-banner">
                        <img
                            src={referralFullBanner}
                            alt="Referral"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                    </div>
                </div>
            </section>

            {/* Main content with tabs */}
            <section className="mx-auto mt-6 w-full max-w-screen-2xl px-[var(--space-page-x)] md:mt-8 md:px-[var(--space-page-x-md)]">
                <div className="soft-blue-panel overflow-hidden rounded-[var(--radius-shell)] shadow-[var(--shadow-card-raised)]">
                    {/* Tab bar */}
                    <div className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 pt-4 md:px-6">
                        <HorizontalScrollTabRow
                            className="-mx-2 px-2 md:-mx-0 md:px-0"
                            innerClassName="!gap-2 md:!gap-1"
                            innerListProps={{ role: 'tablist', 'aria-label': 'Referral sections' }}
                        >
                            {affiliateTabs.map((tab) => (
                                <button
                                    key={tab}
                                    ref={(el) => {
                                        if (el) topTabRefs.current[tab] = el;
                                        else delete topTabRefs.current[tab];
                                    }}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        scrollTabIntoViewSmooth(topTabRefs.current[tab]);
                                    }}
                                    className={tabButtonClasses(activeTab === tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </HorizontalScrollTabRow>
                    </div>

                    {/* Tab content */}
                    <div className="p-4 md:p-6 lg:p-8">
                        {activeTab === 'Invite Friends' && <InviteFriendsContent onSwitchTab={setActiveTab} authUser={authUser} onLoginClick={onLoginClick} />}
                        {activeTab === 'My Referrals' && <MyReferralsContent authUser={authUser} onLoginClick={onLoginClick} />}
                        {activeTab === 'My Rewards' && <MyRewardsContent authUser={authUser} onLoginClick={onLoginClick} />}
                        {activeTab === 'How It Works' && <HowItWorksContent />}
                    </div>
                </div>
            </section>
        </main>
    );
}

