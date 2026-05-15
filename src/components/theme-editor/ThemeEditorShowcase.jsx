import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import SegmentedTabs from '../ui/SegmentedTabs';
import UniversalModal from '../ui/UniversalModal';

// ─── Preview Card wrapper ────────────────────────────────────────────────────
function PreviewCard({ title, children }) {
  const [dark, setDark] = useState(false);
  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid var(--color-border-default)',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: 'var(--color-surface-muted)',
        borderBottom: '1px solid var(--color-border-default)',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-main)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{title}</span>
        <button
          type="button"
          onClick={() => setDark(d => !d)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 8, border: '1px solid var(--color-border-default)',
            background: dark ? '#1e293b' : 'var(--color-surface-base)',
            color: dark ? '#e2e8f0' : 'var(--color-text-muted)',
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {dark ? <Moon size={10} /> : <Sun size={10} />}
          {dark ? 'Dark' : 'Light'}
        </button>
      </div>
      <div style={{
        padding: 14,
        background: dark ? '#0f172a' : 'var(--color-surface-base)',
        color: dark ? '#e2e8f0' : 'var(--color-text-main)',
        transition: 'background 0.2s, color 0.2s',
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Navigation Showcase ─────────────────────────────────────────────────────
function NavShowcase() {
  const [activeTab, setActiveTab] = useState('slots');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Sidebar-style nav */}
      <div style={{
        background: 'var(--color-brand-primary)', borderRadius: 10,
        padding: 10, display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {['Dashboard', 'Deposit', 'Withdrawal', 'History'].map((item, i) => (
          <div key={item} style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: i === 0 ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: i === 0 ? 'var(--color-nav-accent)' : 'var(--color-nav-text-soft)',
            cursor: 'pointer',
            border: i === 0 ? '1px solid var(--color-nav-tile-border-hover)' : '1px solid transparent',
          }}>{item}</div>
        ))}
      </div>
      {/* Dropdown simulation */}
      <div className="dark-nav-shell" style={{ borderRadius: 10, padding: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-nav-accent)', marginBottom: 6, textTransform: 'uppercase' }}>Game Providers</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {['Pragmatic Play', 'PG Soft', 'Jili', 'Spadegaming'].map(p => (
            <div key={p} className="dark-nav-tile" style={{ padding: '6px 8px', borderRadius: 7, fontSize: 11, fontWeight: 600, color: 'var(--color-nav-text-soft)' }}>{p}</div>
          ))}
        </div>
      </div>
      {/* SegmentedTabs */}
      <SegmentedTabs
        items={[{ id: 'slots', label: 'Slots' }, { id: 'live', label: 'Live Casino' }, { id: 'sports', label: 'Sports' }]}
        value={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}

// ─── Data Showcase ───────────────────────────────────────────────────────────
function DataShowcase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Table */}
      <div style={{ borderRadius: 10, border: '1px solid var(--color-border-default)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-muted)' }}>
              {['Date', 'Type', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-subtle)', borderBottom: '1px solid var(--color-border-default)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['2026-05-12', 'Deposit', '+$500.00', 'Completed'],
              ['2026-05-11', 'Withdrawal', '-$200.00', 'Pending'],
              ['2026-05-10', 'Rebate', '+$12.50', 'Completed'],
            ].map(([d, t, a, s], i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                <td style={{ padding: '7px 10px', color: 'var(--color-text-muted)' }}>{d}</td>
                <td style={{ padding: '7px 10px', fontWeight: 600, color: 'var(--color-text-main)' }}>{t}</td>
                <td style={{ padding: '7px 10px', fontWeight: 700, color: a.startsWith('+') ? 'var(--color-success-main)' : 'var(--color-danger-main)' }}>{a}</td>
                <td style={{ padding: '7px 10px' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                    background: s === 'Completed' ? 'rgba(57,181,74,0.12)' : 'rgba(255,91,46,0.12)',
                    color: s === 'Completed' ? 'var(--color-success-main)' : 'var(--color-danger-main)',
                  }}>{s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { title: 'Main Wallet', value: '$1,250.00', accent: 'var(--color-brand-primary)' },
          { title: 'Rebate', value: '$45.80', accent: 'var(--color-success-main)' },
        ].map(c => (
          <div key={c.title} className="surface-card" style={{ borderRadius: 12, padding: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>{c.title}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: c.accent }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feedback Showcase ───────────────────────────────────────────────────────
function FeedbackShowcase() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Alert banners */}
      {[
        { type: 'success', bg: 'rgba(57,181,74,0.1)', border: 'var(--color-success-main)', color: 'var(--color-success-main)', text: 'Deposit successful! Funds have been credited.' },
        { type: 'error', bg: 'rgba(255,91,46,0.1)', border: 'var(--color-danger-main)', color: 'var(--color-danger-main)', text: 'Withdrawal failed. Please try again.' },
        { type: 'info', bg: 'var(--color-accent-50)', border: 'var(--color-accent-400)', color: 'var(--color-accent-700)', text: 'Your VIP status will be reviewed on Monday.' },
      ].map(a => (
        <div key={a.type} style={{
          padding: '8px 12px', borderRadius: 10,
          background: a.bg, borderLeft: `3px solid ${a.border}`,
          fontSize: 11, fontWeight: 600, color: a.color,
        }}>
          {a.text}
        </div>
      ))}
      {/* Modal trigger */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="btn-theme-primary"
        style={{ padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none' }}
      >
        Open Sample Modal
      </button>
      {showModal && (
        <UniversalModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type="announcement"
          title="Sample Announcement"
          message="This is a live preview of the UniversalModal component with your current theme variables applied."
          showCheckbox={false}
          closeLabel="GOT IT"
        />
      )}
    </div>
  );
}

// ─── Input Showcase ──────────────────────────────────────────────────────────
function InputShowcase() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Form fields */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-main)', display: 'block', marginBottom: 4 }}>Username</label>
        <div className="auth-modal-field" style={{ borderRadius: 10 }}>
          <input className="auth-modal-input" placeholder="Enter username" readOnly style={{ minHeight: 38, fontSize: 12, padding: '8px 12px' }} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-main)', display: 'block', marginBottom: 4 }}>Password</label>
        <div className="auth-modal-field auth-modal-field--password" style={{ borderRadius: 10 }}>
          <input className="auth-modal-input" type="password" placeholder="••••••••" readOnly style={{ minHeight: 38, fontSize: 12, padding: '8px 12px' }} />
        </div>
      </div>
      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button type="button" className="auth-modal-btn auth-modal-btn--primary" style={{ minHeight: 38, fontSize: 12, borderRadius: 10, cursor: 'pointer' }}>Primary CTA</button>
        <button type="button" className="auth-modal-btn auth-modal-btn--secondary" style={{ minHeight: 38, fontSize: 12, borderRadius: 10, cursor: 'pointer' }}>Secondary</button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="btn-theme-cta" style={{ flex: 1, padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Gold CTA</button>
        <button type="button" style={{
          flex: 1, padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
          background: 'var(--color-success-main)', color: '#fff', border: 'none',
        }}>Success</button>
        <button type="button" style={{
          flex: 1, padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
          background: 'var(--color-danger-main)', color: '#fff', border: 'none',
        }}>Danger</button>
      </div>
      {/* Checkbox */}
      <label className="auth-modal-remember" style={{ fontSize: 12 }}>
        <input
          type="checkbox"
          className="auth-modal-checkbox"
          checked={checked}
          onChange={() => setChecked(c => !c)}
        />
        Remember me
      </label>
    </div>
  );
}

// ─── Main Showcase Tab ───────────────────────────────────────────────────────
export default function ThemeEditorShowcase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <PreviewCard title="Navigation — Sidebars & Dropdowns">
        <NavShowcase />
      </PreviewCard>
      <PreviewCard title="Data — Tables & Cards">
        <DataShowcase />
      </PreviewCard>
      <PreviewCard title="Feedback — Modals & Alerts">
        <FeedbackShowcase />
      </PreviewCard>
      <PreviewCard title="Input — Forms, Buttons & Checkboxes">
        <InputShowcase />
      </PreviewCard>
    </div>
  );
}
