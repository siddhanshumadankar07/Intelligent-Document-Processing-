import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { JarvisFloatingButton } from '../jarvis/JarvisFloatingButton';
import { JarvisChatPanel } from '../jarvis/JarvisChatPanel';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useSession } from '../../context/SessionContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Plus,
  Flame,
  LayoutDashboard,
  FileText,
  UploadCloud,
  BarChart3,
  Sliders,
  Settings,
} from 'lucide-react';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showWarningModal, setShowWarningModal, extendSession, formattedTime } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  const isChatPage = location.pathname === '/chat' || location.pathname === '/assistant';

  const mobileTabs = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Documents', to: '/documents', icon: FileText },
    { label: 'Process', to: '/upload', icon: UploadCloud },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Review', to: '/review-queue', icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-[#F8FAFC]">
      {/* Top Header */}
      {!isLandingPage && (
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex w-full">
        {!isLandingPage && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main
          className={`flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 ${
            isLandingPage ? 'p-0' : 'px-4 sm:px-6 lg:px-8 pt-6'
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {!isLandingPage && (
        <nav className="fixed bottom-0 inset-x-0 z-30 bg-[#090D16]/95 border-t border-slate-800 backdrop-blur-xl lg:hidden flex items-center justify-around py-2">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.to;
            return (
              <button
                key={tab.to}
                onClick={() => navigate(tab.to)}
                className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Floating Jarvis Assistant (visible on pages other than landing & full /chat page) */}
      {!isLandingPage && !isChatPage && (
        <>
          <JarvisFloatingButton />
          <JarvisChatPanel />
        </>
      )}

      {/* 2-Minute Auto-Expiry Warning Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Privacy Session Expiring Soon"
        subtitle={`Zero-retention purge scheduled in ${formattedTime}`}
      >
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
            <p className="text-xs">
              To guarantee zero retention, all document buffers and in-memory cache will be wiped when the countdown completes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="primary"
              icon={Plus}
              className="flex-1"
              onClick={() => {
                extendSession(15);
                setShowWarningModal(false);
              }}
            >
              Extend (+15 Mins)
            </Button>
            <Button
              variant="danger"
              icon={Flame}
              className="flex-1"
              onClick={() => {
                setShowWarningModal(false);
                navigate('/session-end');
              }}
            >
              End Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
