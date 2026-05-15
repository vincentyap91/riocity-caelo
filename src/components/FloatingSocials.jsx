import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import rewardButtonImage from '../assets/reward.png';

// Keep this label as a plain string for easier future multilingual updates.
const CLAIM_REWARDS_LABEL = 'Rewards';

export default function FloatingSocials({ authUser, onLiveChatClick, onClaimRewardsClick, className = '' }) {
    const unreadCount = 2;
    const showRewardsButton = Boolean(authUser);
    const [isRightHovered, setIsRightHovered] = useState(false);

    return (
        <>
            {/* Mobile: Rewards only (after login) - remains fixed as per mobile UX standards */}
            {showRewardsButton && (
                <button
                    type="button"
                    onClick={onClaimRewardsClick}
                    className="claim-rewards-pulse fixed bottom-24 right-4 z-[130] inline-flex h-[72px] w-[72px] items-center justify-center transition-all hover:brightness-105 active:scale-95 md:hidden"
                    aria-label={CLAIM_REWARDS_LABEL}
                    title={CLAIM_REWARDS_LABEL}
                >
                    <img
                        src={rewardButtonImage}
                        alt={CLAIM_REWARDS_LABEL}
                        className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
                    />
                    <span className="pointer-events-none absolute bottom-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold leading-none text-[rgb(133_72_20)]">
                        {CLAIM_REWARDS_LABEL}
                    </span>
                </button>
            )}

            {/* Desktop Right: Combined Widgets (Slide-in) */}
            <div 
                className="fixed right-0 bottom-10 z-[140] hidden md:flex flex-col items-end gap-3 group"
                onMouseEnter={() => setIsRightHovered(true)}
                onMouseLeave={() => setIsRightHovered(false)}
            >
                {/* Wider trigger area for easier interaction */}
                <div className="absolute right-0 top-0 w-12 h-full cursor-pointer z-10" />

                {/* Rewards (Top) */}
                {showRewardsButton && (
                    <div 
                        className={`transition-all duration-500 ease-out flex flex-row-reverse items-center gap-2 ${isRightHovered ? '-translate-x-4' : 'translate-x-[calc(100%-12px)]'}`}
                    >
                        <div className={`h-16 w-1.5 bg-[var(--color-brand-primary)] rounded-full transition-opacity duration-300 ${isRightHovered ? 'opacity-0' : 'opacity-40 animate-pulse'}`} />
                        <button
                            type="button"
                            onClick={onClaimRewardsClick}
                            className="claim-rewards-pulse relative inline-flex h-[82px] w-[82px] items-center justify-center hover:brightness-105 transition-all hover:scale-105 active:scale-95"
                            aria-label={CLAIM_REWARDS_LABEL}
                            title={CLAIM_REWARDS_LABEL}
                        >
                            <img
                                src={rewardButtonImage}
                                alt={CLAIM_REWARDS_LABEL}
                                className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
                            />
                            <span className="pointer-events-none absolute bottom-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] font-bold leading-none text-[rgb(133_72_20)]">
                                {CLAIM_REWARDS_LABEL}
                            </span>
                        </button>
                    </div>
                )}

                {/* Live Chat (Bottom) */}
                <div 
                    className={`transition-all duration-500 ease-out flex flex-row-reverse items-center gap-2 ${isRightHovered ? '-translate-x-4' : 'translate-x-[calc(100%-12px)]'}`}
                >
                    <div className={`h-12 w-1.5 bg-[var(--color-accent-500)] rounded-full transition-opacity duration-300 ${isRightHovered ? 'opacity-0' : 'opacity-40 animate-pulse'}`} />
                    <button
                        type="button"
                        onClick={onLiveChatClick}
                        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-brand-deep)_100%)] text-white shadow-[var(--shadow-nav-pill)] transition hover:brightness-110 hover:scale-105 active:scale-95"
                        title="Live Chat"
                        aria-label="Open live chat"
                    >
                        <MessageCircle size={24} />
                        <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-[var(--color-danger-main)] px-1 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}

