import React, { useState } from 'react';
import { Copy, Check, Share2, Users } from 'lucide-react';
import referralBg from '../../assets/referral-image.jpg';
import mobileReferralBg from '../../assets/mobile-referral.jpg';

const REFERRAL_CODE = '024555';
const REFERRAL_URL =
    typeof window !== 'undefined'
        ? `${window.location.origin}/en/register?code=${REFERRAL_CODE}`
        : `https://staging.riocity9.com/en/register?code=${REFERRAL_CODE}`;

/* ─── Shared button styles ─────────────────────── */
const THEME_CTA_BTN = {
    background: 'var(--gradient-cta)',
    color: 'var(--color-cta-text)',
    boxShadow: 'var(--shadow-cta-soft)',
};

const THEME_BLUE_BTN = {
    background: 'var(--color-accent-600)',
    color: '#ffffff',
    boxShadow: 'var(--shadow-accent)',
};

/* ─── Sub-components ────────────────────────────── */

/** Mobile layout: image header + theme-matched button strip */
function MobileLayout({ onNavigate, onShare, copied, onCopy }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl md:hidden">
            {/* Top: mobile referral image */}
            <img
                src={mobileReferralBg}
                alt="Referral – Invite friends and earn"
                className="w-full h-auto block object-cover object-center"
                draggable={false}
            />

            {/* Bottom: themed action strip */}
            <div
                className="w-full px-4 py-5 flex flex-col gap-3"
                style={{ background: 'var(--color-brand-deep)' }}
            >
                {/* Share + Downlines row */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        id="mob-referral-share-btn"
                        onClick={onShare}
                        className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                        style={THEME_BLUE_BTN}
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                    <button
                        type="button"
                        id="mob-referral-downlines-btn"
                        onClick={() => onNavigate?.('referral')}
                        className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                        style={THEME_CTA_BTN}
                    >
                        <Users size={16} />
                        Downlines
                    </button>
                </div>

                {/* More Info full-width */}
                <button
                    type="button"
                    id="mob-referral-more-info-btn"
                    onClick={() => onNavigate?.('referral')}
                    className="w-full rounded-xl py-3.5 text-base font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                    style={THEME_CTA_BTN}
                >
                    More Info
                </button>
            </div>
        </div>
    );
}

/** Desktop layout: full background image with glassmorphism card overlay */
function DesktopLayout({ onNavigate, onShare, copied, onCopy }) {
    return (
        <div className="relative hidden w-full overflow-hidden rounded-2xl md:block">
            {/* Background image defines height */}
            <img
                src={referralBg}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="w-full h-auto block object-cover object-center"
            />

            {/* Dark overlay for card readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/0 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 z-10 flex items-center p-4">
                <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
                    {/* Glassmorphism card */}
                    <div
                        className="w-full shrink-0 rounded-2xl p-6 md:max-w-[360px] lg:max-w-[380px] lg:ml-[2%]"
                        style={{
                            background: 'rgba(255,255,255,0.14)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            border: '1px solid rgba(255,255,255,0.28)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
                        }}
                    >
                        <h2 className="text-lg font-bold leading-tight text-white lg:text-xl">
                            Your Unique Referral Hub
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-[#7dd3fc]">
                            Share &amp; Grow Your Network
                        </p>

                        {/* Referral link field */}
                        <div className="mt-4">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                                My Referral Link
                            </p>
                            <div
                                className="flex items-center gap-2 rounded-xl px-3 py-2"
                                style={{
                                    background: 'rgba(255,255,255,0.18)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                }}
                            >
                                <input
                                    type="text"
                                    value={REFERRAL_URL}
                                    readOnly
                                    aria-label="Referral link"
                                    className="min-w-0 flex-1 bg-transparent text-[11px] font-mono text-white outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={onCopy}
                                    aria-label="Copy referral link"
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    {copied ? (
                                        <Check size={14} className="text-emerald-300" />
                                    ) : (
                                        <Copy size={14} className="text-white" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Share + Downlines row */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                id="referral-banner-share-btn"
                                onClick={onShare}
                                className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                                style={THEME_BLUE_BTN}
                            >
                                <Share2 size={14} />
                                Share
                            </button>
                            <button
                                type="button"
                                id="referral-banner-downlines-btn"
                                onClick={() => onNavigate?.('referral')}
                                className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                                style={THEME_CTA_BTN}
                            >
                                <Users size={14} />
                                Downlines
                            </button>
                        </div>

                        {/* More Info full-width */}
                        <button
                            type="button"
                            id="referral-banner-more-info-btn"
                            onClick={() => onNavigate?.('referral')}
                            className="mt-2.5 w-full rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                            style={THEME_CTA_BTN}
                        >
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main export ───────────────────────────────── */
export default function ReferralBannerSection({ onNavigate }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(REFERRAL_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: 'Join me!',
                    text: `Use my referral code ${REFERRAL_CODE} when you sign up!`,
                    url: REFERRAL_URL,
                })
                .catch(() => { });
        } else {
            handleCopy();
        }
    };

    const sharedProps = {
        onNavigate,
        onShare: handleShare,
        onCopy: handleCopy,
        copied,
    };

    return (
        <section aria-label="Referral banner" className="w-full">
            <MobileLayout {...sharedProps} />
            <DesktopLayout {...sharedProps} />
        </section>
    );
}
