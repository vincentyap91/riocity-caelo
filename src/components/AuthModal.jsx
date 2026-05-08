import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Eye, EyeOff } from 'lucide-react';
import UniversalModal from './ui/UniversalModal';
import TwoFactorLoginModal from './TwoFactorLoginModal';
import { verify2FALogin, verifyLogin } from '../services/authService';

const ILLUSTRATION_URL =
  'https://pksoftcdn.azureedge.net/media/350x250px_login-202507070842148822.png';

function onlyAlphaNum(value) {
  return (value ?? '').replace(/[^a-zA-Z0-9]/g, '');
}

function buildPasswordRules(passwordRaw) {
  const password = String(passwordRaw ?? '');
  const hasMin = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const onlyAllowed = /^[a-zA-Z0-9]*$/.test(password);
  return {
    hasMin,
    hasLetterNumber: hasLetter && hasNumber,
    onlyAllowed,
  };
}

export default function AuthModal({
  open,
  onClose,
  initialView = 'login', // 'login' | 'register'
  onAuthSuccess,
  onCustomerServiceClick,
}) {
  const [view, setView] = useState(initialView);

  // login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2FA
  const [show2FA, setShow2FA] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // register
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferral, setRegReferral] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const countryCode = '+855';

  const rules = useMemo(() => buildPasswordRules(regPassword), [regPassword]);

  useEffect(() => {
    if (!open) return;
    setView(initialView);
  }, [open, initialView]);

  useEffect(() => {
    if (!open) {
      setLoginError('');
      setLoginLoading(false);
      setShow2FA(false);
      setSessionId(null);
      setCountryOpen(false);
    }
  }, [open]);

  const close = () => {
    setCountryOpen(false);
    onClose?.();
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const result = await verifyLogin(loginUsername.trim(), loginPassword);
      if (!result.success) {
        setLoginError(result.error || 'Login failed');
        return;
      }
      if (result.requires2FA && result.sessionId) {
        setSessionId(result.sessionId);
        setShow2FA(true);
        return;
      }
      onAuthSuccess?.(result.username || loginUsername.trim());
      close();
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    // Demo client: accept valid-looking values and treat as successful auth.
    const username = regUsername.trim();
    const phone = onlyAlphaNum(regPhone.trim());
    if (!username) return;
    if (!phone) return;
    if (!rules.hasMin || !rules.hasLetterNumber || !rules.onlyAllowed) return;
    onAuthSuccess?.(username);
    close();
  };

  return (
    <>
      <UniversalModal
        isOpen={open}
        onClose={close}
        type="custom"
        title={view === 'login' ? 'Log in' : 'Register'}
        ariaLabel={view === 'login' ? 'Log in' : 'Register'}
        containerClassName="auth-modal-container max-w-[760px]"
        contentClassName="auth-modal-content"
      >
        <div className={`auth-modal-split ${view === 'login' ? 'auth-modal-split--login' : ''}`}>
          <aside className="auth-modal-art" aria-hidden>
            <img src={ILLUSTRATION_URL} alt="" className="auth-modal-art__img" draggable={false} />
          </aside>

          <section className="auth-modal-form">
            {view === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-modal-form__inner">
                <h2 className="auth-modal-title">Enter Username or Phone Number</h2>
                <label className="auth-modal-field">
                  <input
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="e.g: johndoe or 855123456789"
                    className="auth-modal-input"
                    autoComplete="username"
                  />
                </label>
                <p className="auth-modal-hint">Phone number must include country code (855xxxxxxxxx)</p>

                <h2 className="auth-modal-title auth-modal-title--spaced">Enter Password</h2>
                <label className="auth-modal-field auth-modal-field--password">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="auth-modal-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-modal-icon-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <label className="auth-modal-remember">
                  <input type="checkbox" className="auth-modal-checkbox" />
                  Remember Me
                </label>

                {loginError ? <p className="auth-modal-error">{loginError}</p> : null}

                <div className="auth-modal-actions">
                  <button type="submit" className="auth-modal-btn auth-modal-btn--primary" disabled={loginLoading}>
                    {loginLoading ? 'Logging in…' : 'Log In'}
                  </button>
                  <button type="button" className="auth-modal-btn auth-modal-btn--secondary">
                    Forgot Password
                  </button>
                </div>

                <div className="auth-modal-links">
                  <span className="auth-modal-link-text">Do not have an account yet?</span>{' '}
                  <button type="button" className="auth-modal-link" onClick={() => setView('register')}>
                    Register Now!
                  </button>
                </div>

                <div className="auth-modal-divider" aria-hidden />

                <button type="button" className="auth-modal-support" onClick={onCustomerServiceClick}>
                  Need help? <span className="auth-modal-support__link">Customer Service</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="auth-modal-form__inner">
                <h2 className="auth-modal-title">Enter Username</h2>
                <label className="auth-modal-field">
                  <input
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder=""
                    className="auth-modal-input"
                    autoComplete="username"
                  />
                </label>

                <h2 className="auth-modal-title auth-modal-title--spaced">Mobile Number</h2>
                <div className="auth-modal-phone">
                  <div className="auth-modal-phone__code">
                    <button
                      type="button"
                      className="auth-modal-phone__code-btn"
                      onClick={() => setCountryOpen((s) => !s)}
                      aria-haspopup="listbox"
                      aria-expanded={countryOpen}
                    >
                      {countryCode}
                      <ChevronDown size={16} />
                    </button>
                    {countryOpen ? (
                      <div className="auth-modal-phone__menu" role="listbox" aria-label="Country code">
                        <button
                          type="button"
                          className="auth-modal-phone__menu-item"
                          onClick={() => setCountryOpen(false)}
                        >
                          +855
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <label className="auth-modal-field auth-modal-field--phone">
                    <input
                      value={regPhone}
                      onChange={(e) => setRegPhone(onlyAlphaNum(e.target.value))}
                      className="auth-modal-input"
                      inputMode="numeric"
                      placeholder=""
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <h2 className="auth-modal-title auth-modal-title--spaced">Enter Your Password</h2>
                <label className="auth-modal-field auth-modal-field--password">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(onlyAlphaNum(e.target.value))}
                    className="auth-modal-input"
                    placeholder=""
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-modal-icon-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <ul className="auth-modal-rules" aria-label="Password rules">
                  <li className={`auth-modal-rule ${rules.hasMin ? 'is-ok' : ''}`}>
                    <Check size={16} className="auth-modal-rule__icon" />
                    Include at least 8 characters, containing both a letter and a number, with no symbols allowed.
                  </li>
                  <li className={`auth-modal-rule ${rules.hasLetterNumber ? 'is-ok' : ''}`}>
                    <Check size={16} className="auth-modal-rule__icon" />
                    Only letters (A-z, a-z) and numbers (0-9).
                  </li>
                  <li className={`auth-modal-rule ${rules.onlyAllowed ? 'is-ok' : ''}`}>
                    <Check size={16} className="auth-modal-rule__icon" />
                    No special characters / symbols.
                  </li>
                </ul>

                <h2 className="auth-modal-title auth-modal-title--spaced">Key In Your Referral Code (Optional)</h2>
                <label className="auth-modal-field">
                  <input
                    value={regReferral}
                    onChange={(e) => setRegReferral(onlyAlphaNum(e.target.value))}
                    className="auth-modal-input auth-modal-input--muted"
                    placeholder=""
                  />
                </label>

                <div className="auth-modal-actions auth-modal-actions--single">
                  <button type="submit" className="auth-modal-btn auth-modal-btn--primary">
                    Register
                  </button>
                </div>

                <div className="auth-modal-links">
                  <span className="auth-modal-link-text">Already have an account?</span>{' '}
                  <button type="button" className="auth-modal-link" onClick={() => setView('login')}>
                    Login Now!
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </UniversalModal>

      <TwoFactorLoginModal
        open={show2FA}
        onClose={() => setShow2FA(false)}
        onSuccess={(user) => {
          onAuthSuccess?.(user);
          close();
        }}
        verifyCode={(code, trustDevice) => verify2FALogin(sessionId, code, trustDevice)}
      />
    </>
  );
}

