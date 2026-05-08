import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import WalletRebateSummaryBar, { WALLET_REBATE_BROWSE_PANEL_CLASS } from '../WalletRebateSummaryBar';

/**
 * UniversalModal - A single, reusable component for Game Pop-ups and Announcements.
 * Consolidates layout logic for both types while maintaining a premium, "Tidy" look.
 * Strictly uses theme.css tokens and z-index [100].
 */
const UniversalModal = ({
    isOpen,
    onClose,
    type = 'game', // 'game' | 'announcement'
    title = '',
    bannerImage = '',
    wallet = '0.00',
    membershipRebate = '0.00%',
    onStartGame,
    startLabel = 'Start Game',
    message = '',
    showCheckbox = true,
    checkboxLabel = 'Do not show again for the next hour',
    onCheckboxChange,
    closeLabel = 'CLOSE',
    logoUrl = '',
}) => {
    // Prevent body scroll when modal is active
    useBodyScrollLock(isOpen);

    // Escape key listener for accessibility
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isGame = type === 'game';

    return (
        <div 
            className="universal-modal-overlay" 
            onClick={onClose}
        >
            <div className="universal-modal-scroll-container">
                {/* Modal Container */}
                <section 
                    role="dialog"
                    aria-modal="true"
                    className={`universal-modal-container ${isGame ? 'max-w-[760px]' : 'max-w-[520px]'}`} 
                    onClick={e => e.stopPropagation()}
                >
                {/* Header Bar */}
                <header className="universal-modal-header">
                    <div className="flex items-center gap-3">
                        {!isGame && logoUrl && (
                            <img src={logoUrl} alt="Logo" className="h-[24px] w-auto object-contain" />
                        )}
                        <h2 className="universal-modal-title">
                            {isGame ? title : (!logoUrl ? title : '')}
                        </h2>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="universal-modal-close-btn"
                        aria-label="Close modal"
                    >
                        <X size={22} strokeWidth={2.5} />
                    </button>
                </header>

                {/* Content Body */}
                <div className={`universal-modal-content${isGame ? ' universal-modal-content--game' : ''}`}>
                    {/* Main Banner Image */}
                    {bannerImage && (
                        <div className="universal-modal-banner-wrapper">
                            <img 
                                src={bannerImage} 
                                alt={title || 'Banner'} 
                                className="universal-modal-banner-img" 
                            />
                        </div>
                    )}

                    {isGame ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className={`mt-5 ${WALLET_REBATE_BROWSE_PANEL_CLASS}`}>
                                <WalletRebateSummaryBar
                                    wallet={wallet}
                                    membershipRebate={membershipRebate}
                                    compact
                                    bare
                                    denseMobile
                                />
                            </div>

                            {/* Start Game Action */}
                            <div className="universal-modal-footer">
                                <button 
                                    type="button"
                                    onClick={onStartGame} 
                                    className="universal-modal-btn-primary"
                                >
                                    {startLabel}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Announcement Message */}
                            {message && (
                                <div className="universal-modal-message">
                                    {message}
                                </div>
                            )}
                            
                            <div className="universal-modal-footer flex-col !items-stretch">
                                {showCheckbox && (
                                    <label className="universal-modal-checkbox-wrapper">
                                        <input 
                                            type="checkbox" 
                                            onChange={onCheckboxChange} 
                                            className="universal-modal-checkbox" 
                                        />
                                        <span>{checkboxLabel}</span>
                                    </label>
                                )}
                                <button 
                                    type="button"
                                    onClick={onClose} 
                                    className="universal-modal-btn-secondary"
                                >
                                    {closeLabel}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    </div>
);
};

export default UniversalModal;
