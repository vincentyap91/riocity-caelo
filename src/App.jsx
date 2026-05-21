import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  clearAuthSession,
  isAuthSessionExpired,
  loadAuthSession,
  saveAuthSession,
} from './utils/authSessionStorage';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesRow from './components/FeaturesRow';
import HomeLiveActivity from './components/HomeLiveActivity';
import ReferralBannerSection from './components/home/ReferralBannerSection';
import GameCategories from './components/GameCategories';
import TopGames from './components/TopGames';
import VipTier from './components/VipTier';
import AppDownload from './components/AppDownload';
import Promos from './components/Promos';
import MobileHomeCategoryGames from './components/home/MobileHomeCategoryGames';
import MobileHomeBottomNav from './components/home/MobileHomeBottomNav';
import LoadingPage from './components/LoadingPage';
const LiveCasinoPage = React.lazy(() => import('./components/LiveCasinoPage'));
const SlotsPage = React.lazy(() => import('./components/SlotsPage'));
const AllGamesPage = React.lazy(() => import('./components/AllGamesPage'));
const SportsPage = React.lazy(() => import('./components/SportsPage'));
const EsportsPage = React.lazy(() => import('./components/EsportsPage'));
const LotteryPage = React.lazy(() => import('./components/LotteryPage'));
const FishingPage = React.lazy(() => import('./components/FishingPage'));
const PokerPage = React.lazy(() => import('./components/PokerPage'));
const HotGamesPage = React.lazy(() => import('./components/HotGamesPage'));
const GameDetailPage = React.lazy(() => import('./components/game-detail/GameDetailPage'));
const PromotionPage = React.lazy(() => import('./components/PromotionPage'));
const VipPage = React.lazy(() => import('./components/VipPage'));
const ReferralPage = React.lazy(() => import('./components/referral'));
const LiveChatPage = React.lazy(() => import('./components/LiveChatPage'));
import ProfilePage from './components/ProfilePage';
import AccountLayout from './components/AccountLayout';
import RegisterPage from './components/RegisterPage';
import VerificationPage from './components/VerificationPage';
import FavouritesPage from './components/FavouritesPage';
import MyBetsPage from './components/MyBetsPage';
import FeedbackPage from './components/FeedbackPage';
import HelpCenterPage from './components/HelpCenterPage';
import AboutUsPage from './components/AboutUsPage';
import SecurityPage from './components/SecurityPage';
import NotificationsPage from './components/NotificationsPage';
import RebatePage from './components/RebatePage';
import ReferralCommissionPage from './components/ReferralCommissionPage';
import HistoryRecordPage from './components/HistoryRecordPage';
import DepositPage from './components/DepositPage';
import WithdrawalPage from './components/WithdrawalPage';
import RewardsPage from './components/RewardsPage';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import AuthModal from './components/AuthModal';
import './index.css';
import LiveChatModal from './components/LiveChatModal';
import AnnouncementModal from './components/AnnouncementModal';

import { ReferralDataProvider } from './context/ReferralDataContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { ActionNotificationsProvider, useActionNotifications } from './context/ActionNotificationsContext';
import { PUSH_EVENT } from './constants/pushNotificationCopy';
import { REWARDS_PROGRAM_IDS } from './constants/rewardsPrograms';
import { HISTORY_RECORD_PAGE_IDS } from './constants/historyRecordPages';
import { parseGameDetailSlugFromPathname } from './utils/gameDetailRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ui/ScrollToTop';
import ThemeEditor from './components/ThemeEditor';

function resolvePageFromPath() {
  try {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname === '/casino' || pathname === '/live-casino') {
      return 'live-casino';
    }
    if (pathname === '/game' || pathname.startsWith('/game/')) {
      return 'game-detail';
    }
    if (pathname === '/slots') {
      return 'slots';
    }
    if (pathname === '/all-games' || pathname === '/games') {
      return 'all-games';
    }
    if (pathname === '/sports') {
      return 'sports';
    }
    if (pathname === '/e-sports' || pathname === '/esports') {
      return 'e-sports';
    }
    if (pathname === '/lottery' || pathname === '/rng') {
      return 'lottery';
    }
    if (pathname === '/fishing' || pathname === '/fish-hunt') {
      return 'fishing';
    }
    if (pathname === '/hot-games' || pathname === '/hot') {
      return 'hot-games';
    }
    if (pathname === '/poker') {
      return 'poker';
    }
    if (pathname === '/promotion' || pathname === '/promotions') {
      return 'promotion';
    }
    if (pathname === '/vip') {
      return 'vip';
    }
    if (pathname === '/referral') {
      return 'referral';
    }
    if (pathname === '/register') {
      return 'register';
    }
    if (pathname === '/profile' || pathname === '/account-details') {
      return 'profile';
    }
    if (pathname === '/loyalty-rewards' || pathname === '/loyalty') {
      return 'loyalty-rewards';
    }
    if (pathname === '/verification') {
      return 'verification';
    }
    if (pathname === '/favourites') {
      return 'favourites';
    }
    if (pathname === '/my-bets') {
      return 'my-bets';
    }
    if (pathname === '/feedback') {
      return 'feedback';
    }
    if (pathname === '/help' || pathname === '/help-center') {
      return 'help-center';
    }
    if (pathname === '/terms' || pathname === '/terms-and-conditions') {
      return 'help-center';
    }
    if (pathname === '/about' || pathname === '/about-us') {
      return 'about';
    }
    if (pathname === '/security') {
      return 'security';
    }
    if (pathname === '/notifications') {
      return 'notifications';
    }
    if (pathname === '/rebate') {
      return 'rebate';
    }
    if (pathname === '/referral-commission') {
      return 'referral-commission';
    }
    if (pathname === '/deposit') {
      return 'deposit';
    }
    if (pathname === '/withdrawal') {
      return 'withdrawal';
    }
    const historyRecordPage = HISTORY_RECORD_PAGE_IDS.find((id) => pathname === `/${id}`);
    if (historyRecordPage) {
      return historyRecordPage;
    }
    // Legacy app-download URLs render homepage (URL normalized in useEffect)
    if (pathname === '/app-download' || pathname === '/download' || pathname === '/mobile') {
      return 'home';
    }
    if (pathname === '/bet-slip') {
      return 'my-bets';
    }
    if (pathname === '/live-chat' || pathname === '/support') {
      return 'live-chat';
    }
    return 'home';
  } catch (err) {
    console.error('[resolvePageFromPath] Failed to resolve page from pathname:', err);
    return 'home';
  }
}


const DOWNLOAD_APP_HASH = '#download-app';
const PROTECTED_PAGE_IDS = new Set([
  'profile',
  'verification',
  'favourites',
  'my-bets',
  'loyalty-rewards',
  'feedback',
  'security',
  'notifications',
  'referral-commission',
  'deposit',
  'withdrawal',
  ...HISTORY_RECORD_PAGE_IDS,
]);

function isProtectedPage(pageId) {
  return PROTECTED_PAGE_IDS.has(pageId);
}

/** Inactivity-based sign-out (demo client guard). Session storage expiry is separate. */
const IDLE_LOGOUT_MS = 45 * 60 * 1000;

function AppInner() {
  const initialAuthUser = loadAuthSession();
  const { showPushNotification } = useActionNotifications();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [authUser, setAuthUser] = useState(initialAuthUser);
  const [balanceRefreshing, setBalanceRefreshing] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [page, setPage] = useState(() => {
    const nextPage = resolvePageFromPath();
    return !initialAuthUser && isProtectedPage(nextPage) ? 'home' : nextPage;
  });
  const [routePath, setRoutePath] = useState(() => {
    const nextPage = resolvePageFromPath();
    return !initialAuthUser && isProtectedPage(nextPage) ? '/' : window.location.pathname;
  });
  const [selectedCasinoProviderIdFromMenu, setSelectedCasinoProviderIdFromMenu] = useState(null);
  const [selectedSlotsProviderIdFromMenu, setSelectedSlotsProviderIdFromMenu] = useState(null);
  const [pageNavigationState, setPageNavigationState] = useState(null);
  const lastActivityRef = useRef(Date.now());

  const redirectToPublicHome = useCallback(({ openLogin = false, replace = true } = {}) => {
    const targetUrl = '/';
    const currentFullUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    setPage('home');
    setRoutePath('/');

    if (currentFullUrl !== targetUrl) {
      if (replace) {
        window.history.replaceState({}, '', targetUrl);
      } else {
        window.history.pushState({}, '', targetUrl);
      }
    }

    if (openLogin) {
      setLoginModalOpen(true);
    }
  }, []);

  const handleLogout = useCallback(
    (opts) => {
      const reason = opts && typeof opts === 'object' ? opts.reason : 'user';
      if (reason === 'session_expired') {
        showPushNotification({ event: PUSH_EVENT.SESSION_TIMEOUT });
      } else if (reason === 'idle') {
        showPushNotification({ event: PUSH_EVENT.AUTO_LOGOUT });
      } else {
        showPushNotification({ event: PUSH_EVENT.LOGOUT });
      }
      setAuthUser(null);
      clearAuthSession();
      setSelectedCasinoProviderIdFromMenu(null);
      setSelectedSlotsProviderIdFromMenu(null);
      if (isProtectedPage(page) || isProtectedPage(resolvePageFromPath())) {
        redirectToPublicHome({ replace: true });
      }
    },
    [page, redirectToPublicHome, showPushNotification]
  );

  const handleRefreshBalance = useCallback(() => {
    setBalanceRefreshing(true);
    const started = Date.now();
    const finish = () => {
      const elapsed = Date.now() - started;
      window.setTimeout(() => setBalanceRefreshing(false), Math.max(0, 320 - elapsed));
    };
    try {
      const sessionUser = loadAuthSession();
      setAuthUser((prev) => {
        if (!prev || !sessionUser) return prev;
        return {
          ...prev,
          balance: sessionUser.balance ?? prev.balance,
          name: sessionUser.name ?? prev.name,
          vipLevel: sessionUser.vipLevel ?? prev.vipLevel,
          notifications: sessionUser.notifications ?? prev.notifications,
        };
      });
    } finally {
      finish();
    }
  }, []);

  const handleLogin = useCallback((userOrUsername, options = {}) => {
    const { suppressLoginToast = false } = options;
    const user =
      typeof userOrUsername === 'object' && userOrUsername?.name
        ? userOrUsername
        : { name: userOrUsername || 'demo', balance: 'MYR 0.00', notifications: 1, vipLevel: 'Diamond' };
    setAuthUser(user);
    saveAuthSession(user);
    lastActivityRef.current = Date.now();
    const name = typeof userOrUsername === 'object' && userOrUsername?.name ? userOrUsername.name : userOrUsername;
    if (!suppressLoginToast) {
      showPushNotification({ event: PUSH_EVENT.LOGIN_SUCCESS, userName: name || user.name });
    }
    
    // Redirect to home page after successful login
    redirectToPublicHome({ replace: false });
  }, [showPushNotification, redirectToPublicHome]);

  useEffect(() => {
    if (!authUser) return undefined;
    const checkExpiry = () => {
      if (isAuthSessionExpired()) {
        handleLogout({ reason: 'session_expired' });
      }
    };
    const id = window.setInterval(checkExpiry, 60_000);
    document.addEventListener('visibilitychange', checkExpiry);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', checkExpiry);
    };
  }, [authUser, handleLogout]);

  useEffect(() => {
    if (!authUser) return undefined;
    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    const evs = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const interval = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_LOGOUT_MS) {
        handleLogout({ reason: 'idle' });
      }
    }, 30_000);
    return () => {
      evs.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(interval);
    };
  }, [authUser, handleLogout]);

  useEffect(() => {
    const onPopState = () => {
      const nextPage = resolvePageFromPath();
      if (!authUser && isProtectedPage(nextPage)) {
        redirectToPublicHome({ openLogin: true, replace: true });
        return;
      }
      setPage(nextPage);
      setPageNavigationState(null);
      setRoutePath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [authUser, redirectToPublicHome]);

  useEffect(() => {
    const nextPage = resolvePageFromPath();
    if (!authUser && isProtectedPage(nextPage)) {
      redirectToPublicHome({ openLogin: true, replace: true });
    }
  }, [authUser, redirectToPublicHome]);

  useEffect(() => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/app-download' || p === '/download' || p === '/mobile') {
      window.history.replaceState({}, '', `/${DOWNLOAD_APP_HASH}`);
    }
    if (p === '/terms' || p === '/terms-and-conditions') {
      window.history.replaceState({}, '', '/help#tc');
      window.dispatchEvent(new Event('hashchange'));
    }
  }, []);

  const scrollToDownloadAppSection = useCallback(() => {
    document.getElementById('download-app')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleDownloadAppClick = useCallback(() => {
    if (page === 'home') {
      scrollToDownloadAppSection();
      return;
    }
    setPage('home');
    if (window.location.pathname !== '/' || window.location.hash !== DOWNLOAD_APP_HASH) {
      window.history.pushState({}, '', `/${DOWNLOAD_APP_HASH}`);
    }
  }, [page, scrollToDownloadAppSection]);

  useEffect(() => {
    if (page !== 'home') {
      return undefined;
    }
    if (window.location.hash !== DOWNLOAD_APP_HASH) {
      return undefined;
    }
    const id = window.setTimeout(() => {
      scrollToDownloadAppSection();
    }, 100);
    return () => window.clearTimeout(id);
  }, [page, scrollToDownloadAppSection]);

  useEffect(() => {
    // Keep deep-link behavior for download section on home.
    if (page === 'home' && window.location.hash === DOWNLOAD_APP_HASH) {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [page]);

  useEffect(() => {
    // Show announcement modal on mount/refresh if we are on the homepage
    if (resolvePageFromPath() === 'home') {
      setAnnouncementModalOpen(true);
    }
  }, []);

    const handleNavigate = (targetPage, options) => {
      const settingsToProfile = { security: 'security', notifications: 'notifications' };
      const resolvedPage = settingsToProfile[targetPage] ?? targetPage;
    const pathByPage = {
      home: '/',
      'live-casino': '/casino',
      'game-detail': '/game',
      slots: '/slots',
      'all-games': '/all-games',
      sports: '/sports',
      'e-sports': '/e-sports',
      lottery: '/lottery',
      fishing: '/fishing',
      'hot-games': '/hot-games',
      poker: '/poker',
      promotion: '/promotion',
      vip: '/vip',
      referral: '/referral',
      'live-chat': '/live-chat',
      register: '/register',
      profile: '/profile',
      verification: '/verification',
      favourites: '/favourites',
      'my-bets': '/my-bets',
      'loyalty-rewards': '/loyalty-rewards',
      feedback: '/feedback',
      'help-center': '/help',
      about: '/about',
      security: '/security',
      notifications: '/notifications',
      rebate: '/rebate',
      'referral-commission': '/referral-commission',
      deposit: '/deposit',
      withdrawal: '/withdrawal',
      ...Object.fromEntries(HISTORY_RECORD_PAGE_IDS.map((id) => [id, `/${id}`])),
    };
    if (!authUser && isProtectedPage(resolvedPage)) {
      setLoginModalOpen(true);
      return;
    }
    const nextPath = pathByPage[resolvedPage] ?? pathByPage[targetPage] ?? '/';
    
    // If we're already on the same page, scroll to top (user "refresh" action)
    if (page === resolvedPage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (resolvedPage === 'home') {
        setAnnouncementModalOpen(true);
      }
    }

    setPage(resolvedPage);
    setPageNavigationState(options ?? null);

    const currentPath = window.location.pathname;
    let fullUrl = nextPath;
    if (resolvedPage === 'game-detail') {
      const slug = options?.gameSlug ?? options?.gameId;
      fullUrl = slug ? `/game/${encodeURIComponent(String(slug))}` : '/game';
    }
    if (resolvedPage === 'loyalty-rewards') {
      let tab = 'daily-bonus';
      if (options?.rewardsTab && REWARDS_PROGRAM_IDS.includes(options.rewardsTab)) {
        tab = options.rewardsTab;
      } else if (currentPath === '/loyalty-rewards' && window.location.hash) {
        const fromHash = window.location.hash.slice(1);
        if (REWARDS_PROGRAM_IDS.includes(fromHash)) tab = fromHash;
      }
      fullUrl = `/loyalty-rewards#${tab}`;
    }
    if (resolvedPage === 'deposit' && options?.depositBonusId) {
      fullUrl = `/deposit?bonus=${encodeURIComponent(String(options.depositBonusId))}`;
    }
    if (resolvedPage === 'help-center') {
      const helpTab = options?.helpTab;
      fullUrl = helpTab ? `/help#${encodeURIComponent(String(helpTab))}` : '/help';
    }

    const currentFull = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentFull !== fullUrl) {
      window.history.pushState({}, '', fullUrl);
      // pushState does not fire hashchange; rewards UI listens on hashchange for in-page tab switches
      if (resolvedPage === 'loyalty-rewards' || resolvedPage === 'help-center') {
        window.dispatchEvent(new Event('hashchange'));
      }
    }
    setRoutePath(window.location.pathname);
  };

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden font-sans ${
      page === 'home'
        ? 'bg-[var(--color-page-home)]'
        : page === 'register'
          ? 'bg-[var(--color-page-register)]'
          : page === 'slots' || page === 'game-detail'
            ? 'bg-[var(--color-page-default)]'
            : page === 'sports'
              ? 'bg-[var(--color-page-default)]'
              : page === 'e-sports'
                ? 'bg-[var(--color-page-default)]'
            : page === 'lottery'
              ? 'bg-[var(--color-page-default)]'
            : page === 'fishing'
              ? 'bg-[var(--color-page-default)]'
            : page === 'poker'
              ? 'bg-[var(--color-page-default)]'
            : page === 'promotion'
              ? 'bg-[var(--color-page-default)]'
            : page === 'vip'
              ? 'bg-[var(--color-page-default)]'
            : page === 'referral'
              ? 'bg-[var(--color-page-default)]'
            : page === 'about'
              ? 'bg-[var(--color-page-default)]'
            : page === 'rebate' && !authUser
              ? 'bg-[var(--color-page-default)]'
            : page === 'profile' || page === 'verification' || page === 'favourites' || page === 'my-bets' || page === 'loyalty-rewards' || page === 'feedback' || page === 'help-center' || page === 'security' || page === 'notifications' || page === 'rebate' || page === 'referral-commission' || page === 'deposit' || page === 'withdrawal' || HISTORY_RECORD_PAGE_IDS.includes(page)
              ? 'bg-[var(--color-page-account)]'
              : 'bg-[var(--color-page-default)]'
    }`}>
      <ScrollToTop authUser={authUser} />
      <FloatingSocials
        authUser={authUser}
        onLiveChatClick={() => setLiveChatOpen(true)}
        onClaimRewardsClick={() => handleNavigate('loyalty-rewards')}
      />

      <Navbar
        onNavigate={handleNavigate}
        onDownloadAppClick={handleDownloadAppClick}
        activePage={page}
        onLoginClick={() => {
          setAuthModalView('login');
          setLoginModalOpen(true);
        }}
        onRegisterClick={() => {
          setAuthModalView('register');
          setLoginModalOpen(true);
        }}
        authUser={authUser}
        onLogout={() => handleLogout({ reason: 'user' })}
        onAccountDetailsClick={() => handleNavigate('profile')}
        onLiveChatClick={() => setLiveChatOpen(true)}
        onTopLiveChatClick={() => handleNavigate('live-chat')}
        onCasinoProviderSelect={(menuProvider) => {
          setSelectedCasinoProviderIdFromMenu(menuProvider?.id ?? null);
          handleNavigate('live-casino');
        }}
        onSlotsProviderSelect={(menuProvider) => {
          setSelectedSlotsProviderIdFromMenu(menuProvider?.id ?? null);
          handleNavigate('slots');
        }}
        onRefreshBalance={authUser ? handleRefreshBalance : undefined}
        balanceRefreshing={balanceRefreshing}
      />

      <div className={page === 'home' ? 'max-md:pt-14 md:pt-[100px]' : 'pt-14 md:pt-[100px]'}>
      <ErrorBoundary>
      <Suspense fallback={<LoadingPage fullPage="overlay" minDelay={300} />}>
      {page === 'home' ? (
        <>
          <HeroSection />

          <MobileHomeCategoryGames onNavigate={handleNavigate} variant="mobile" />

          <div className="mx-auto hidden w-full max-w-screen-2xl flex-col gap-8 px-4 pb-10 md:flex md:px-8">
            <FeaturesRow />
            <GameCategories onNavigate={handleNavigate} />
            <TopGames onNavigate={handleNavigate} />
          </div>

          <div className="mx-auto flex w-full max-w-screen-2xl max-md:pb-24 flex-col gap-8 px-4 pb-10 md:px-8">
            <VipTier onNavigate={handleNavigate} />
            <MobileHomeCategoryGames onNavigate={handleNavigate} variant="desktop" />
            {authUser && <ReferralBannerSection onNavigate={handleNavigate} />}
            <HomeLiveActivity />
            <AppDownload />
            <Promos onNavigate={handleNavigate} />
          </div>

        </>
      ) : page === 'live-casino' ? (
        <LiveCasinoPage selectedProviderIdFromMenu={selectedCasinoProviderIdFromMenu} onNavigate={handleNavigate} />
      ) : page === 'game-detail' ? (
        <GameDetailPage
          onNavigate={handleNavigate}
          gameDetailSlug={parseGameDetailSlugFromPathname(routePath)}
        />
      ) : page === 'all-games' ? (
        <AllGamesPage onNavigate={handleNavigate} />
      ) : page === 'slots' ? (
        <SlotsPage selectedProviderIdFromMenu={selectedSlotsProviderIdFromMenu} onNavigate={handleNavigate} />
      ) : page === 'sports' ? (
        <SportsPage onNavigate={handleNavigate} />
      ) : page === 'e-sports' ? (
        <EsportsPage onNavigate={handleNavigate} />
      ) : page === 'lottery' ? (
        <LotteryPage onNavigate={handleNavigate} />
      ) : page === 'fishing' ? (
        <FishingPage onNavigate={handleNavigate} />
      ) : page === 'hot-games' ? (
        <HotGamesPage onNavigate={handleNavigate} />
      ) : page === 'poker' ? (
        <PokerPage onNavigate={handleNavigate} />
      ) : page === 'promotion' ? (
        <PromotionPage authUser={authUser} onNavigate={handleNavigate} />
      ) : page === 'vip' ? (
        <VipPage authUser={authUser} />
      ) : page === 'referral' ? (
        <ReferralPage
          authUser={authUser}
          onLoginClick={() => setLoginModalOpen(true)}
        />
      ) : page === 'profile' ? (
        <ProfilePage authUser={authUser} onLogout={handleLogout} onNavigate={handleNavigate} onLiveChatClick={() => handleNavigate('live-chat')} />
      ) : page === 'loyalty-rewards' ? (
        <AccountLayout activePage="loyalty-rewards" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <RewardsPage />
        </AccountLayout>
      ) : page === 'verification' ? (
        <AccountLayout activePage="verification" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <VerificationPage />
        </AccountLayout>
      ) : page === 'favourites' ? (
        <AccountLayout activePage="favourites" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <FavouritesPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'my-bets' ? (
        <AccountLayout activePage="my-bets" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <MyBetsPage />
        </AccountLayout>
      ) : page === 'feedback' ? (
        <AccountLayout activePage="feedback" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <FeedbackPage />
        </AccountLayout>
      ) : page === 'about' ? (
        <AboutUsPage />
      ) : page === 'help-center' ? (
        authUser ? (
          <AccountLayout activePage="help-center" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
            <HelpCenterPage navigationState={pageNavigationState} />
          </AccountLayout>
        ) : (
          <main className="w-full bg-[linear-gradient(180deg,var(--gradient-account-shell-start)_0%,var(--gradient-account-shell-mid)_38%,var(--gradient-account-shell-end)_100%)] pb-16 pt-6 md:pt-8">
            <HelpCenterPage navigationState={pageNavigationState} guestLayout />
          </main>
        )
      ) : page === 'security' ? (
        <AccountLayout activePage="security" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <SecurityPage authUser={authUser} />
        </AccountLayout>
      ) : page === 'notifications' ? (
        <AccountLayout activePage="notifications" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <NotificationsPage />
        </AccountLayout>
      ) : HISTORY_RECORD_PAGE_IDS.includes(page) ? (
        <AccountLayout activePage={page} authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <HistoryRecordPage activePage={page} />
        </AccountLayout>
      ) : page === 'rebate' ? (
        <main className="w-full bg-[linear-gradient(180deg,var(--gradient-account-shell-start)_0%,var(--gradient-account-shell-mid)_38%,var(--gradient-account-shell-end)_100%)] pb-16 pt-6 md:pt-8">
          <RebatePage 
            authUser={authUser} 
            onNavigate={handleNavigate} 
            onLoginClick={() => setLoginModalOpen(true)} 
            guestLayout={!authUser} 
          />
        </main>
      ) : page === 'referral-commission' ? (
        <AccountLayout activePage="referral-commission" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <ReferralCommissionPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'deposit' ? (
        <AccountLayout activePage="deposit" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <DepositPage onNavigate={handleNavigate} />
        </AccountLayout>
      ) : page === 'withdrawal' ? (
        <AccountLayout activePage="withdrawal" authUser={authUser} onNavigate={handleNavigate} onLogout={handleLogout} onLiveChatClick={() => handleNavigate('live-chat')}>
          <WithdrawalPage onNavigate={handleNavigate} navigationState={pageNavigationState} />
        </AccountLayout>
      ) : page === 'live-chat' ? (
        <LiveChatPage onNavigate={handleNavigate} authUser={authUser} />
      ) : (
        <RegisterPage
          onLoginClick={() => setLoginModalOpen(true)}
          onRegisterSuccess={(userName) => {
            showPushNotification({ event: PUSH_EVENT.REGISTER_SUCCESS, userName });
            handleLogin(userName, { suppressLoginToast: true });
            handleNavigate('home');
          }}
          onContactCustomerService={() => setLiveChatOpen(true)}
        />
      )}
      </Suspense>
      </ErrorBoundary>

      {page !== 'live-chat' && (
        <Footer
          onNavigate={handleNavigate}
          onLiveChatClick={() => setLiveChatOpen(true)}
          mobileVisualTone={page === 'referral-commission' || page === 'rebate' ? 'softer' : 'default'}
          className="max-md:pb-24"
        />
      )}
      </div>

      {page !== 'live-chat' && (
        <MobileHomeBottomNav
          activePage={page}
          authUser={authUser}
          onNavigate={handleNavigate}
          onLiveChatClick={() => setLiveChatOpen(true)}
          onLoginClick={() => {
            setAuthModalView('login');
            setLoginModalOpen(true);
          }}
        />
      )}

      <AuthModal
        open={loginModalOpen}
        initialView={authModalView}
        onClose={() => setLoginModalOpen(false)}
        onAuthSuccess={(userOrUsername) => {
          handleLogin(userOrUsername);
          setLoginModalOpen(false);
          if (page === 'register') {
            handleNavigate('home');
          }
        }}
        onCustomerServiceClick={() => {
          setLoginModalOpen(false);
          setLiveChatOpen(true);
        }}
      />

      <LiveChatModal
        open={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        authUser={authUser}
      />

      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
      />
      <ThemeEditor />
    </div>
  );
}

export default function App() {
  return (
    <ReferralDataProvider>
      <FavouritesProvider>
        <ActionNotificationsProvider>
          <AppInner />
        </ActionNotificationsProvider>
      </FavouritesProvider>
    </ReferralDataProvider>
  );
}
