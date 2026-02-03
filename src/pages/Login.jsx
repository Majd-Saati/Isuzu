import React from 'react';
import { LoginHero } from '../components/login/LoginHero';
import { LoginCard } from '../components/login/LoginCard';

const Login = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <LoginHero />
      <LoginCard />
    </div>
  );
};

export default Login;
