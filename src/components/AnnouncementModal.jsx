import React from 'react';
import UniversalModal from './ui/UniversalModal';

/**
 * AnnouncementModal - Refactored to use UniversalModal.
 */
export default function AnnouncementModal({ isOpen, onClose }) {
    return (
        <UniversalModal
            isOpen={isOpen}
            onClose={onClose}
            type="announcement"
            logoUrl="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp"
            bannerImage="https://pksoftcdn.azureedge.net/media/photo_2025-11-28_14-33-32-202511281531246740-202512081112519749-202604010908201320.webp"
            showCheckbox={true}
            checkboxLabel="Do not show again for the next hour"
            closeLabel="CLOSE"
        />
    );
}
