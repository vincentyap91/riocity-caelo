import React, { useState } from 'react';
import {
    Banknote,
    ChevronDown,
    Landmark,
    Mail,
    PencilLine,
    Phone,
    Trash2,
    UserCircle2,
} from 'lucide-react';
import AccountLayout from './AccountLayout';
import ProfilePhotoModal from './ProfilePhotoModal';
import VipStatusPill from './VipStatusPill';
import CurrentPromoSection from './slots/CurrentPromoSection';
import useSlotCurrentPromo from '../hooks/useSlotCurrentPromo';
import { PROFILE_SHOW_ACTIVE_PROMO } from '../constants/slotCurrentPromo';
import { BANKS } from '../constants/banks';
import { getVipStatus } from '../constants/vipStatus';
import { PROFILE_NEXT_VIP_TIER, PROFILE_VIP_PROGRESS_PERCENT, PROFILE_VIP_TIER } from '../constants/profileVipTier';

const PROFILE_PHOTO_STORAGE_KEY = 'riocity_profile_photo';

function readStoredProfilePhoto() {
    try {
        return localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY);
    } catch {
        return null;
    }
}

const personalFields = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'referralCode', label: 'Referral Code' },
    { key: 'referralLink', label: 'Referral Link' },
    { key: 'rank', label: 'Rank' },
    { key: 'birthday', label: 'Birthday' },
    { key: 'gender', label: 'Gender' }
];

const contactFields = [
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone Number', type: 'tel' }
];


/** ISO date `yyyy-mm-dd` → display `mm/dd/yyyy` (matches account summary style). */
function formatBirthdayDisplay(iso) {
    if (!iso) return '—';
    const parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    const [y, m, d] = parts;
    if (!y || !m || !d) return iso;
    return `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
}

function ReadOnlyValue({ label, value, singleLineEllipsis = false }) {
    if (singleLineEllipsis) {
        const display = typeof value === 'string' ? value : '';
        return (
            <div className="block">
                <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">{label}</span>
                <div className="flex h-12 min-h-12 items-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 shadow-[var(--shadow-subtle)]">
                    <input
                        type="text"
                        readOnly
                        aria-readonly="true"
                        value={display}
                        placeholder={display === '' ? '—' : undefined}
                        title={display || undefined}
                        className="min-w-0 w-full cursor-text bg-transparent text-sm font-medium text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] overflow-hidden text-ellipsis whitespace-nowrap"
                    />
                </div>
            </div>
        );
    }
    return (
        <div className="block">
            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">{label}</span>
            <div className="flex h-12 items-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] select-none">
                <span className="min-w-0 break-all">{value || '—'}</span>
            </div>
        </div>
    );
}

function Field({ label, value, placeholder, type = 'text', editable, onChange, icon: Icon }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">{label}</span>
            <div
                className={`group flex h-12 items-center gap-3 rounded-xl border px-4 shadow-[var(--shadow-subtle)] transition-all focus-within:border-[var(--color-accent-400)] focus-within:ring-2 focus-within:ring-[rgb(96_165_250_/_0.2)] ${
                    editable
                        ? 'border-[var(--color-accent-300)] bg-[var(--color-surface-base)] hover:border-[var(--color-accent-400)]'
                        : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] hover:border-[var(--color-accent-200)]'
                }`}
            >
                {Icon && (
                    <Icon
                        size={18}
                        className={`shrink-0 transition-colors ${editable ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'}`}
                    />
                )}
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    disabled={!editable}
                    onChange={onChange}
                    className={`w-full bg-transparent text-sm font-medium outline-none ${
                        editable ? 'text-[var(--color-text-strong)]' : 'text-[var(--color-text-muted)]'
                    } placeholder:text-[var(--color-text-soft)] disabled:cursor-not-allowed`}
                />
            </div>
        </label>
    );
}

function SectionCard({ title, description, editing, onToggleEdit, children, actions, showEditButton = true }) {
    return (
        <section className="surface-card rounded-2xl p-6 transition-all md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">{title}</h2>
                    {description && (
                        <p className="mt-1 text-xs font-medium leading-snug text-[var(--color-text-muted)] md:text-sm">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {actions}
                    {showEditButton ? (
                        <button
                            type="button"
                            onClick={onToggleEdit}
                            aria-pressed={editing}
                            className="btn-theme-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                        >
                            <PencilLine size={16} />
                            {editing ? 'Save' : 'Edit'}
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="mt-6">{children}</div>
        </section>
    );
}

function ProfileVipProgressSection({ targetTier, progressPercent, tier, showTierHeader = false, variant = 'inline', className = '' }) {
    const vip = showTierHeader ? getVipStatus(tier || 'Platinum') : null;
    const wrapClass =
        variant === 'card'
            ? `rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-5 py-4 shadow-[var(--shadow-card-soft)] ${className}`
            : className;

    return (
        <div className={wrapClass}>
            {showTierHeader && vip ? (
                <div className="mb-3 flex items-center">
                    <p className="text-sm font-extrabold uppercase tracking-[0.03em] text-[var(--color-brand-primary)]">{vip.tier}</p>
                </div>
            ) : null}

            <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[var(--color-brand-primary)] px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.02em] text-[var(--color-surface-base)] shadow-[var(--shadow-subtle)]">
                    TARGET: {String(targetTier || '').toUpperCase()}
                </span>
                <span className="text-sm font-bold text-[var(--color-text-strong)]">{progressPercent}%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--color-accent-100)]">
                <div
                    className="h-full rounded-full bg-[image:var(--gradient-cta)]"
                    style={{ width: `${progressPercent}%` }}
                    aria-hidden="true"
                />
            </div>
            <p className="mt-3 text-center text-sm font-medium text-[var(--color-text-main)]">
                Progress to next tier: {progressPercent}%
            </p>
        </div>
    );
}

export default function ProfilePage({ authUser, onLogout, onNavigate, onLiveChatClick }) {
    const { promo, isActive: isPromoActive, progressPercent, endPromo } = useSlotCurrentPromo();
    const vipLevel = PROFILE_VIP_TIER;
    const vipProgressPercent = Math.max(0, Math.min(100, Number(PROFILE_VIP_PROGRESS_PERCENT) || 0));
    const [editing, setEditing] = useState({
        contact: false,
    });
    const [showBankForm, setShowBankForm] = useState(false);
    const [editingBankId, setEditingBankId] = useState(null);
    const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankForm, setBankForm] = useState({
        bankId: '',
        accountHolder: '',
        accountNumber: '',
        branchName: ''
    });
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(readStoredProfilePhoto);
    const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        username: authUser?.name || 'demo',
        fullName: 'Demo',
        referralCode: 'Zy4REBcM',
        referralLink: 'https://riocity.com/register?code=Zy4REBcM',
        rank: vipLevel,
        birthday: '1990-08-01',
        gender: 'Male',
        email: 'demo@gmail.com',
        phone: '60 123456701',
    });

    const toggleEdit = (sectionKey) => {
        setEditing((current) => ({
            ...current,
            [sectionKey]: !current[sectionKey]
        }));
    };

    const updateField = (field) => (event) => {
        const value = event.target.value;
        setFormValues((current) => ({
            ...current,
            [field]: value
        }));
    };

    const updateBankForm = (field) => (event) => {
        const value = event.target.value;
        setBankForm((current) => ({ ...current, [field]: value }));
    };

    const resetBankFormFields = () => {
        setBankForm({ bankId: '', accountHolder: '', accountNumber: '', branchName: '' });
    };

    const closeBankForm = () => {
        setShowBankForm(false);
        setEditingBankId(null);
        resetBankFormFields();
        setBankDropdownOpen(false);
    };

    const openAddBankForm = () => {
        setEditingBankId(null);
        resetBankFormFields();
        setShowBankForm(true);
        setBankDropdownOpen(false);
    };

    const openEditBankForm = (acc) => {
        setEditingBankId(acc.id);
        setBankForm({
            bankId: acc.bankId,
            accountHolder: acc.accountHolder,
            accountNumber: acc.accountNumber,
            branchName: acc.branchName || '',
        });
        setShowBankForm(true);
        setBankDropdownOpen(false);
    };

    const handleSaveBankAccount = () => {
        const bank = BANKS.find((b) => b.id === bankForm.bankId);
        if (!bankForm.bankId || !bankForm.accountHolder?.trim() || !bankForm.accountNumber?.trim()) return;
        if (editingBankId) {
            setBankAccounts((prev) =>
                prev.map((a) =>
                    a.id === editingBankId
                        ? {
                              ...a,
                              bankId: bankForm.bankId,
                              bankName: bank?.label ?? bankForm.bankId,
                              bankImage: bank?.image,
                              accountHolder: bankForm.accountHolder.trim(),
                              accountNumber: bankForm.accountNumber.trim(),
                              branchName: bankForm.branchName?.trim() || '',
                          }
                        : a,
                ),
            );
        } else {
            setBankAccounts((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID?.() ?? Date.now().toString(),
                    bankId: bankForm.bankId,
                    bankName: bank?.label ?? bankForm.bankId,
                    bankImage: bank?.image,
                    accountHolder: bankForm.accountHolder.trim(),
                    accountNumber: bankForm.accountNumber.trim(),
                    branchName: bankForm.branchName?.trim() || '',
                },
            ]);
        }
        closeBankForm();
    };

    const handleRemoveBankAccount = (id) => {
        if (editingBankId === id) closeBankForm();
        setBankAccounts((prev) => prev.filter((a) => a.id !== id));
    };

    const handleProfilePhotoSave = (dataUrl) => {
        setProfilePhotoUrl(dataUrl);
        try {
            if (dataUrl) {
                localStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, dataUrl);
            } else {
                localStorage.removeItem(PROFILE_PHOTO_STORAGE_KEY);
            }
        } catch {
            /* ignore quota / private mode — image still shows for this session */
        }
    };

    return (
        <AccountLayout activePage="profile" authUser={authUser} onNavigate={onNavigate} onLogout={onLogout} onLiveChatClick={onLiveChatClick}>
            <div className="page-container">
                <h1 className="page-title">Account Details</h1>

                <div className="mt-5 space-y-5 md:mt-8 md:space-y-6">
                    <div className="surface-card flex flex-row items-center justify-between gap-3 rounded-2xl p-4 sm:p-6 md:gap-8 md:p-8">
                        <div className="flex min-w-0 flex-1 flex-row items-center gap-3 sm:gap-5">
                            <div className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setProfilePhotoModalOpen(true)}
                                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2"
                                    aria-label="Change profile photo"
                                >
                                    <div className="blue-accent-avatar flex h-14 w-14 items-center justify-center overflow-hidden rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24">
                                        {profilePhotoUrl ? (
                                            <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserCircle2 size={48} className="text-[var(--color-accent-600)]" />
                                        )}
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setProfilePhotoModalOpen(true)}
                                    className="absolute bottom-0 right-[-4px] md:right-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-sm transition hover:scale-105 hover:bg-[var(--color-accent-50)] md:h-8 md:w-8"
                                    aria-label="Edit profile photo"
                                >
                                    <PencilLine size={14} className="h-3 w-3 md:h-4 md:w-4" />
                                </button>
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-3">
                                <div className="space-y-0.5 md:space-y-1.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-accent-600)] md:text-xs md:tracking-[0.2em]">
                                        Verified Account
                                    </p>
                                    <h2 className="truncate text-lg font-bold tracking-tight text-[var(--color-text-strong)] sm:text-xl md:text-3xl">
                                        {formValues.username}
                                    </h2>
                                    <p className="truncate text-xs font-medium text-[var(--color-text-muted)] md:text-sm">{formValues.email}</p>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1.5 md:mt-0 md:gap-2">
                                    <span className="inline-flex w-fit rounded-full border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-700)] md:px-3 md:py-1.5 md:text-xs">
                                        Joined 08/01/2026
                                    </span>
                                    <span className="inline-flex w-fit rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-700)] md:px-3 md:py-1.5 md:text-xs">
                                        Player ID 679129
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-center pl-3 md:pl-6">
                            <VipStatusPill level={vipLevel} size="large" layout="column" />
                            <div className="ml-4 hidden h-[108px] w-px bg-[var(--color-border-default)] md:block" />
                            <ProfileVipProgressSection
                                targetTier={PROFILE_NEXT_VIP_TIER}
                                progressPercent={vipProgressPercent}
                                className="ml-4 hidden w-[210px] md:block"
                            />
                        </div>
                    </div>
                    <ProfileVipProgressSection
                        targetTier={PROFILE_NEXT_VIP_TIER}
                        progressPercent={vipProgressPercent}
                        className="mt-3 md:hidden"
                        tier={vipLevel}
                        variant="card"
                    />

                    {PROFILE_SHOW_ACTIVE_PROMO && isPromoActive && promo ? (
                        <CurrentPromoSection
                            variant="profile"
                            promo={promo}
                            progressPercent={progressPercent}
                            onEndPromo={endPromo}
                        />
                    ) : null}

                    <div className="space-y-6">
                        <SectionCard
                            title="Personal Info"
                            description="Core account identity and referral information."
                            showEditButton={false}
                            editing={false}
                            onToggleEdit={() => {}}
                        >
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {personalFields.map(({ key, label }) => (
                                    <ReadOnlyValue
                                        key={key}
                                        label={label}
                                        value={key === 'birthday' ? formatBirthdayDisplay(formValues.birthday) : formValues[key]}
                                        singleLineEllipsis={key === 'referralLink'}
                                    />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Contact Info"
                            description="Keep your recovery and communication details up to date."
                            editing={editing.contact}
                            onToggleEdit={() => toggleEdit('contact')}
                        >
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {contactFields.map(({ key, label, type }) => (
                                    <Field
                                        key={key}
                                        label={label}
                                        type={type}
                                        value={formValues[key]}
                                        editable={editing.contact}
                                        onChange={updateField(key)}
                                        icon={key === 'email' ? Mail : Phone}
                                    />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Banking Details"
                            description="Manage payout-ready banking information in a secure format."
                            showEditButton={false}
                            editing={false}
                            onToggleEdit={() => {}}
                            actions={
                                <>
                                    {!showBankForm && (
                                        <button
                                            type="button"
                                            onClick={openAddBankForm}
                                            className="btn-theme-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                                        >
                                            <Banknote size={16} />
                                            Add Bank Account
                                        </button>
                                    )}
                                    {showBankForm && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={closeBankForm}
                                                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-strong)] transition hover:bg-[var(--color-surface-subtle)]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSaveBankAccount}
                                                className="btn-theme-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                                            >
                                                Save
                                            </button>
                                        </>
                                    )}
                                </>
                            }
                        >
                            {showBankForm ? (
                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    <p className="col-span-full text-sm font-semibold text-[var(--color-text-strong)]">
                                        {editingBankId ? 'Edit bank account' : 'Add bank account'}
                                    </p>
                                    <div>
                                        <span className="mb-2 block text-xs font-medium text-[var(--color-text-muted)] md:text-sm">Bank <span className="text-[var(--color-danger-main)]">*</span></span>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setBankDropdownOpen((o) => !o)}
                                                className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                            >
                                                {bankForm.bankId && BANKS.find((b) => b.id === bankForm.bankId)?.image ? (
                                                    <span className="flex items-center gap-2.5">
                                                        <img src={BANKS.find((b) => b.id === bankForm.bankId)?.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                        <span className="font-medium text-[var(--color-text-strong)]">{BANKS.find((b) => b.id === bankForm.bankId)?.label}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-text-soft)]">Select Bank</span>
                                                )}
                                                <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {bankDropdownOpen && (
                                                <>
                                                    <div className="absolute inset-0 z-10" onClick={() => setBankDropdownOpen(false)} aria-hidden />
                                                    <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                        {BANKS.map((b) => (
                                                            <button
                                                                key={b.id}
                                                                type="button"
                                                                onClick={() => { setBankForm((f) => ({ ...f, bankId: b.id })); setBankDropdownOpen(false); }}
                                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                            >
                                                                {b.image ? <img src={b.image} alt="" className="h-6 w-6 shrink-0 object-contain" /> : null}
                                                                <span className="font-normal text-[var(--color-text-strong)]">{b.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Field label="Account Holder" value={bankForm.accountHolder} onChange={updateBankForm('accountHolder')} editable={true} icon={UserCircle2} />
                                    <Field label="Account Number" value={bankForm.accountNumber} onChange={updateBankForm('accountNumber')} editable={true} icon={Landmark} />
                                    <Field label="Branch Name" value={bankForm.branchName} onChange={updateBankForm('branchName')} editable={true} placeholder="Optional" />
                                </div>
                            ) : bankAccounts.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {bankAccounts.map((acc) => (
                                            <div
                                                key={acc.id}
                                                className="flex items-start gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-4 transition hover:border-[var(--color-accent-200)] sm:gap-4"
                                            >
                                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        {acc.bankImage ? <img src={acc.bankImage} alt="" className="h-8 w-8 shrink-0 object-contain" /> : <Landmark size={24} className="text-[var(--color-text-muted)]" />}
                                                        <span className="truncate font-semibold text-[var(--color-text-strong)]">{acc.bankName}</span>
                                                    </div>
                                                    <p className="text-sm text-[var(--color-text-muted)]">{acc.accountHolder}</p>
                                                    <p className="font-mono text-sm font-medium text-[var(--color-text-strong)]">{acc.accountNumber}</p>
                                                    {acc.branchName && <p className="text-xs text-[var(--color-text-soft)]">{acc.branchName}</p>}
                                                </div>
                                                <div className="flex shrink-0 items-start gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditBankForm(acc)}
                                                        aria-label="Edit bank account"
                                                        className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-accent-100)]/60 hover:text-[var(--color-accent-600)]"
                                                    >
                                                        <PencilLine size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveBankAccount(acc.id)}
                                                        aria-label="Remove bank account"
                                                        className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-danger-main)]/10 hover:text-[var(--color-danger-main)]"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-accent-200)] bg-[var(--color-accent-50)] p-6 text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-[var(--shadow-accent-avatar)]">
                                        <Landmark size={28} />
                                    </div>
                                    <p className="mt-5 text-lg font-bold text-[var(--color-text-strong)]">No bank account added</p>
                                    <p className="mt-2 max-w-[420px] text-sm font-medium leading-6 text-[var(--color-text-muted)]">
                                        Add your bank profile to enable secure withdrawals and faster account verification.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={openAddBankForm}
                                        className="btn-theme-primary mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                                    >
                                        <Banknote size={16} />
                                        + Add Bank Account
                                    </button>
                                </div>
                            )}
                        </SectionCard>
                    </div>
                </div>
            </div>

            <ProfilePhotoModal
                open={profilePhotoModalOpen}
                onClose={() => setProfilePhotoModalOpen(false)}
                initialUrl={profilePhotoUrl}
                onSave={handleProfilePhotoSave}
            />
        </AccountLayout>
    );
}

