'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/config/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter, where, doc, updateDoc } from 'firebase/firestore';
import { User } from '@/types/user';

interface ExtendedUser extends User {
  id: string;
  createdAt: Date;
  formattedDate?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or subscription filter changes
    const filtered = users.filter(user => {
      const matchesSearch = 
        searchTerm === '' || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubscription = 
        subscriptionFilter === 'all' || 
        user.subscription === subscriptionFilter;
      
      return matchesSearch && matchesSubscription;
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, subscriptionFilter, users]);

  const fetchUsers = async (getMore = false) => {
    try {
      setLoading(true);
      let usersQuery;
      
      if (getMore && lastVisible) {
        usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else {
        usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(PAGE_SIZE)
        );
      }
      
      const userSnapshot = await getDocs(usersQuery);
      
      if (userSnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      // Set the last document for pagination
      setLastVisible(userSnapshot.docs[userSnapshot.docs.length - 1]);
      
      const usersData = userSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        
        return {
          id: doc.id,
          ...data,
          createdAt,
          formattedDate: formatDate(createdAt)
        } as ExtendedUser;
      });
      
      if (getMore) {
        setUsers(prev => [...prev, ...usersData]);
      } else {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchUsers(true);
    }
  };

  const handleUpdateSubscription = async (userId: string, newSubscription: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        subscription: newSubscription
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, subscription: newSubscription } 
            : user
        )
      );
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription. Please try again.');
    }
  };

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          View and manage all users of the Bulk Video Cropper platform.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Users
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by email or ID..."
              className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="subscription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subscription Type
            </label>
            <select
              id="subscription"
              className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
            >
              <option value="all">All Subscriptions</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSubscriptionFilter('all');
                fetchUsers();
              }}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Subscription
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-teal-500 rounded-full border-t-transparent"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.formattedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.subscription === 'pro' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 
                          user.subscription === 'premium' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.subscription ? (user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)) : 'Free'}
                      </span>
                      <div className="ml-2">
                        <select
                          className="text-xs border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded"
                          value={user.subscription || 'free'}
                          onChange={(e) => handleUpdateSubscription(user.id, e.target.value)}
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                          <option value="pro">Pro</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => alert('View details for ' + user.email)}
                      className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert('This would reset usage for ' + user.email)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Reset Usage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination/Load More */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{filteredUsers.length}</span> users
            </div>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
