import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, loginAsDemoUser, requestWhatsAppOTP, verifyWhatsAppOTP } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get('expired') ? 'Your previous session expired for zero-retention privacy. Please sign in.' : '');

  // WhatsApp OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState('request'); // 'request' | 'verify'
  const [otpMessage, setOtpMessage] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/upload');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (profession = 'Finance/Accounting') => {
    setLoading(true);
    try {
      await loginAsDemoUser(profession);
      navigate('/upload');
    } catch (err) {
      setError('Demo login error: ' + (err.message || 'unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phoneInput) return;
    setOtpLoading(true);
    try {
      const res = await requestWhatsAppOTP(phoneInput);
      setOtpStep('verify');
      setOtpMessage(res.message || 'Verification code sent.');
      if (res.demoCode) {
        setOtpCode(res.demoCode); // Auto-fill for seamless hackathon testing
      }
    } catch (err) {
      setOtpMessage(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return;
    setOtpLoading(true);
    try {
      await verifyWhatsAppOTP(phoneInput, otpCode);
      setShowOtpModal(false);
      navigate('/upload');
    } catch (err) {
      setOtpMessage(err.response?.data?.message || 'Invalid code');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-text-light dark:text-text-dark">
            Welcome to Clause
          </h2>
          <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark">
            Sign in to start your secure, zero-retention session
          </p>
        </div>

        {/* 1-Click Fast Judge / Demo Evaluator Access */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-violet-500/10 to-teal-500/10 border border-teal-500/30 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-text-light dark:text-text-dark">
                Hackathon 1-Click Access
              </div>
              <div className="text-[11px] text-text-mutedLight dark:text-text-mutedDark">
                Instant test account without typing
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDemoLogin('Finance/Accounting')}
            loading={loading}
          >
            Demo Sign In
          </Button>
        </div>

        <Card className="shadow-xl">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social OAuth & WhatsApp Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-text-light dark:text-text-dark transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </a>

            <a
              href="/api/auth/github"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-text-light dark:text-text-dark transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setShowOtpModal(true)}
            className="w-full mb-5 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 text-xs font-semibold text-teal-700 dark:text-teal-300 transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-teal-500" />
            <span>Sign In with WhatsApp One-Time Password (OTP)</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-border-light dark:border-border-dark w-full" />
            <span className="bg-surface-light dark:bg-surface-dark px-3 text-[11px] uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
              Or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-light dark:text-text-dark mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-mutedLight absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-text-light dark:text-text-dark text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-light dark:text-text-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-mutedLight absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-text-light dark:text-text-dark text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-mutedLight hover:text-text-light cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Session
            </Button>
          </form>

          {/* Privacy reassurance */}
          <div className="mt-5 pt-4 border-t border-border-light dark:border-border-dark text-center">
            <p className="text-[11px] text-text-mutedLight dark:text-text-mutedDark">
              Zero-retention promise: your document session data is wiped on logout.
            </p>
          </div>
        </Card>

        {/* Link to Register */}
        <p className="text-center text-xs text-text-mutedLight dark:text-text-mutedDark">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* WhatsApp OTP Modal */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        title="WhatsApp One-Time Password"
        subtitle="Sign in securely using your phone or email"
      >
        <div className="space-y-4">
          {otpMessage && (
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-medium">
              {otpMessage}
            </div>
          )}

          {otpStep === 'request' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">WhatsApp Phone Number or Email</label>
                <input
                  type="text"
                  required
                  placeholder="+14155552671 or user@mail.com"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" loading={otpLoading}>
                Request Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Enter 6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-center font-mono text-lg tracking-widest focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" loading={otpLoading}>
                Verify & Enter Session
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
