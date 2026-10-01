import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  Scale,
  Users,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Home,
  Wrench,
  Sparkles,
  Bot,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const OnboardingPage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Profession, 2: Jarvis Customization
  const [selectedProfession, setSelectedProfession] = useState(user?.profession || 'Finance/Accounting');
  const [customProfession, setCustomProfession] = useState('');
  const [assistantName, setAssistantName] = useState(user?.jarvisSettings?.name || 'Jarvis');
  const [assistantTone, setAssistantTone] = useState(user?.jarvisSettings?.tone || 'friendly');
  const [loading, setLoading] = useState(false);

  const professions = [
    { id: 'Finance/Accounting', label: 'Finance & Accounting', icon: Building, desc: 'Invoices, receipts, math validation' },
    { id: 'Legal', label: 'Legal & Contracts', icon: Scale, desc: 'Agreements, NDAs, jurisdiction' },
    { id: 'HR/Recruitment', label: 'HR & Recruiting', icon: Users, desc: 'Resumes, skills, career history' },
    { id: 'Healthcare', label: 'Healthcare & Clinical', icon: Stethoscope, desc: 'Lab panels, biomarker reference ranges' },
    { id: 'Education', label: 'Education & Academics', icon: GraduationCap, desc: 'Transcripts, GPA, degree records' },
    { id: 'Business/Operations', label: 'Business & Ops', icon: Briefcase, desc: 'POs, SLAs, vendor logistics' },
    { id: 'Real Estate', label: 'Real Estate', icon: Home, desc: 'Leases, tenancy, square footage' },
    { id: 'Engineering', label: 'Engineering', icon: Wrench, desc: 'BOMs, tolerances, technical specs' },
    { id: 'Other', label: 'Other Profession', icon: Sparkles, desc: 'Custom schema and document types' },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      // 1. Update profession
      await api.put('/users/profession', {
        profession: selectedProfession,
        customProfession: selectedProfession === 'Other' ? customProfession : '',
      });

      // 2. Update Jarvis settings
      await api.put('/users/jarvis-settings', {
        name: assistantName,
        tone: assistantTone,
      });

      updateUserProfile({
        profession: selectedProfession,
        customProfession,
        jarvisSettings: {
          ...user?.jarvisSettings,
          name: assistantName,
          tone: assistantTone,
        }
      });

      navigate('/upload');
    } catch (err) {
      console.error('Failed saving onboarding preferences:', err);
      navigate('/upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-text-mutedLight dark:text-text-mutedDark px-2">
          <span>Step {step} of 2</span>
          <button
            onClick={() => navigate('/upload')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Skip for now →
          </button>
        </div>

        {step === 1 ? (
          /* Step 1: Profession */
          <Card className="shadow-2xl">
            <div className="text-center max-w-md mx-auto mb-6">
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight mb-1">
                What is your profession?
              </h2>
              <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark">
                Clause pre-tunes its AI extraction schemas and Jarvis vocabulary to your specific industry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {professions.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedProfession === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProfession(p.id)}
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30'
                        : 'border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/30 text-text-light dark:text-text-dark hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${isSelected ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-text-mutedLight'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold mb-1">{p.label}</span>
                    <span className="text-[10px] text-text-mutedLight dark:text-text-mutedDark line-clamp-1">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedProfession === 'Other' && (
              <div className="mb-6">
                <label className="block text-xs font-bold mb-1">Specify Your Custom Profession</label>
                <input
                  type="text"
                  placeholder="e.g. Environmental Science, Insurance Underwriting..."
                  value={customProfession}
                  onChange={(e) => setCustomProfession(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            )}

            <Button
              variant="primary"
              className="w-full"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setStep(2)}
            >
              Continue to Assistant Setup
            </Button>
          </Card>
        ) : (
          /* Step 2: Jarvis Customization */
          <Card className="shadow-2xl">
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="w-12 h-12 rounded-2xl bg-jarvis/15 text-jarvis flex items-center justify-center mx-auto mb-2 jarvis-glow">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight mb-1">
                Meet Your AI Assistant
              </h2>
              <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark">
                Personalize Jarvis to match your preferred voice, name, and communication tone.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold mb-1">Assistant Name</label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="Jarvis"
                  className="w-full p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-jarvis focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Tone of Voice</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['friendly', 'formal', 'concise', 'detailed'].map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setAssistantTone(tone)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        assistantTone === tone
                          ? 'border-jarvis bg-jarvis/15 text-jarvis ring-2 ring-jarvis/30'
                          : 'border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/30 text-text-mutedLight'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                icon={Check}
                loading={loading}
                onClick={handleFinish}
              >
                Start Processing Documents
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
