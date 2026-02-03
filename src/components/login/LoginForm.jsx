import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../../validations/loginValidation';
import { ErrorMessage } from '../ui/ErrorMessage';
import { useLogin } from '../../hooks/api/useAuth';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-transparent transition-all duration-200 ${
              formik.touched.email && formik.errors.email
                ? 'ring-2 ring-red-500 border-red-200 dark:border-red-800'
                : 'focus:ring-2 focus:ring-[#D22827]/30 focus:border-[#D22827]/50'
            } outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <ErrorMessage message={formik.errors.email} />
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="••••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-transparent transition-all duration-200 ${
              formik.touched.password && formik.errors.password
                ? 'ring-2 ring-red-500 border-red-200 dark:border-red-800'
                : 'focus:ring-2 focus:ring-[#D22827]/30 focus:border-[#D22827]/50'
            } outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <ErrorMessage message={formik.errors.password} />
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#D22827] focus:ring-2 focus:ring-[#D22827] focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
        </label>
        <a href="#" className="text-sm text-[#D22827] hover:text-[#B91C1C] font-medium transition-colors">
          Forgot password?
        </a>
      </div>

      {/* API Error */}
      {loginMutation.isError && (
        <ErrorMessage message={loginMutation.error?.message || 'Login failed. Please try again.'} />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-[#D22827] hover:bg-[#B91C1C] disabled:bg-[#D22827]/70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-[#D22827]/25 hover:shadow-xl hover:shadow-[#D22827]/30 hover:-translate-y-0.5"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
