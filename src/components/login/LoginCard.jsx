import React from 'react';
import { LoginForm } from './LoginForm';
import { SocialLoginButtons } from './SocialLoginButtons';

const Divider = ({ text }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300 dark:border-gray-700" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  </div>
);

export const LoginCard = () => {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Sign In to <span className="text-[#D22827]">ISUZU</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Access your dealer marketing management portal
          </p>
        </div>

        <LoginForm />
        
        <Divider text="Or continue with" />
        
        <SocialLoginButtons />

        {/* Contact Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Need access?{' '}
          <button
            type="button"
            className="text-[#D22827] hover:text-[#B91C1C] font-medium transition-colors"
          >
            Contact administrator
          </button>
        </p>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          2025 © ISUZU MARKETING CMS by 5V
        </p>
      </div>
    </div>
  );
};

