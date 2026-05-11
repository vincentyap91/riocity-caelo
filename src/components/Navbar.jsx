import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ChevronDown,
    ChevronRight,
    CircleDollarSign,
    RefreshCw,
    Dices,
    Fish,
    Gamepad2,
    Gift,
    HelpCircle,
    House,
    Spade,
    LayoutGrid,
    Megaphone,
    Smartphone,
    Star,
    Ticket,
    X,
    Headset,
    History,
    Heart,
    LogOut,
    Percent,
    ScrollText,
    Settings,
    ShieldCheck,
    Trophy,
    UserCircle2,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
import LiveCasinoMenu from './LiveCasinoMenu';
import NavProviderDropdownPanel from './NavProviderDropdownPanel';
import { slotProvidersForNavDropdown } from '../constants/matchedSlotProviders';
import LanguageSwitcher from './LanguageSwitcher';
import { HISTORY_RECORD_NAV } from '../constants/historyRecordPages';
import { settingsOptions } from '../constants/settingsOptions';
import { REWARDS_NAV_ICONS, REWARDS_PROGRAMS } from '../constants/rewardsPrograms';
import { getVipStatus } from '../constants/vipStatus';
import VipStatusPill from './VipStatusPill';
import MobileSiteHeader from './MobileSiteHeader';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { NAV_STICKY_SUBHEADER_TOP_CLASS } from '../constants/navStickyOffsets';

const slotsNavDropdownProviders = slotProvidersForNavDropdown();
const DESKTOP_MAIN_LINKS = [
    'Home', 'Casino', 'Slots', 'Sports', 'E-Sports', 'Lottery', 'Hot Games',
    'Fishing', 'Poker', 'Promotion', 'Referral', 'VIP',
];
const NAV_TARGETS = {
    Home: 'home',
    Casino: 'live-casino',
    Slots: 'slots',
    Sports: 'sports',
    'E-Sports': 'e-sports',
    Lottery: 'lottery',
    'Hot Games': 'hot-games',
    Fishing: 'fishing',
    Poker: 'poker',
    Promotion: 'promotion',
    Referral: 'referral',
    VIP: 'vip',
};
const NAV_HREFS = {
    Home: '/',
    Casino: '/casino',
    Slots: '/slots',
    Sports: '/sports',
    'E-Sports': '/e-sports',
    Lottery: '/lottery',
    'Hot Games': '/hot-games',
    Fishing: '/fishing',
    Poker: '/poker',
    Promotion: '/promotion',
    Referral: '/referral',
    VIP: '/vip',
};
const MOBILE_PRIMARY_ITEMS = [
    { id: 'home', label: 'Home', page: 'home', icon: House },
    { id: 'promotions', label: 'Promotions', page: 'promotion', icon: Megaphone },
    { id: 'games', label: 'Games', page: 'all-games', icon: Gamepad2 },
    { id: 'referral', label: 'Referral', page: 'referral', icon: Users },
    { id: 'more', label: 'More', icon: LayoutGrid },
];
const MOBILE_GAMES_SUB_ITEMS = [
    { id: 'hot-games', label: 'Hot Games', page: 'hot-games', icon: Star },
    { id: 'casino', label: 'Casino', page: 'live-casino', icon: Spade },
    { id: 'slots', label: 'Slots', page: 'slots', icon: Dices },
    { id: 'sports', label: 'Sports', page: 'sports', icon: Trophy },
    { id: 'e-sports', label: 'E-Sports', page: 'e-sports', icon: Trophy },
    { id: 'lottery', label: 'Lottery', page: 'lottery', icon: Ticket },
];

const MOBILE_MORE_SECTIONS = [
    {
        id: 'wallet',
        label: 'Wallet',
        icon: Wallet,
        items: [
            { id: 'deposit', label: 'Deposit', page: 'deposit', icon: ArrowDownToLine },
            { id: 'withdrawal', label: 'Withdrawal', page: 'withdrawal', icon: ArrowUpFromLine },
            { id: 'referral-commission', label: 'Referral Commission', page: 'referral-commission', icon: Users },
            { id: 'rebate', label: 'Rebate', page: 'rebate', icon: Percent },
        ],
    },
    {
        id: 'rewards',
        label: 'Rewards',
        icon: Gift,
        items: REWARDS_PROGRAMS.map(({ id, label }) => ({
            id,
            label,
            page: 'loyalty-rewards',
            rewardsTab: id,
            icon: REWARDS_NAV_ICONS[id] ?? Trophy,
        })),
    },
    {
        id: 'history',
        label: 'History',
        icon: History,
        items: HISTORY_RECORD_NAV.map(({ id, label, icon }) => ({
            id,
            label,
            page: id,
            icon,
        })),
    },
    {
        id: 'account',
        label: 'Account',
        icon: UserRound,
        items: [
            { id: 'profile', label: 'Profile', page: 'profile', icon: UserRound },
            { id: 'my-account', label: 'My Account', page: 'profile', icon: UserCircle2, activePages: ['profile'] },
            { id: 'verification', label: 'Verification', page: 'verification', icon: ShieldCheck },
            { id: 'favourites', label: 'Favourites', page: 'favourites', icon: Heart },
            { id: 'vip', label: 'VIP', page: 'vip', icon: Trophy },
            { id: 'settings', label: 'Settings', page: 'security', icon: Settings, activePages: ['security', 'notifications'] },
        ],
    },
    {
        id: 'support',
        label: 'Support',
        icon: Headset,
        items: [
            { id: 'live-chat', label: 'Live Chat', icon: Headset, action: 'liveChat' },
            { id: 'help-center', label: 'Help Center', page: 'help-center', icon: HelpCircle },
            { id: 'feedback', label: 'Feedback', page: 'feedback', icon: Star },
            { id: 'app-download', label: 'App Download', icon: Smartphone, action: 'download' },
            { id: 'log-out', label: 'Log Out', icon: LogOut, action: 'logout' },
        ],
    },
];
const MOBILE_MORE_ACTIVE_PAGES = new Set([
    'all-games',
    'e-sports',
    'lottery',
    'fishing',
    'poker',
    'deposit',
    'withdrawal',
    'referral-commission',
    'rebate',
    'loyalty-rewards',
    'transaction-record',
    'bet-record',
    'commission-record',
    'rebate-record',
    'daily-check-in-record',
    'promotion-record',
    'profile',
    'verification',
    'favourites',
    'vip',
    'security',
    'notifications',
    'help-center',
    'feedback',
    'my-bets',
]);
const MOBILE_MORE_SECTION_BY_PAGE = MOBILE_MORE_SECTIONS.reduce((accumulator, section) => {
    section.items.forEach(({ page, activePages }) => {
        if (page) {
            accumulator[page] = section.id;
        }
        activePages?.forEach((pageId) => {
            accumulator[pageId] = section.id;
        });
    });
    return accumulator;
}, {});

export default function Navbar({
    onNavigate,
    onDownloadAppClick,
    activePage = 'home',
    onLoginClick,
    onRegisterClick,
    authUser,
    onLogout,
    onAccountDetailsClick,
    onLiveChatClick,
    onCasinoProviderSelect,
    onSlotsProviderSelect,
    onRefreshBalance,
    balanceRefreshing = false,
}) {
    const vipLevel = authUser?.vipLevel || 'Diamond';
    /** `null` | `'casino'` | `'slots'` ΓÇö shared mega-menu pattern */
    const [navProviderDropdown, setNavProviderDropdown] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [mobileGamesOpen, setMobileGamesOpen] = useState(false);
    const [openMobileMoreSection, setOpenMobileMoreSection] = useState(null);
    const [language, setLanguage] = useState('en-us');
    const [openProfileSection, setOpenProfileSection] = useState('account');
    const profileMenuRef = useRef(null);
    const accountCards = [
        { id: 'profile', label: 'Account Details', icon: UserRound },
        { id: 'verification', label: 'Verification', icon: ShieldCheck },
        { id: 'favourites', label: 'Favourites', icon: Heart },
    ];
    const cashierPageById = {
        deposit: 'deposit',
        withdrawal: 'withdrawal',
        'referral-commission': 'referral-commission',
        rebate: 'rebate',
    };
    const cashierItems = [
        { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
        { id: 'withdrawal', label: 'Withdrawal', icon: ArrowUpFromLine },
        { id: 'referral-commission', label: 'Referral Commission', icon: Users },
        { id: 'rebate', label: 'Rebate', icon: Percent },
    ];

    useBodyScrollLock(mobileMenuOpen);

    useEffect(() => {
        if (!profileMenuOpen) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [profileMenuOpen]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [activePage]);

    useEffect(() => {
        if (mobileMenuOpen) {
            return undefined;
        }

        setMobileMoreOpen(false);
        setMobileGamesOpen(false);
        setOpenMobileMoreSection(null);
        return undefined;
    }, [mobileMenuOpen]);

    useEffect(() => {
        document.body.dataset.mobileMenuOpen = mobileMenuOpen ? 'true' : 'false';

        return () => {
            delete document.body.dataset.mobileMenuOpen;
        };
    }, [mobileMenuOpen]);

    const toggleProfileSection = (sectionKey) => {
        setOpenProfileSection((current) => (current === sectionKey ? null : sectionKey));
    };

    const handleMobileNavigate = (targetPage, options) => {
        setMobileMenuOpen(false);
        onNavigate?.(targetPage, options);
    };

    const handleMobileDownloadApp = () => {
        setMobileMenuOpen(false);
        onDownloadAppClick?.();
    };

    const getMobileMoreDefaultSection = () => MOBILE_MORE_SECTION_BY_PAGE[activePage] ?? null;

    const handleMobileMoreToggle = () => {
        if (mobileMoreOpen) {
            setMobileMoreOpen(false);
            setOpenMobileMoreSection(null);
            return;
        }

        setMobileMoreOpen(true);
        setOpenMobileMoreSection((current) => current ?? getMobileMoreDefaultSection());
    };

    const handleMobileMoreSectionToggle = (sectionId) => {
        setOpenMobileMoreSection((current) => (current === sectionId ? null : sectionId));
    };

    const isMobileMoreItemActive = ({ page, activePages, rewardsTab }) => {
        if (activePages?.includes(activePage)) {
            return true;
        }

        if (page !== activePage) {
            return false;
        }

        if (page === 'loyalty-rewards' && rewardsTab && typeof window !== 'undefined') {
            return window.location.hash.slice(1) === rewardsTab;
        }

        return true;
    };

    const handleMobileMoreItemClick = ({ page, rewardsTab, action }) => {
        if (action === 'liveChat') {
            setMobileMenuOpen(false);
            onLiveChatClick?.();
            return;
        }

        if (action === 'download') {
            handleMobileDownloadApp();
            return;
        }

        if (action === 'logout') {
            setMobileMenuOpen(false);
            onLogout?.();
            return;
        }

        if (page === 'profile') {
            handleMobileNavigate('profile');
            return;
        }

        if (page === 'loyalty-rewards' && rewardsTab) {
            handleMobileNavigate('loyalty-rewards', { rewardsTab });
            return;
        }

        if (page) {
            handleMobileNavigate(page);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 w-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${mobileMenuOpen ? 'z-[400]' : 'z-50'}`}
            onMouseLeave={() => setNavProviderDropdown(null)}
        >
            <MobileSiteHeader
                authUser={authUser}
                language={language}
                onLanguageChange={setLanguage}
                mobileMenuOpen={mobileMenuOpen}
                onMenuToggle={() => setMobileMenuOpen((open) => !open)}
                onNavigateHome={() => onNavigate?.('home')}
                onProfileClick={() => onNavigate?.('profile')}
                onRefreshBalance={onRefreshBalance}
                balanceRefreshing={balanceRefreshing}
                onLoginClick={() => onLoginClick?.()}
                onRegisterClick={() => onRegisterClick?.()}
            />


            <div className="relative z-[110] hidden h-9 w-full items-center border-b border-white/10 bg-[var(--color-nav-top)] px-4 text-xs text-white md:flex md:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex gap-4 items-center h-full">
                        <button
                            type="button"
                            onClick={() => onDownloadAppClick?.()}
                            className="flex h-7 items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-3 hover:bg-white/10 hover:border-white/35 transition-all"
                        >
                            <Smartphone size={14} className="shrink-0 text-white/90" />
                            <span className="text-sm font-medium">Download App</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2.5 h-full">
                        {authUser ? (
                            <div
                                ref={profileMenuRef}
                                className="relative flex h-full items-center gap-1 rounded-[12px] px-1 py-0.5 shadow-[var(--shadow-nav-top)]"
                            >
                                <div className="flex h-7 min-w-0 max-w-[13rem] items-stretch overflow-hidden rounded-[9px] border border-white/10 bg-[rgb(14_99_187)] text-white">
                                    <div className="flex min-w-0 flex-1 items-center px-2.5 text-xs font-bold tracking-[0.01em]">
                                        <span className="min-w-0 truncate tabular-nums">{authUser.balance}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onRefreshBalance?.();
                                        }}
                                        disabled={!onRefreshBalance || balanceRefreshing}
                                        className="inline-flex h-full w-7 min-w-7 shrink-0 touch-manipulation items-center justify-center border-l border-white/15 text-white/90 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-40"
                                        aria-label="Refresh balance"
                                        title="Refresh balance"
                                    >
                                        <RefreshCw
                                            size={13}
                                            strokeWidth={2.25}
                                            className={`shrink-0 ${balanceRefreshing ? 'animate-spin' : ''}`}
                                            aria-hidden
                                        />
                                    </button>
                                </div>
                                <div className="flex h-7 shrink-0 items-stretch overflow-hidden rounded-[9px] border border-white/15 bg-[linear-gradient(180deg,#16508f_0%,#0d3562_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            onNavigate?.('profile');
                                        }}
                                        className="flex min-w-0 max-w-[min(100%,15rem)] items-center gap-1.5 px-2 text-white transition hover:bg-white/[0.06]"
                                        aria-label="My profile"
                                    >
                                        <img
                                            src={getVipStatus(vipLevel).medal}
                                            alt=""
                                            className="h-5 w-5 shrink-0 object-contain"
                                        />
                                        <span className="truncate text-xs font-bold tracking-[0.02em] text-[rgb(255_240_160)]">
                                            {authUser.name}
                                        </span>
                                        <UserCircle2 size={18} className="shrink-0 text-white/90" />
                                    </button>
                                    <span className="w-px shrink-0 self-stretch bg-white/20" aria-hidden />
                                    <button
                                        type="button"
                                        onClick={() => setProfileMenuOpen((open) => !open)}
                                        className="inline-flex w-7 shrink-0 items-center justify-center text-white/80 transition hover:bg-white/[0.06] hover:text-white"
                                        aria-haspopup="menu"
                                        aria-expanded={profileMenuOpen}
                                        aria-label="Account menu"
                                    >
                                        <ChevronDown
                                            size={13}
                                            className={`transition-transform ${profileMenuOpen ? 'rotate-90' : ''}`}
                                        />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        onNavigate?.('deposit');
                                    }}
                                    className="btn-theme-cta-soft h-7 shrink-0 rounded-[9px] px-4 font-bold tracking-wide transition hover:brightness-105"
                                >
                                    DEPOSIT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onLogout?.()}
                                    className="h-7 rounded-[9px] border border-white/40 bg-white/[0.03] px-4 font-bold text-white hover:bg-white/10 transition"
                                >
                                    LOGOUT
                                </button>
                                <LanguageSwitcher value={language} onChange={setLanguage} />

                                {profileMenuOpen && (
                                    <div className="dark-nav-shell absolute right-25 top-[calc(100%+10px)] z-[120] flex max-h-[calc(100vh-5rem)] w-[312px] flex-col overflow-hidden rounded-[30px] p-3.5 text-white">
                                        <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,#29bbff55_0%,transparent_72%)] pointer-events-none" />

                                        <div className="relative shrink-0">
                                            <div className="relative flex items-start gap-3">
                                                <div className="relative shrink-0">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[rgb(86_185_255_/_0.5)] bg-[linear-gradient(180deg,#1a5bb1_0%,#0b3e80_100%)] shadow-[var(--inset-highlight-strong)]">
                                                        <UserCircle2 size={40} className="text-white/90" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileMenuOpen(false);
                                                            onAccountDetailsClick?.();
                                                        }}
                                                        className="absolute bottom-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[var(--color-nav-badge)] text-white shadow-[0_6px_12px_rgba(0,0,0,0.22)] transition hover:brightness-110"
                                                        aria-label="Account details"
                                                    >
                                                        <ScrollText size={12} />
                                                    </button>
                                                </div>

                                                <div className="min-w-0 pt-1">
                                                    <p className="truncate text-xl font-bold leading-none text-white">
                                                        Hi, {authUser.name}
                                                    </p>
                                                    <div className="mt-1.5 space-y-1 text-xs text-[var(--color-nav-text-soft)]">
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-[var(--color-nav-text-accent)]">Joined:</span>
                                                            <span className="font-semibold">08/01/2026</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-[var(--color-nav-text-accent)]">Player ID:</span>
                                                            <span className="font-semibold">679129</span>
                                                        </p>
                                                    </div>
                                                    <VipStatusPill level={vipLevel} theme="dark" className="mt-2" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-menu-scroll relative mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
                                            <div className="dark-nav-panel relative rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('cashier')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                                            <Wallet size={14} />
                                                        </div>
                                                        <span className="text-lg font-bold text-white">Cashier</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-white/80 transition-transform ${openProfileSection === 'cashier' ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {openProfileSection === 'cashier' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {cashierItems.map(({ id, label, icon: Icon }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    const page = cashierPageById[id];
                                                                    if (page) onNavigate?.(page);
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                                <span className="text-xs font-bold leading-tight text-white">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel relative mt-3 rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('account')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                                            <UserRound size={14} />
                                                        </div>
                                                        <span className="text-lg font-bold text-white">My Account</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-white/80 transition-transform ${openProfileSection === 'account' ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {openProfileSection === 'account' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {accountCards.map(({ id, label, icon: Icon }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    if (id === 'profile') {
                                                                        onAccountDetailsClick?.();
                                                                    } else {
                                                                        onNavigate?.(id);
                                                                    }
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                                <span className="text-xs font-bold leading-tight text-white">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel relative mt-3 rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('rewards')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                                            <Trophy size={14} />
                                                        </div>
                                                        <span className="text-lg font-bold text-white">Rewards</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-white/80 transition-transform ${openProfileSection === 'rewards' ? 'rotate-90' : ''}`}
                                                    />
                                                </button>

                                                {openProfileSection === 'rewards' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {REWARDS_PROGRAMS.map(({ id, label }) => {
                                                            const NavIcon = REWARDS_NAV_ICONS[id] ?? Trophy;
                                                            return (
                                                                <button
                                                                    key={id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setProfileMenuOpen(false);
                                                                        onNavigate?.('loyalty-rewards', { rewardsTab: id });
                                                                    }}
                                                                    className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                                >
                                                                    <NavIcon
                                                                        size={18}
                                                                        className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]"
                                                                    />
                                                                    <span className="text-xs font-bold leading-tight text-white">{label}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel relative mt-3 rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('historyRecord')}
                                                    className="flex w-full items-center justify-between transition hover:opacity-90"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[rgb(90_208_255)] shadow-[var(--shadow-nav-pill)]">
                                                            <History size={14} />
                                                        </div>
                                                        <span className="text-lg font-bold text-white">History Record</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-white/80 transition-transform ${openProfileSection === 'historyRecord' ? 'rotate-90' : ''}`}
                                                    />
                                                </button>
                                                {openProfileSection === 'historyRecord' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        {HISTORY_RECORD_NAV.map(({ id, label, icon: Icon }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    onNavigate?.(id);
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[64px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                                <span className="text-xs font-bold leading-tight text-white">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel mt-3 rounded-[22px] px-4 py-3 transition hover:border-[rgb(102_203_255_/_0.24)]">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('settings')}
                                                    className="flex w-full items-center justify-between text-left"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[rgb(75_141_255)]">
                                                            <Settings size={14} />
                                                        </span>
                                                        <span className="text-base font-bold text-white">Settings</span>
                                                    </span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-white/80 transition-transform ${openProfileSection === 'settings' ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {openProfileSection === 'settings' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        {settingsOptions.map(({ id, label, icon: Icon, action }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    if (action === 'liveChat') {
                                                                        onLiveChatClick?.();
                                                                    } else {
                                                                        onNavigate?.(id);
                                                                    }
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[64px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                                <span className="text-xs font-bold leading-tight text-white">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileMenuOpen(false);
                                                    onLogout?.();
                                                }}
                                                className="mt-4 inline-flex min-h-[40px] items-center gap-2.5 text-base font-bold text-[var(--color-nav-gold)] transition hover:text-[var(--color-nav-gold-soft)]"
                                            >
                                                <LogOut size={16} />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onLoginClick?.()}
                                    className="h-8 rounded-lg bg-[var(--color-brand-primary)] border border-[rgba(255,255,255,0.15)] px-4 text-sm font-bold text-white hover:brightness-110 shadow-sm transition-all"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRegisterClick?.()}
                                    className="btn-theme-cta-soft h-8 rounded-lg px-5 text-sm font-bold transition-all hover:brightness-105"
                                >
                                    Join Now
                                </button>
                                <LanguageSwitcher value={language} onChange={setLanguage} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* TWO-TONE HEADER: Main Navigation Row (Lower) */}
            <div className="relative z-[100] hidden h-16 w-full items-center border-b border-gray-100 bg-white px-4 shadow-sm md:flex md:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('home')}
                            className="flex shrink-0 items-center justify-center py-1 transition-opacity hover:opacity-90"
                        >
                            <img src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp" alt="12WIN Logo" className="h-[36px] md:h-[40px] w-auto object-contain block" />
                        </button>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-end items-center gap-x-1">
                        {DESKTOP_MAIN_LINKS.map((link, idx) => {
                            const isActive = (activePage === 'home' && link === 'Home') ||
                                (activePage === 'live-casino' && link === 'Casino') ||
                                (activePage === 'slots' && link === 'Slots') ||
                                (activePage === 'sports' && link === 'Sports') ||
                                (activePage === 'e-sports' && link === 'E-Sports') ||
                                (activePage === 'lottery' && link === 'Lottery') ||
                                (activePage === 'hot-games' && link === 'Hot Games') ||
                                (activePage === 'fishing' && link === 'Fishing') ||
                                (activePage === 'poker' && link === 'Poker') ||
                                (activePage === 'promotion' && link === 'Promotion') ||
                                (activePage === 'referral' && link === 'Referral') ||
                                (activePage === 'vip' && link === 'VIP');
                            return (
                                <a
                                    key={idx}
                                    href={NAV_HREFS[link] ?? '#'}
                                    onMouseEnter={() => {
                                        if (link === 'Casino') setNavProviderDropdown('casino');
                                        else if (link === 'Slots') setNavProviderDropdown('slots');
                                        else setNavProviderDropdown(null);
                                    }}
                                    onFocus={() => {
                                        if (link === 'Casino') setNavProviderDropdown('casino');
                                        else if (link === 'Slots') setNavProviderDropdown('slots');
                                        else setNavProviderDropdown(null);
                                    }}
                                    onClick={(event) => {
                                        const target = NAV_TARGETS[link];
                                        if (target) {
                                            event.preventDefault();
                                            onNavigate?.(target);
                                        }
                                    }}
                                    className={`relative rounded-lg border border-transparent px-4 py-2 text-sm font-bold whitespace-nowrap transition-all
                                        ${isActive
                                            ? 'nav-desktop-link-active'
                                            : 'text-[var(--color-text-brand)] hover:bg-[var(--color-brand-deep)] hover:text-white hover:shadow-[0_10px_18px_rgba(8,26,66,0.18)]'}`}
                                >
                                    {link}
                                </a>
                            );
                        })}

                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        {authUser ? (
                            <>
                                <div className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
                                    <span className="truncate">{authUser.balance}</span>
                                    <CircleDollarSign size={14} className="shrink-0 text-[var(--color-nav-gold)]" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('deposit')}
                                    className="btn-theme-cta-soft inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl px-3.5 text-sm font-bold tracking-wide"
                                >
                                    Deposit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('profile')}
                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                                    aria-label="My profile"
                                >
                                    <UserCircle2 size={20} className="text-white/90" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onLoginClick?.()}
                                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/35 bg-white/5 px-3.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-white/50"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRegisterClick?.()}
                                    className="btn-theme-cta-soft inline-flex min-h-10 items-center justify-center rounded-xl px-3.5 text-sm font-bold"
                                >
                                    Join Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Provider mega menus: anchor directly under the white nav row */}
                <LiveCasinoMenu
                    open={navProviderDropdown === 'casino'}
                    onProviderClick={(provider) => {
                        onCasinoProviderSelect?.(provider);
                        setNavProviderDropdown(null);
                    }}
                />

                <NavProviderDropdownPanel
                    open={navProviderDropdown === 'slots'}
                    providers={slotsNavDropdownProviders}
                    onProviderClick={(provider) => {
                        onSlotsProviderSelect?.(provider);
                        setNavProviderDropdown(null);
                    }}
                />
            </div>

            <button
                type="button"
                className={`fixed inset-x-0 bottom-0 top-0 z-[380] bg-[var(--color-nav-overlay)] backdrop-blur-[1px] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
                aria-hidden={!mobileMenuOpen}
                tabIndex={mobileMenuOpen ? 0 : -1}
            />
            <aside
                className={`fixed inset-y-0 left-0 z-[390] flex w-full max-w-[360px] min-h-0 flex-col overflow-hidden border-r border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-main)] shadow-[var(--shadow-sidebar)] transition-transform duration-300 ease-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full'
                    }`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="relative border-b border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-3.5 py-3">
                    <div className="min-w-0">
                        {authUser ? (
                            <button
                                type="button"
                                onClick={() => handleMobileNavigate('profile')}
                                className="w-full pr-12 text-left text-2xl font-bold leading-tight text-[var(--color-text-brand-soft)] transition hover:opacity-90"
                            >
                                Hi, {authUser.name}
                            </button>
                        ) : (
                            <div className="pr-12">
                                <h2 className="text-xl font-bold leading-tight text-[var(--color-text-brand-soft)]">Play Anywhere</h2>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Your essentials stay up top. Everything else is tucked into More.</p>
                            </div>
                        )}

                        {authUser ? (
                            <div className="mt-2.5 space-y-2.5">
                                <VipStatusPill level={vipLevel} size="compact" className="rounded-full shadow-[var(--shadow-brand-soft)]" />
                                <div className="w-full rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-3.5 shadow-[var(--shadow-card-soft)]">
                                    <div className="flex items-center justify-between gap-2.5">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-brand)]">
                                                Balance
                                            </p>
                                            <p className="mt-0.5 text-base font-bold text-[var(--color-text-strong)]">{authUser.balance}</p>
                                        </div>
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-brand)] bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                            <CircleDollarSign size={16} />
                                        </span>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('deposit')}
                                            className="btn-theme-cta-soft inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-bold"
                                        >
                                            <ArrowDownToLine size={15} />
                                            Deposit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('withdrawal')}
                                            className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border-brand)] bg-white px-3 text-sm font-bold text-[var(--color-text-brand)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-surface-subtle)]"
                                        >
                                            <ArrowUpFromLine size={15} />
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onLoginClick?.();
                                    }}
                                    className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[var(--color-border-brand)] bg-white px-4 text-sm font-semibold text-[var(--color-text-main)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-surface-subtle)]"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onRegisterClick?.();
                                    }}
                                    className="btn-theme-cta-soft inline-flex min-h-[42px] items-center justify-center rounded-xl px-4 text-sm font-bold"
                                >
                                    Join Now
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute right-3.5 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-brand)] bg-white/80 text-[var(--color-text-brand)] shadow-[var(--shadow-input)] transition hover:bg-white"
                        aria-label="Close mobile menu"
                    >
                        <X size={16} />
                    </button>

                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
                    <div className="space-y-2">
                        {MOBILE_PRIMARY_ITEMS.map(({ id, label, page, icon: Icon }) => {
                            const isMoreRow = id === 'more';
                            const isGamesRow = id === 'games';
                            const isActive = isMoreRow
                                ? MOBILE_MORE_ACTIVE_PAGES.has(activePage)
                                : isGamesRow
                                    ? MOBILE_GAMES_SUB_ITEMS.some((item) => item.page === activePage)
                                    : activePage === page;

                            const isOpen = isMoreRow ? mobileMoreOpen : isGamesRow ? mobileGamesOpen : false;

                            return (
                                <div
                                    key={id}
                                    className={
                                        isGamesRow
                                            ? `overflow-hidden rounded-xl border transition ${isActive
                                                ? 'border-[var(--color-accent-200)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(229,246,255,0.96)_100%)] shadow-[var(--shadow-brand-soft)]'
                                                : 'border-[var(--color-border-default)] bg-[var(--surface-base)]'
                                            }`
                                            : "overflow-hidden rounded-xl"
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isMoreRow) {
                                                handleMobileMoreToggle();
                                                return;
                                            }
                                            if (isGamesRow) {
                                                setMobileGamesOpen((open) => !open);
                                                return;
                                            }

                                            handleMobileNavigate(page);
                                        }}
                                        className={`flex min-h-[48px] w-full items-center gap-3 px-3.5 py-2.5 text-left transition ${isGamesRow
                                            ? ''
                                            : `rounded-xl border ${isActive
                                                ? 'nav-desktop-link-active'
                                                : 'border-[var(--color-border-default)] bg-[var(--surface-base)] text-[var(--color-text-main)] shadow-[var(--shadow-input)] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-surface-subtle)]'
                                            }`
                                            }`}
                                        aria-expanded={isOpen}
                                    >
                                        <span
                                            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isActive && !isGamesRow
                                                ? 'border-[var(--color-cta-border)] bg-white/20 text-[var(--color-cta-text)]'
                                                : 'border-[var(--color-border-brand)] bg-[var(--color-accent-50)] text-[var(--surface-utility-2)]'
                                                }`}

                                        >
                                            <Icon size={16} />
                                        </span>
                                        <span className="min-w-0 flex-1 text-base font-bold" style={{ fontFamily: 'var(--base-font-family)' }}>{label}</span>
                                        <ChevronRight
                                            size={17}
                                            className={`shrink-0 transition-transform ${(isMoreRow || isGamesRow) && isOpen ? 'rotate-90' : ''}`}
                                        />
                                    </button>

                                    {isGamesRow && mobileGamesOpen && (
                                        <div className="space-y-1 border-t border-[var(--color-border-brand)] px-1.5 pb-1.5 pt-1">
                                            <div className="mb-1 px-2 pt-1.5">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--base-font-family)' }}>
                                                    GAME CATEGORIES
                                                </p>
                                            </div>
                                            {MOBILE_GAMES_SUB_ITEMS.map((item) => {
                                                const itemActive = activePage === item.page;
                                                const ItemIcon = item.icon;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => handleMobileNavigate(item.page)}
                                                        className={`flex min-h-[42px] w-full items-center gap-2.5 rounded-xl pl-3 pr-3 py-2 text-left transition ${itemActive
                                                            ? 'bg-[linear-gradient(90deg,var(--color-brand-soft)_0%,rgba(255,255,255,0.96)_100%)] text-[var(--color-text-brand-soft)] shadow-[var(--shadow-brand-soft)]'
                                                            : 'bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-text-strong)]'
                                                            }`}
                                                        style={{ fontFamily: 'var(--base-font-family)' }}
                                                    >
                                                        <span
                                                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${itemActive
                                                                ? 'bg-white text-[var(--surface-utility-2)]'
                                                                : 'bg-[var(--color-accent-50)] text-[var(--surface-utility-2)]'
                                                                }`}
                                                        >
                                                            <ItemIcon size={14} />
                                                        </span>
                                                        <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
                                                        <ChevronRight size={14} className="shrink-0 opacity-70" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {isMoreRow && mobileMoreOpen && (
                                        <div className="mt-1.5 space-y-1.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] p-2">
                                            {MOBILE_MORE_SECTIONS.map(({ id: sectionId, label: sectionLabel, icon: SectionIcon, items }) => {
                                                const sectionHasActiveItem = items.some((item) => isMobileMoreItemActive(item));
                                                const sectionOpen = openMobileMoreSection === sectionId;

                                                return (
                                                    <div
                                                        key={sectionId}
                                                        className={`overflow-hidden rounded-xl border transition ${sectionHasActiveItem
                                                            ? 'border-[var(--color-accent-200)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(229,246,255,0.96)_100%)] shadow-[var(--shadow-brand-soft)]'
                                                            : 'border-[var(--color-border-default)] bg-[var(--surface-base)]'
                                                            }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMobileMoreSectionToggle(sectionId)}
                                                            className="flex min-h-[44px] w-full items-center gap-2.5 px-3.5 py-2.5 text-left"
                                                            aria-expanded={sectionOpen}
                                                        >
                                                            <span
                                                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border-brand)] bg-[var(--color-accent-50)] text-[var(--surface-utility-2)]"
                                                            >
                                                                <SectionIcon size={15} />
                                                            </span>
                                                            <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-subtle)]" style={{ fontFamily: 'var(--base-font-family)' }}>
                                                                {sectionLabel}
                                                            </span>
                                                            <ChevronRight
                                                                size={15}
                                                                className={`shrink-0 text-[var(--color-text-soft)] transition-transform ${sectionOpen ? 'rotate-90' : ''}`}
                                                            />
                                                        </button>

                                                        {sectionOpen && (
                                                            <div className="space-y-1 border-t border-[var(--color-border-brand)] px-1.5 pb-1.5 pt-1">
                                                                {items.map((item) => {
                                                                    const itemActive = isMobileMoreItemActive(item);
                                                                    const ItemIcon = item.icon;

                                                                    return (
                                                                        <button
                                                                            key={item.id}
                                                                            type="button"
                                                                            onClick={() => handleMobileMoreItemClick(item)}
                                                                            className={`flex min-h-[42px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition ${itemActive
                                                                                ? 'bg-[linear-gradient(180deg,var(--color-brand-soft)_0%,rgba(255,255,255,0.96)_100%)] text-[var(--color-text-brand-soft)] shadow-[var(--shadow-brand-soft)]'
                                                                                : 'bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-text-strong)]'
                                                                                }`}
                                                                        >
                                                                            <span
                                                                                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${itemActive
                                                                                    ? 'bg-white text-[var(--surface-utility-2)]'
                                                                                    : 'bg-[var(--color-accent-50)] text-[var(--surface-utility-2)]'
                                                                                    }`}
                                                                            >
                                                                                <ItemIcon size={14} />
                                                                            </span>
                                                                            <span className="min-w-0 flex-1 text-sm font-semibold" style={{ fontFamily: 'var(--base-font-family)' }}>{item.label}</span>
                                                                            <ChevronRight size={14} className="shrink-0 opacity-70" />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3">
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onLiveChatClick?.();
                            }}
                            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-accent-200)] bg-[linear-gradient(90deg,var(--color-brand-secondary)_0%,var(--color-brand-primary)_100%)] px-4 text-sm font-bold text-white shadow-[var(--shadow-brand-card)] transition hover:brightness-105"
                        >
                            <Headset size={16} />
                            Live Chat
                        </button>
                        {authUser ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onLogout?.();
                                }}
                                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border-brand)] bg-white px-4 text-sm font-semibold text-[var(--color-text-main)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-strong)]"
                            >
                                <LogOut size={15} />
                                Log Out
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleMobileDownloadApp}
                                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border-brand)] bg-white px-4 text-sm font-semibold text-[var(--color-text-main)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-strong)]"
                            >
                                <Smartphone size={15} />
                                App Download
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {navProviderDropdown != null && (
                <div
                    className={`fixed inset-x-0 bottom-0 z-[70] bg-[var(--color-nav-overlay)] backdrop-blur-[1px] pointer-events-none ${NAV_STICKY_SUBHEADER_TOP_CLASS}`}
                />
            )}
        </nav>
    );
}
