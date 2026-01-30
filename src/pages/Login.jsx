import React from 'react';
import { LoginHero } from '../components/login/LoginHero';
import { LoginCard } from '../components/login/LoginCard';

const Login = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-gray-950">
      <LoginHero />
      <LoginCard />
    </div>
  );
};

export default Login;
