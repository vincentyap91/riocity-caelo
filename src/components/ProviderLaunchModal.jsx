import React from 'react';
import UniversalModal from './ui/UniversalModal';

/**
 * ProviderLaunchModal - Refactored to use UniversalModal.
 */
export default function ProviderLaunchModal({
    open,
    onClose,
    title,
    bannerImage,
    wallet = '0.00',
    membershipRebate = '0.00%',
    onStartGame,
    startLabel = 'Start Game',
}) {
    return (
        <UniversalModal
            isOpen={open}
            onClose={onClose}
            type="game"
            title={title}
            bannerImage={bannerImage}
            wallet={wallet}
            membershipRebate={membershipRebate}
            onStartGame={onStartGame}
            startLabel={startLabel}
        />
    );
}
