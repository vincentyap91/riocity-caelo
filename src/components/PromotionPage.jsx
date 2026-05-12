import React, { useEffect, useMemo, useRef, useState } from 'react';
import PromotionDetailModal from './PromotionDetailModal';
import PromotionCtaButton from './promotion/PromotionCtaButton';
import PromotionStyleTabs from './PromotionStyleTabs';
import CountdownTimer from './ui/CountdownTimer';
import welcomeBonusImage from '../assets/promotion/welcome-bonus.jpg';
import dailyReloadImage from '../assets/promotion/daily-unlimited-reload-bonus.jpg';
import welcome500Image from '../assets/promotion/welcome-500-bonus.jpg';
import freeSpinImage from '../assets/promotion/free-spin-bonus.jpg';
import exclusiveOfferImage from '../assets/promotion/exclusive-offer.jpg';
import instantCashRebateImage from '../assets/promotion/instant-cash-rebate.jpg';

const promotionCategories = ['All', 'Slots', 'Casino', 'Sports', 'Fishing', 'RNG', 'Lottery', 'Others'];
const MOBILE_BATCH_SIZE = 6;

const promotions = [
    {
        id: 'welcome-288',
        claimDepositBonusId: 'w288',
        category: 'Casino',
        title: 'Welcome Bonus 288%',
        description: 'Kickstart your first deposit with a boosted welcome package made for casino players.',
        image: welcomeBonusImage,
        endDate: '2026-06-15T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 50',
            bonus: '288%',
            maxBonus: 'MYR 1,000',
            turnover: '38x',
            validityPeriod: '30 Days',
        },
        applySteps: [
            'Register a MYR account and complete your first qualifying deposit.',
            'Select this welcome promotion before confirming the deposit amount.',
            'The bonus is credited after the deposit is successful and the promotion is activated.',
            'Complete the turnover requirement within the validity period to unlock the full reward.',
        ],
        providers: ['W Casino', 'SA Gaming', 'Evolution Gaming', 'Playtech LiveCasino'],
    },
    {
        id: 'welcome-500',
        claimDepositBonusId: 'w100s',
        category: 'Slots',
        title: 'Welcome Bonus 500%',
        description: 'Spin into your first slot session with a high-value new member bonus and extra credits.',
        image: welcome500Image,
        endDate: '2026-05-31T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 30',
            bonus: '500%',
            maxBonus: 'MYR 2,500',
            turnover: '35x',
            validityPeriod: '14 Days',
        },
        applySteps: [
            'Log in to your account and choose the Welcome Bonus 500% campaign.',
            'Make a qualifying first deposit into your slots wallet.',
            'Use the bonus balance on eligible slot games during the promotion period.',
            'Meet the turnover requirement before the reward expires.',
        ],
        providers: ['Pragmatic Play', 'PG Soft', 'Joker', 'JILI'],
    },
    {
        id: 'daily-reload',
        claimDepositBonusId: 'dr10s',
        category: 'Slots',
        title: 'Daily Unlimited Reload',
        description: 'Reload daily and keep the momentum going with extra value on every qualifying top up.',
        image: dailyReloadImage,
        endDate: '2026-05-12T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 20',
            bonus: '10%',
            maxBonus: 'MYR 300',
            turnover: '18x',
            validityPeriod: 'Daily',
        },
        applySteps: [
            'Open the reload promotion before making a qualifying daily deposit.',
            'Deposit the minimum amount into your slots wallet.',
            'Claim the bonus from the promotion panel after the deposit is completed.',
            'Use the bonus on participating slot providers within the same day.',
        ],
        providers: ['JDB', 'CQ9', 'Spadegaming', 'Live22'],
    },
    {
        id: 'free-spin-weekend',
        claimDepositBonusId: 'w100f',
        category: 'Fishing',
        title: 'Free Spin Weekend',
        description: 'Unlock weekend rewards with bonus spins and more chances to land standout wins.',
        image: freeSpinImage,
        endDate: '2026-05-18T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 30',
            bonus: '50 Free Spins',
            maxBonus: 'MYR 188',
            turnover: '20x',
            validityPeriod: 'Weekend Only',
        },
        applySteps: [
            'Opt in to the weekend campaign from the promotion page.',
            'Complete a qualifying deposit during the weekend window.',
            'Free spins are released to your account after the campaign is activated.',
            'Finish the required playthrough before Monday reset.',
        ],
        providers: ['JILI Fishing', 'Booming Fishing', 'KA Gaming'],
    },
    {
        id: 'sports-exclusive',
        claimDepositBonusId: 'w100sp',
        category: 'Sports',
        title: 'Exclusive Sports Offer',
        description: 'Back the big fixtures with exclusive odds support and limited-time sports rewards.',
        image: exclusiveOfferImage,
        endDate: '2026-05-20T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 50',
            bonus: '15%',
            maxBonus: 'MYR 500',
            turnover: '8x',
            validityPeriod: '7 Days',
        },
        applySteps: [
            'Activate the sports offer from your promotion list.',
            'Deposit into your sports wallet and place qualifying pre-match or live bets.',
            'Bonus funds are credited after the first eligible settled bet.',
            'Roll over the requirement on sports markets before the validity period ends.',
        ],
        providers: ['SBO Sports', 'CMD Sports', 'Virtual Sports'],
    },
    {
        id: 'instant-cash-rebate',
        claimDepositBonusId: 'w100rl',
        category: 'RNG',
        title: 'Instant Cash Rebate',
        description: 'Enjoy instant rebate returns across selected RNG games to keep every session moving.',
        image: instantCashRebateImage,
        endDate: '2026-07-01T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 20',
            bonus: '1.2% Rebate',
            maxBonus: 'MYR 888',
            turnover: 'No Turnover',
            validityPeriod: 'Daily',
        },
        applySteps: [
            'Play eligible RNG games during the campaign period.',
            'Accumulate net losses on participating products.',
            'Rebate is calculated automatically after the settlement cut-off.',
            'Claim or use the credited rebate during the daily validity window.',
        ],
        providers: ['Microgaming', 'PNG', 'Red Tiger', 'NetEnt'],
    },
    {
        id: 'lottery-daily-pick',
        claimDepositBonusId: 'w100rl',
        category: 'Lottery',
        title: 'Daily Pick Bonus',
        description: 'Get more value on eligible daily picks with a simple lottery-focused extra reward.',
        image: welcomeBonusImage,
        endDate: '2026-05-14T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 10',
            bonus: '12%',
            maxBonus: 'MYR 120',
            turnover: '6x',
            validityPeriod: '24 Hours',
        },
        applySteps: [
            'Select the Daily Pick Bonus before placing qualifying lottery entries.',
            'Deposit the minimum amount and submit your picks within the same day.',
            'The bonus is credited after your entry is confirmed successfully.',
            'Use the reward on eligible lottery products before the daily reset.',
        ],
        providers: ['4D Lottery', 'Magnum', 'Sports Toto'],
    },
    {
        id: 'special-member-deal',
        claimDepositBonusId: 'w100s',
        category: 'Others',
        title: 'Special Member Deal',
        description: 'A flexible all-round promotion crafted for members looking for extra value beyond core games.',
        image: exclusiveOfferImage,
        endDate: '2026-05-25T23:59:59',
        eventDetails: {
            minDeposit: 'MYR 50',
            bonus: '18%',
            maxBonus: 'MYR 688',
            turnover: '22x',
            validityPeriod: '10 Days',
        },
        applySteps: [
            'Open the special member deal from the promotion list.',
            'Make a qualifying deposit on any supported wallet.',
            'Choose the preferred participating provider after the bonus is credited.',
            'Complete the required turnover within the campaign validity period.',
        ],
        providers: ['Slots', 'Live Casino', 'Sports', 'Lottery'],
    },
];

export default function PromotionPage({ authUser, onNavigate }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [visibleCount, setVisibleCount] = useState(MOBILE_BATCH_SIZE);
    const hasUserScrolledRef = useRef(false);

    const filteredPromotions = useMemo(() => {
        if (activeCategory === 'All') return promotions;
        return promotions.filter((promotion) => promotion.category === activeCategory);
    }, [activeCategory]);

    const visiblePromotions = useMemo(
        () => filteredPromotions.slice(0, visibleCount),
        [filteredPromotions, visibleCount]
    );

    const hasMorePromotions = visiblePromotions.length < filteredPromotions.length;

    const loadMorePromotions = () => {
        setVisibleCount((current) =>
            current >= filteredPromotions.length
                ? current
                : Math.min(current + MOBILE_BATCH_SIZE, filteredPromotions.length)
        );
    };

    useEffect(() => {
        setVisibleCount(MOBILE_BATCH_SIZE);
        hasUserScrolledRef.current = false;
    }, [activeCategory]);

    useEffect(() => {
        if (!hasMorePromotions) return undefined;

        const handleScroll = () => {
            if (window.scrollY > 0) {
                hasUserScrolledRef.current = true;
            }

            if (!hasUserScrolledRef.current) return;

            const reachedBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

            if (reachedBottom) {
                loadMorePromotions();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMorePromotions, filteredPromotions.length]);

    return (
        <main className="w-full bg-[var(--color-page-default)] pb-14">
            <div className="mx-auto w-full max-w-screen-2xl px-4 py-4 md:px-8 md:py-6">
                <h1 className="page-title">Promotion</h1>

                    <PromotionStyleTabs
                        variant="panel"
                        panelClassName="mt-5"
                        items={promotionCategories}
                        value={activeCategory}
                        onChange={setActiveCategory}
                        ariaLabel="Promotion categories"
                    />

                    <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6">
                        {visiblePromotions.map((promotion, index) => (
                            <article
                                key={promotion.id}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgb(228_234_243)] bg-[var(--color-surface-base)] shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                            >
                                <div className="relative w-full shrink-0 overflow-hidden border-b border-[rgb(228_234_243)]">
                                    <img
                                        src={promotion.image}
                                        alt={promotion.title}
                                        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                </div>
                                <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 px-4 py-4 md:px-5 md:py-5">
                                    <div className="space-y-2">
                                        <span className="inline-flex rounded-full bg-[var(--color-accent-50)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-accent-700)]">
                                            {promotion.category}
                                        </span>
                                        <h2 className="text-lg font-bold leading-tight tracking-tight text-[var(--color-text-strong)] md:text-xl">
                                            {promotion.title}
                                        </h2>
                                        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                                            {promotion.description}
                                        </p>
                                    </div>

                                    {promotion.endDate && (
                                        <div className="pt-0.5">
                                            <CountdownTimer endDate={promotion.endDate} size="card" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPromotion(promotion)}
                                            className="inline-flex h-10 min-w-[100px] flex-1 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-white px-4 text-sm font-bold text-[var(--color-text-main)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                                        >
                                            More Info
                                        </button>
                                        <PromotionCtaButton
                                            authUser={authUser}
                                            onNavigate={onNavigate}
                                            promotion={promotion}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    {hasMorePromotions && (
                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                onClick={loadMorePromotions}
                                className="btn-theme-cta inline-flex min-h-11 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold tracking-wide shadow-[0_6px_14px_rgba(242,154,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                            >
                                Load More
                            </button>
                        </div>
                    )}

                    {filteredPromotions.length === 0 && (
                        <div className="surface-card mt-8 rounded-2xl px-6 py-12 text-center">
                            <p className="text-lg font-bold text-[var(--color-text-strong)]">No promotions in this category yet.</p>
                            <p className="mt-2 text-sm text-[var(--color-text-muted)]">Try another category to view available offers.</p>
                        </div>
                    )}
            </div>

            <PromotionDetailModal
                open={Boolean(selectedPromotion)}
                onClose={() => setSelectedPromotion(null)}
                bannerImage={selectedPromotion?.image}
                title={selectedPromotion?.title}
                category={selectedPromotion?.category}
                description={selectedPromotion?.description}
                endDate={selectedPromotion?.endDate}
                eventDetails={selectedPromotion?.eventDetails}
                applySteps={selectedPromotion?.applySteps}
                providers={selectedPromotion?.providers}
            />
        </main>
    );
}


