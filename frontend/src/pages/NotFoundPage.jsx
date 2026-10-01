import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 shadow-sm">
        <Shield className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-text-light dark:text-text-dark font-mono mb-2">
        404
      </h1>
      <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark max-w-sm mb-6">
        The requested page does not exist or has been securely purged.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};
