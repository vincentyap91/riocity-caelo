import React, { useState } from 'react';
import { ChevronRight, Crown, Gift, ShieldCheck, Sparkles, Users } from 'lucide-react';
import normalMedal from '../assets/Normal.png';
import bronzeMedal from '../assets/bronze.png';
import silverMedal from '../assets/silver.png';
import goldMedal from '../assets/gold.png';
import platinumMedal from '../assets/platinum.png';
import sapphireMedal from '../assets/sapphire.png';
import diamondMedal from '../assets/diamond.png';
import headsetImage from '../assets/headset.png';
import vipBanner from '../assets/vip-banner.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import PromotionStyleTabs from './PromotionStyleTabs';

const vipTabs = ['Upgrade', 'Privileges', 'Referral'];

const vipLevels = [
    { tier: 'Normal', medal: normalMedal, monthlyReload: '$8,000', annualReward: '$20,000', depositPoint: '$500', validBetPoint: '$15,000' },
    { tier: 'Bronze', medal: bronzeMedal, monthlyReload: '$20,000', annualReward: '$50,000', depositPoint: '$2,000', validBetPoint: '$50,000' },
    { tier: 'Silver', medal: silverMedal, monthlyReload: '$35,000', annualReward: '$90,000', depositPoint: '$5,000', validBetPoint: '$120,000' },
    { tier: 'Gold', medal: goldMedal, monthlyReload: '$50,000', annualReward: '$120,000', depositPoint: '$8,000', validBetPoint: '$180,000' },
    { tier: 'Platinum', medal: platinumMedal, monthlyReload: '$200,000', annualReward: '$240,000', depositPoint: '$18,000', validBetPoint: '$320,000' },
    { tier: 'Sapphire', medal: sapphireMedal, monthlyReload: '$350,000', annualReward: '$360,000', depositPoint: '$30,000', validBetPoint: '$500,000' },
    { tier: 'Diamond', medal: diamondMedal, monthlyReload: '$1,000,000', annualReward: '$1,200,000', depositPoint: '$100,000', validBetPoint: '$1,500,000' },
];

const vipTierComparisonTiers = [
    { tier: 'Normal', medal: normalMedal },
    { tier: 'Bronze', medal: bronzeMedal },
    { tier: 'Silver', medal: silverMedal },
    { tier: 'Gold', medal: goldMedal },
    { tier: 'Platinum', medal: platinumMedal },
    { tier: 'Diamond', medal: diamondMedal },
];

const vipTierComparisonSections = [
    {
        header: 'Upgrade & Maintenance Requirement',
        rows: [
            { label: 'Deposit Requirement (One Month)', values: ['First Deposit', '$150,000', '$300,000', '$800,000', '$1,800,000', '$5,000,000'] },
            { label: 'Maintenance Requirement (One Month)', values: ['N/A', '$100,000', '$200,000', '$500,000', '$1,300,000', '$2,500,000'] },
            { label: 'Membership Renewal', values: ['Lifetime', 'Monthly', 'Monthly', 'Monthly', 'Monthly', 'Monthly'] },
        ],
    },
    {
        header: 'Daily Rollover Rebate',
        rows: [
            { label: 'Sportsbook', values: ['0.60%', '0.65%', '0.70%', '0.80%', '1%', '1.25%'] },
            { label: 'Live Casino', values: ['0.65%', '0.70%', '0.75%', '0.85%', '1.05%', '1.35%'] },
            { label: 'Slot Games', values: ['0.55%', '0.60%', '0.65%', '0.75%', '0.95%', '1.15%'] },
        ],
    },
    {
        header: 'Gifts & Treats',
        rows: [
            { label: 'Tier Upgrade Bonus', values: ['N/A', '$500', '$888', '$1,888', '$2,888', '$8,888'] },
            { label: 'Weekly Cash Rebate', values: ['N/A', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'] },
            { label: 'Birthday Bonus', values: ['N/A', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'] },
        ],
    },
    {
        header: 'Service Support',
        rows: [
            { label: 'Daily Withdrawal Limit', values: ['3 Times', '3 Times', '4 Times', '4 Times', '5 Times', '8 Times'] },
            { label: 'VIP Privilege Customer Service', values: ['N/A', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'] },
            { label: 'Deposit and Withdrawal Prioritization', values: ['N/A', 'Standard', 'Standard', 'High Priority', 'High Priority', 'Highest Priority'] },
        ],
    },
];

const privilegeCards = [
    {
        title: 'Priority Withdrawals',
        description: 'Enjoy a faster review queue with dedicated handling for eligible VIP members.',
        icon: ShieldCheck,
    },
    {
        title: 'Exclusive Bonuses',
        description: 'Unlock reload offers, birthday rewards, and campaign access reserved for VIP members.',
        icon: Gift,
    },
    {
        title: 'Dedicated Host Support',
        description: 'Receive one-to-one support for account assistance, promotions, and event invitations.',
        icon: Users,
    },
    {
        title: 'Tailored Reward Journey',
        description: 'Progress through higher tiers with better limits, stronger promotions, and premium perks.',
        icon: Sparkles,
    },
];

const referralBenefits = [
    'Invite qualified players and earn extra bonus rewards once they successfully register and deposit.',
    'Referral campaigns may include cashback, limited seasonal prizes, and upgraded VIP access reviews.',
    'Customer service can assist with campaign eligibility and tracking for active referral requests.',
];

function VipMedal({ src, alt, className = '' }) {
    if (!src) {
        return (
            <span
                aria-label={alt}
                title={alt}
                className={`inline-flex items-center justify-center rounded-full border border-[rgb(201_208_224)] bg-[linear-gradient(180deg,#eef2f7_0%,#cfd7e6_100%)] text-xs font-bold uppercase tracking-[0.08em] text-[rgb(67_84_114)] shadow-[0_6px_14px_rgba(148,163,184,0.18)] ${className}`}
            >
                SV
            </span>
        );
    }

    return <img src={src} alt={alt} className={`object-contain ${className}`} />;
}

function UpgradeContent() {
    return (
        <div className="space-y-6">
            <div className="surface-card rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[rgb(28_40_65)] md:text-xl">How Does It Work?</h3>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[rgb(78_94_122)]">
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-bold text-white">1</span>
                        <span>Members apply to become VIP after reaching the required deposit and valid bet targets within the promotion cycle.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-bold text-white">2</span>
                        <span>The VIP team reviews the account performance and may contact the member for profile verification.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-bold text-white">3</span>
                        <span>Successful applicants receive tier confirmation, monthly reward eligibility, and access to premium member privileges.</span>
                    </li>
                </ol>
            </div>

            <div className="surface-card overflow-hidden rounded-2xl">
                <div className="border-b border-[rgb(219_228_243)] px-4 py-4 md:px-5">
                    <h3 className="text-lg font-bold text-[rgb(28_40_65)] md:text-xl">VIP Loyalty Tiers</h3>
                    <p className="mt-1 text-sm text-[rgb(93_103_128)]">
                        Compare benefits across tiers. Move through each level by increasing your qualifying deposits and valid bets.
                    </p>
                </div>

                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="w-[1%] border-b border-white/20 bg-[#1c63b9] px-4 py-3" aria-hidden>
                                </th>
                                {vipTierComparisonTiers.map((t) => (
                                    <th
                                        key={t.tier}
                                        className="min-w-[110px] border-b border-white/20 bg-[#1c63b9] px-4 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <VipMedal src={t.medal} alt={`${t.tier} medal`} className="h-11 w-11 shrink-0 md:h-12 md:w-12" />
                                            <span className="font-bold uppercase tracking-[0.08em] text-white drop-shadow-sm">{t.tier}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {vipTierComparisonSections.map((section) => (
                                <React.Fragment key={section.header}>
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="border-b border-[rgb(226_232_240)] bg-[rgb(241_245_252)] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[rgb(28_40_65)]"
                                        >
                                            {section.header}
                                        </td>
                                    </tr>
                                    {section.rows.map((row, rowIdx) => (
                                        <tr
                                            key={row.label}
                                            className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[rgb(248_251_255)]'}
                                        >
                                            <td className="border-b border-r border-[rgb(226_232_240)] px-4 py-3 font-normal text-[rgb(51_65_85)]">
                                                {row.label}
                                            </td>
                                            {row.values.map((val, colIdx) => (
                                                <td
                                                    key={colIdx}
                                                    className="border-b border-[rgb(226_232_240)] px-4 py-3 text-center font-normal text-[rgb(51_65_85)]"
                                                >
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 p-4 md:hidden">
                    {vipTierComparisonTiers.map((t) => (
                        <div key={t.tier} className="surface-card rounded-xl overflow-hidden">
                            <div className="flex items-center gap-3 border-b border-[rgb(226_232_240)] bg-[#1c63b9] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                                <VipMedal src={t.medal} alt={`${t.tier} medal`} className="h-11 w-11 shrink-0" />
                                <span className="font-bold uppercase tracking-[0.08em] text-white drop-shadow-sm">{t.tier}</span>
                            </div>
                            <div className="divide-y divide-[rgb(226_232_240)] p-4">
                                {vipTierComparisonSections.map((section) => (
                                    <div key={section.header} className="py-3 first:pt-0 last:pb-0">
                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[rgb(28_40_65)]">
                                            {section.header}
                                        </p>
                                        <div className="mt-2 space-y-2">
                                            {section.rows.map((row) => (
                                                <div key={row.label} className="flex justify-between gap-4 text-sm">
                                                    <span className="font-normal text-[rgb(51_65_85)]">{row.label}</span>
                                                    <span className="shrink-0 font-normal text-[rgb(51_65_85)]">
                                                        {row.values[vipTierComparisonTiers.findIndex((x) => x.tier === t.tier)]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PrivilegesContent() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {privilegeCards.map(({ title, description, icon: Icon }) => (
                <div
                    key={title}
                    className="surface-card rounded-2xl p-6 md:p-7"
                >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#ffd86f_0%,#ffb038_100%)] text-[var(--color-cta-text)] shadow-[0_8px_14px_rgba(242,154,0,0.22)]">
                        <Icon size={20} strokeWidth={2.25} />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-[rgb(28_40_65)]">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[rgb(93_103_128)]">{description}</p>
                </div>
            ))}
        </div>
    );
}

function ReferralContent() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card rounded-2xl p-6 md:p-7">
                <h3 className="text-lg font-bold text-[rgb(28_40_65)] md:text-xl">Referral Rewards</h3>
                <div className="mt-4 space-y-3">
                    {referralBenefits.map((item, index) => (
                        <div key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[rgb(93_103_128)]">
                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-bold text-white">
                                {index + 1}
                            </span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="surface-card rounded-2xl p-6 md:p-7">
                <h3 className="text-lg font-bold text-[rgb(28_40_65)]">Contact VIP Team</h3>
                <p className="mt-3 text-sm leading-relaxed text-[rgb(93_103_128)]">
                    Need assistance with account review, benefits, or VIP eligibility? Our support team can help you verify your requirements.
                </p>
                <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-[rgb(219_228_243)] bg-[var(--color-surface-subtle)] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[rgb(100_116_139)]">Email</p>
                        <p className="mt-1 font-semibold text-[rgb(28_40_65)]">vip@12win.example</p>
                    </div>
                    <div className="rounded-xl border border-[rgb(219_228_243)] bg-[var(--color-surface-subtle)] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[rgb(100_116_139)]">Support Hours</p>
                        <p className="mt-1 font-semibold text-[rgb(28_40_65)]">24/7 Live Chat Assistance</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn-theme-cta mt-5 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                >
                    Contact Support
                </button>
            </div>
        </div>
    );
}

export default function VipPage({ authUser }) {
    const [activeTab, setActiveTab] = useState('Upgrade');
    const showBannerCta = !authUser;

    return (
        <main className="w-full bg-[var(--color-page-default)] pb-14">
            <section className="w-full pt-5 md:pt-7">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                    <div className="page-hero-banner">
                        <img
                            src={vipBanner}
                            alt="VIP Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                        {/* Mobile: same right-column layout as referral hero; md+: unchanged VIP strip */}
                        <div className="absolute inset-y-0 right-0 flex w-[56%] items-center justify-end pr-3 sm:w-[52%] sm:pr-4 md:w-[52%] md:justify-start md:pr-0">
                            <div className="flex w-full max-w-[500px] flex-col items-center justify-center px-2 py-2 text-center max-md:justify-center md:max-w-[520px] md:px-8 md:py-7">
                                <h1
                                    className="bg-gradient-to-br from-[#FFE082] via-[#FFC107] to-[#E6A800] bg-clip-text text-lg font-bold uppercase tracking-[0.1em] text-transparent max-md:leading-tight md:text-3xl md:tracking-[0.12em]"
                                    style={{
                                        textShadow: '0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.3), 0 4px 16px rgba(230,168,0,0.25)',
                                    }}
                                >
                                    VIP Programme
                                </h1>
                                <p className="mx-auto mt-2 hidden max-w-[420px] text-base font-medium leading-relaxed text-[rgb(15_23_42)] md:mt-5 md:block">
                                    Unlock premium rewards, tailored bonuses, and priority support with every VIP tier.
                                </p>
                                {showBannerCta && (
                                    <a
                                        href="/register"
                                        className="btn-theme-cta mt-2 inline-flex h-9 min-w-[150px] items-center justify-center rounded-[10px] px-5 text-xs font-bold tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] md:mt-6 md:h-14 md:min-w-[240px] md:px-12 md:text-lg"
                                        aria-label="Join VIP now"
                                    >
                                        JOIN NOW
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-4 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="soft-blue-panel rounded-[28px] p-4 shadow-[var(--shadow-card-raised)] md:p-6">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-700)] shadow-[var(--shadow-subtle)]">
                            <Crown size={14} className="text-[var(--color-nav-gold)]" />
                            VIP Group
                        </span>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] md:text-3xl">
                            Premium rewards for our most active members
                        </h1>
                        <p className="mt-3 max-w-[760px] text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                            Join the VIP programme to unlock monthly reload rewards, exclusive promotions, higher service priority, and a tailored premium experience across the platform.
                        </p>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-accent-600)]">Starting Tier</p>
                                    <p className="mt-1.5 text-xl font-bold text-[var(--color-text-strong)]">Normal</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-subtle)] p-1.5 shadow-[var(--shadow-subtle)]">
                                    <VipMedal src={normalMedal} alt="Normal medal" className="h-12 w-12 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-accent-600)]">Top Reward Tier</p>
                                    <p className="mt-1.5 text-xl font-bold text-[var(--color-text-strong)]">Diamond</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-subtle)] p-1.5 shadow-[var(--shadow-subtle)]">
                                    <VipMedal src={diamondMedal} alt="Diamond medal" className="h-12 w-12 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-accent-600)]">Member Support</p>
                                    <p className="mt-1.5 text-xl font-bold text-[var(--color-text-strong)]">24 / 7</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-subtle)] p-2 shadow-[var(--shadow-subtle)]">
                                    <img
                                        src={headsetImage}
                                        alt="Headset support"
                                        className="h-11 w-11 object-contain sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 border-t border-[rgb(219_228_243)] pt-5">
                        <PromotionStyleTabs
                            items={vipTabs}
                            value={activeTab}
                            onChange={setActiveTab}
                            gapClassName="!gap-3 sm:!gap-3"
                            ariaLabel="VIP programme sections"
                        />
                    </div>

                    <div className="mt-6">
                        {activeTab === 'Upgrade' ? <UpgradeContent /> : activeTab === 'Privileges' ? <PrivilegesContent /> : <ReferralContent />}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base)] p-5 shadow-[0_6px_18px_rgba(20,43,87,0.08)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xl font-bold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">VIP Highlights</p>
                            <p className="mt-1 text-sm leading-relaxed text-[rgb(93_103_128)]">
                                Monthly reloads, special campaigns, birthday treats, and tailored support designed for loyal members.
                            </p>
                        </div>

                        <a
                            href="/register"
                            className="btn-theme-cta inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                        >
                            Join Now
                            <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

