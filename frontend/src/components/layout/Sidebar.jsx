import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  BarChart3,
  Sliders,
  Bot,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import { useJarvis } from '../../context/JarvisContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { jarvisConfig } = useJarvis();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Documents', to: '/documents', icon: FileText },
    { label: 'Process Document', to: '/upload', icon: UploadCloud, highlight: true },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Review Queue', to: '/review-queue', icon: Sliders, badge: '8' },
    { label: `${jarvisConfig?.name || 'AI'} Assistant`, to: '/chat', icon: Bot, isJarvis: true },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-800 bg-[#090D16]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out flex flex-col justify-between p-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            IDP Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      item.highlight ? 'text-cyan-400' : ''
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Trust Card */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Shield className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Zero-Retention Policy</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            In-memory pipeline. Permanent deletion upon session termination.
          </p>
        </div>
      </aside>
    </>
  );
};
