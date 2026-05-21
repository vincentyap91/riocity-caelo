import React from 'react';
import { getHomeHotProviders } from '../../constants/homeHotProviders';
import { HOME_MARQUEE_DURATION_PROVIDERS } from '../../constants/homeSections';
import HomeHorizontalMarquee from './HomeHorizontalMarquee';

function ProviderLogoTile({ provider, onSelect }) {
    return (
        <button
            type="button"
            onClick={() => onSelect?.(provider)}
            className="group flex h-14 w-[5.5rem] shrink-0 items-center justify-center px-1 transition duration-300 ease-out hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] sm:w-24 md:h-16 md:w-28 lg:w-32"
            aria-label={provider.name}
        >
            <img
                src={provider.src}
                alt=""
                className="max-h-9 w-full max-w-full object-contain object-center transition duration-300 group-hover:scale-105 md:max-h-11 lg:max-h-12"
                draggable={false}
            />
        </button>
    );
}

/**
 * Hot Providers — logos on page background, no bordered provider cards (screenshot layout).
 */
export default function ProviderShowcaseSection({ onSlotsProviderSelect, onNavigate }) {
    const providers = getHomeHotProviders();

    const handleProviderClick = (provider) => {
        if (onSlotsProviderSelect) {
            onSlotsProviderSelect({ id: provider.id, gameProvider: provider.gameProvider });
            return;
        }
        onNavigate?.('slots');
    };

    if (!providers.length) {
        return null;
    }

    const trackItems = [...providers, ...providers];

    return (
        <section aria-label="Hot providers" className="w-full pt-4">
            <h2 className="mb-4 text-base font-bold tracking-tight text-[var(--color-brand-primary)] md:text-lg">
                Hot Providers
            </h2>

            <HomeHorizontalMarquee
                ariaLabel="Hot provider logos"
                durationSeconds={HOME_MARQUEE_DURATION_PROVIDERS}
                className="md:mx-auto md:max-w-full"
            >
                {trackItems.map((provider, index) => (
                    <ProviderLogoTile
                        key={`${provider.id}-${index}`}
                        provider={provider}
                        onSelect={handleProviderClick}
                    />
                ))}
            </HomeHorizontalMarquee>
        </section>
    );
}
