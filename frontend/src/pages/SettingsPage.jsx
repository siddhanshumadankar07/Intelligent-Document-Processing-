import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Bot,
  Shield,
  Trash2,
  Save,
  Check,
  AlertTriangle,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useJarvis } from '../context/JarvisContext';
import { speechService } from '../services/speechService';
import api from '../services/api';

export const SettingsPage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { jarvisConfig } = useJarvis();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('jarvis'); // 'profile' | 'profession' | 'jarvis' | 'privacy'
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Profession fields
  const [profession, setProfession] = useState(user?.profession || 'Finance/Accounting');
  const [customProfession, setCustomProfession] = useState(user?.customProfession || '');

  // Jarvis fields
  const [assistantName, setAssistantName] = useState(user?.jarvisSettings?.name || 'Jarvis');
  const [tone, setTone] = useState(user?.jarvisSettings?.tone || 'friendly');
  const [speakingSpeed, setSpeakingSpeed] = useState(user?.jarvisSettings?.speakingSpeed || 1.0);
  const [responseLength, setResponseLength] = useState(user?.jarvisSettings?.responseLength || 'balanced');
  const [themeColor, setThemeColor] = useState(user?.jarvisSettings?.themeColor || '#7C3AED');
  const [autoSpeak, setAutoSpeak] = useState(user?.jarvisSettings?.autoSpeak || false);

  // Privacy fields
  const [defaultTtl, setDefaultTtl] = useState(user?.defaultSessionTtlMinutes || 15);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const professions = [
    'Finance/Accounting',
    'Legal',
    'HR/Recruitment',
    'Healthcare',
    'Education',
    'Business/Operations',
    'Real Estate',
    'Engineering',
    'Other',
  ];

  const handleSaveJarvis = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/jarvis-settings', {
        name: assistantName,
        tone,
        speakingSpeed,
        responseLength,
        themeColor,
        autoSpeak,
      });

      if (res.data?.success) {
        updateUserProfile({ jarvisSettings: res.data.jarvisSettings });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed saving Jarvis settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/profile', { name, phone });
      if (res.data?.success) {
        updateUserProfile({ name, phone });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfession = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/profession', {
        profession,
        customProfession: profession === 'Other' ? customProfession : '',
      });
      if (res.data?.success) {
        updateUserProfile({ profession, customProfession });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed saving profession:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/session-settings', {
        defaultSessionTtlMinutes: defaultTtl,
      });
      if (res.data?.success) {
        updateUserProfile({ defaultSessionTtlMinutes: defaultTtl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed saving session settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    try {
      await api.delete('/users/delete-account');
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed deleting account:', err);
    }
  };

  const testVoiceSample = () => {
    speechService.speak(`Hello! I'm ${assistantName}. My tone is set to ${tone}. How can I help you analyze your documents today?`, {
      rate: speakingSpeed,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-light dark:text-text-dark tracking-tight">
          Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark mt-1">
          Configure Jarvis intelligence personality, profession presets, and privacy policies.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'jarvis', label: 'Jarvis Assistant', icon: Bot },
          { id: 'profession', label: 'Profession & Schemas', icon: Briefcase },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'privacy', label: 'Privacy & Data', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-mutedLight dark:text-text-mutedDark hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- JARVIS TAB (WITH LIVE PREVIEW CARD) --- */}
      {activeTab === 'jarvis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <Card className="lg:col-span-7 space-y-5">
            <h3 className="text-base font-bold text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-3">
              Assistant Personality & Voice
            </h3>

            <div>
              <label className="block text-xs font-bold mb-1">Assistant Name</label>
              <input
                type="text"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-jarvis focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Communication Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['friendly', 'formal', 'concise', 'detailed'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`p-2 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      tone === t
                        ? 'border-jarvis bg-jarvis/15 text-jarvis ring-1 ring-jarvis/40'
                        : 'border-border-light dark:border-border-dark text-text-mutedLight'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold">Speaking Speed ({speakingSpeed}x)</label>
                <button
                  type="button"
                  onClick={testVoiceSample}
                  className="flex items-center gap-1 text-[11px] text-jarvis font-bold hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Test Voice Sample
                </button>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={speakingSpeed}
                onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                className="w-full accent-jarvis cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Response Length Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {['concise', 'balanced', 'thorough'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setResponseLength(r)}
                    className={`p-2 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      responseLength === r
                        ? 'border-jarvis bg-jarvis/15 text-jarvis ring-1 ring-jarvis/40'
                        : 'border-border-light dark:border-border-dark text-text-mutedLight'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="jarvis"
              icon={Save}
              loading={loading}
              onClick={handleSaveJarvis}
              className="w-full mt-4"
            >
              Save Jarvis Configuration
            </Button>
          </Card>

          {/* Live Interactive Preview Card */}
          <Card className="lg:col-span-5 bg-gradient-to-b from-jarvis/10 via-surface-light dark:via-surface-dark to-surface-light dark:to-surface-dark border-jarvis/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-jarvis uppercase tracking-wider">
                Live Assistant Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-jarvis/20 text-jarvis font-bold">
                Instant Updates
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <div className="w-12 h-12 rounded-2xl bg-jarvis text-white flex items-center justify-center jarvis-glow">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-text-light dark:text-text-dark">
                  {assistantName}
                </h4>
                <p className="text-xs text-text-mutedLight dark:text-text-mutedDark">
                  Tone: <span className="capitalize font-semibold">{tone}</span> • Speed: {speakingSpeed}x
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs leading-relaxed text-text-light dark:text-text-dark space-y-2">
              <div className="flex items-center gap-1.5 text-jarvis font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Sample Spoken Reply:
              </div>
              <p className="text-text-mutedLight dark:text-text-mutedDark italic">
                "Hello! I analyzed your session documents. The total across your 3 uploaded invoices is $9,900.00, and all liability caps match Delaware jurisdiction standards."
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* --- PROFESSION TAB --- */}
      {activeTab === 'profession' && (
        <Card className="max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-3">
            Domain & Profession Preferences
          </h3>
          <div>
            <label className="block text-xs font-bold mb-2">Selected Industry Domain</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {professions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProfession(p)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    profession === p
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/40'
                      : 'border-border-light dark:border-border-dark text-text-mutedLight'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {profession === 'Other' && (
            <div>
              <label className="block text-xs font-bold mb-1">Custom Profession Description</label>
              <input
                type="text"
                value={customProfession}
                onChange={(e) => setCustomProfession(e.target.value)}
                placeholder="e.g. Environmental Auditing"
                className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          )}

          <Button variant="primary" icon={Save} loading={loading} onClick={handleSaveProfession}>
            Update Profession Defaults
          </Button>
        </Card>
      )}

      {/* --- PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <Card className="max-w-xl space-y-5">
          <h3 className="text-base font-bold text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-3">
            Account Profile
          </h3>
          <div>
            <label className="block text-xs font-bold mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Email (Account Identifier)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-800 text-xs opacity-75 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Phone / WhatsApp Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 234 5678"
              className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <Button variant="primary" icon={Save} loading={loading} onClick={handleSaveProfile}>
            Save Profile
          </Button>
        </Card>
      )}

      {/* --- PRIVACY & DANGER ZONE TAB --- */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 max-w-2xl">
          <Card className="space-y-5">
            <h3 className="text-base font-bold text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-3">
              Session & Zero-Retention Configuration
            </h3>
            <div>
              <label className="block text-xs font-bold mb-1">
                Default Session Duration (TTL)
              </label>
              <select
                value={defaultTtl}
                onChange={(e) => setDefaultTtl(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                <option value={10}>10 Minutes (Maximum Privacy)</option>
                <option value={15}>15 Minutes (Default)</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
              <p className="text-[11px] text-text-mutedLight dark:text-text-mutedDark mt-1">
                Sessions automatically hard-delete all documents and chats when the timer runs out.
              </p>
            </div>
            <Button variant="primary" icon={Save} loading={loading} onClick={handleSavePrivacy}>
              Save Privacy Settings
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card className="border-rose-500/30 bg-rose-500/5 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold">Danger Zone: Purge Account</h3>
            </div>
            <p className="text-xs text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
              Permanently delete your user account, credentials, active sessions, and all document history across the entire database. This action is irreversible.
            </p>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete My Account and All Data
            </Button>
          </Card>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Permanently Delete Account?"
        subtitle="Zero-retention purge confirmation"
      >
        <div className="space-y-4 text-xs text-text-mutedLight dark:text-text-mutedDark">
          <p>
            Please type <strong className="text-rose-600 font-mono">DELETE</strong> in the box below to confirm permanent deletion of your profile and all session records.
          </p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full p-2.5 rounded-xl border border-rose-500/40 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleteConfirmText !== 'DELETE'}
              onClick={handleDeleteAccount}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
