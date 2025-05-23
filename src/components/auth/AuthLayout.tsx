'use client';

import { useState, useEffect } from 'react';
import { signInUser, createUser, resetPassword, sendVerificationEmail } from '@/services/firebaseService';
import { getAuthErrorMessage } from '@/utils/authErrorHandler';
import { User } from '@/types/user';
import { createUser as createUserService } from '@/services/userService';
import { auth } from '@/config/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Removed Google Auth imports
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

// Removed Google provider instance

export default function AuthLayout() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [username, setUsername] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Track if user came from free tier button
  const [isFromFreeTier, setIsFromFreeTier] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in, redirect them appropriately
    if (user) {
      // Get the return URL from query parameters or default to profile
      const returnUrl = searchParams.get('returnUrl') || '/profile';
      
      // If the user just completed authentication, show a welcome message
      toast.success('Welcome back!');
      
      // Redirect to the appropriate page
      router.push(returnUrl);
    }
  }, [user, router, searchParams]);
  
  useEffect(() => {
    // Check URL parameters for source, signup status, and forgot password
    const signupParam = searchParams.get('signup');
    const forgotParam = searchParams.get('forgot');
    const sourceParam = searchParams.get('source');
    
    if (forgotParam === 'true') {
      setForgotPassword(true);
      setIsSignUp(false);
    } else if (signupParam === 'true') {
      setIsSignUp(true);
    }
    
    // Set flag if user came from free tier button
    if (sourceParam === 'free') {
      setIsFromFreeTier(true);
    }
    
    // Removed Google authentication redirect handling
    // Clear any existing Google redirect flags
    if (localStorage.getItem('pendingGoogleRedirect')) {
      localStorage.removeItem('pendingGoogleRedirect');
    }
  }, [router, searchParams]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      
      const result = await resetPassword(email);
      
      if (result.success) {
        toast.success('Password reset email sent. Please check your inbox.');
        // Reset to sign in mode after successful password reset request
        setForgotPassword(false);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      toast.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength (0-4)
  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    
    return strength;
  };
  
  // Handle password change and update strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };
  
  const handleResendVerificationEmail = async () => {
    setLoading(true);
    try {
      const result = await sendVerificationEmail();
      if (result.success) {
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowVerificationMessage(false);
    
    // Check if terms are accepted for sign up or sign in
    if (!acceptTerms && !forgotPassword) {
      setError('You must accept the Terms of Service and Privacy Policy to continue');
      return;
    }
    
    // Check if passwords match for signup
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Check password strength for signup
    if (isSignUp && passwordStrength < 2) {
      setError('Please use a stronger password');
      return;
    }
    
    setLoading(true);
    
    try {
      if (forgotPassword) {
        await handleForgotPassword(e);
        return;
      }
      
      if (isSignUp) {
        // First create Firebase auth user
        await createUser(email, password);
        // Then create Firestore user record with username
        const user = await auth.currentUser;
        if (user) {
          await createUserService(user.uid, user.email, username);
        }
        // Show verification message and remember the email for resending
        setVerificationEmail(email);
        setShowVerificationMessage(true);
        toast.success('Account created successfully! Please verify your email.');
        // Clear the form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setIsSignUp(false);
      } else {
        await signInUser(email, password);
        
        // Check if email is verified
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
          // Show verification message if email is not verified
          setVerificationEmail(email);
          setShowVerificationMessage(true);
          setLoading(false);
          return;
        }
        
        toast.success('Logged in successfully!');
        
        // Get the current URL before redirect
        const currentUrl = window.location.href;
        // If we came from the landing page, redirect to editor
        if (currentUrl.includes('/auth') && !isSignUp) {
          router.push('/editor');
        } else {
          // Otherwise, redirect to profile
          router.push('/profile');
        }
      }
    } catch (err: any) {
      toast.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  
  // Removed Google sign-in handler

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Panel - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 p-12 flex-col justify-between text-white">
        <div>
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-teal-700 text-2xl font-bold">BV</span>
            </div>
            <h1 className="text-2xl font-bold">Bulk Video Cropper</h1>
          </Link>
          
          <div className="mt-20 max-w-md">
            <h2 className="text-3xl font-bold mb-6">Bulk edit your videos in seconds</h2>
            <p className="text-lg text-teal-100 mb-8">
              Crop multiple videos simultaneously for every social platform, saving you hours of manual editing time.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Batch Processing</h3>
                  <p className="text-teal-200 text-sm">Edit up to 50 videos at once</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Smart Cropping</h3>
                  <p className="text-teal-200 text-sm">Intelligent subject detection</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Multi-Platform Export</h3>
                  <p className="text-teal-200 text-sm">Optimized for all social media</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-teal-200">
          {new Date().getFullYear()} Bulk Video Cropper. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-teal-50 dark:hover:bg-gray-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {forgotPassword ? 'Reset your password' : isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {forgotPassword 
                ? 'Enter your email to receive a password reset link' 
                : isSignUp 
                  ? 'Start your video editing journey' 
                  : 'Sign in to continue to your profile'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isSignUp && !forgotPassword && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {!forgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required={!forgotPassword}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {isSignUp && (
                    <div className="mt-1">
                      <div className="flex items-center space-x-1 mb-1">
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 4 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {passwordStrength === 0 && 'Enter a password'}
                        {passwordStrength === 1 && 'Weak - Use at least 8 characters with letters, numbers, and symbols'}
                        {passwordStrength === 2 && 'Fair - Add more characters or symbols'}
                        {passwordStrength === 3 && 'Good - Password is strong'}
                        {passwordStrength === 4 && 'Excellent - Password is very strong'}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {isSignUp && !forgotPassword && (
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${confirmPassword && password !== confirmPassword ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-900 focus:ring-teal-500 focus:border-teal-500'} placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            {!isSignUp && !forgotPassword && (
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <button 
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}

            {!forgotPassword && (
              <div className="flex items-start mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
                <div className="flex items-center h-6">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="focus:ring-teal-500 h-5 w-5 text-teal-600 border-2 border-gray-400 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-bold text-gray-800">
                    I accept the 
                    <Link href="/legal/terms" className="text-teal-600 hover:text-teal-500 underline"> Terms of Service</Link> and 
                    <Link href="/legal/privacy" className="text-teal-600 hover:text-teal-500 underline"> Privacy Policy</Link>
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              {forgotPassword ? (
                <p className="text-gray-600 dark:text-gray-300">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Back to sign in
                  </button>
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            {showVerificationMessage && (
              <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Email Verification Required</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <p>
                        We've sent a verification email to <strong>{verificationEmail}</strong>. 
                        Please check your inbox and click the verification link to activate your account.
                      </p>
                      <p className="mt-2">
                        Didn't receive the email?{' '}
                        <button
                          type="button"
                          onClick={handleResendVerificationEmail}
                          disabled={loading}
                          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                          {loading ? 'Sending...' : 'Resend verification email'}
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || (!forgotPassword && !acceptTerms)}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${(loading || (!forgotPassword && !acceptTerms)) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </>
                ) : forgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Removed Google sign-in option */}

          {/* Toggle removed to avoid duplication with the link above */}
          
          {/* Continue without signup option - only shown when coming from free tier */}
          {isFromFreeTier && (
            <div className="text-center mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
                    OR
                  </span>
                </div>
              </div>
              <Link 
                href="/editor?guest=true" 
                className="inline-flex items-center justify-center mt-3 text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
                Continue without signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
