'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { User } from '@/types/user';
import { getUserData, getUserStats } from '@/services/userService';
import { clearUserSessionCookie, getUserSessionCookie, setUserSessionCookie, UserSession, getAppStateCookie, updateAppStateCookie } from '@/utils/cookies';
import { FEATURES } from '@/config/features';

interface LoadingState {
  user: boolean;
  stats: boolean;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className || ''}`} />
);

// Add a simple donut chart component for usage
function UsageDonut({ processed, limit }: { processed: number; limit: number }) {
  const percent = Math.min(100, Math.round((processed / limit) * 100));
  const radius = 36;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} aria-label="Video usage donut chart">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#14b8a6"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="1.1em"
        fill="#0f172a"
        className="dark:fill-gray-100"
      >
        {percent}%
      </text>
    </svg>
  );
}

// Edit Profile Modal (mock, no backend)
function EditProfileModal({ open, onClose, user, onSave }: { open: boolean; onClose: () => void; user: any; onSave: (data: any) => void }) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || '');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <label className="block mb-2 text-sm font-medium">Display Name</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
        />
        <label className="block mb-2 text-sm font-medium">Avatar URL</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-teal-600 text-white" onClick={() => { onSave({ displayName, photoURL: avatar }); onClose(); }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function ProfileDisabled() {
  return <div className="p-8 text-center text-gray-500">Profile is currently disabled.</div>;
}

export default FEATURES.ENABLE_PROFILE && FEATURES.ENABLE_USER_SYSTEM ? Profile : ProfileDisabled;
