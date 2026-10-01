import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Moon,
  Sun,
  LogOut,
  Settings,
  Flame,
  Menu,
  X,
  FileCheck2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PrivacyBadge } from './PrivacyBadge';
import { Button } from '../common/Button';

export const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleEndSession = () => {
    navigate('/session-end');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-[#090D16]/80 backdrop-blur-xl transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left Side: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  CLAUSE
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  IDP
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider">
                Intelligent Document Processing
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Privacy Badge */}
        {isAuthenticated && (
          <div className="hidden sm:flex items-center">
            <PrivacyBadge />
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle light/dark theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* End Session Button */}
              <button
                onClick={handleEndSession}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs font-bold border border-red-500/30 transition-all"
                title="Download session audit report and wipe memory"
              >
                <Flame className="w-3.5 h-3.5" />
                End Session
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[120px] truncate">
                    {user?.name || 'Account'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-slide-up backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-medium">
                        {user?.profession || 'Analyst'}
                      </span>
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings & Customization
                    </Link>

                    <Link
                      to="/privacy"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Privacy Policy & Rules
                    </Link>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleEndSession();
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 transition-colors w-full text-left"
                    >
                      <Flame className="w-4 h-4" />
                      End Session & Export PDF
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/upload"
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400"
              >
                Try Demo
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
