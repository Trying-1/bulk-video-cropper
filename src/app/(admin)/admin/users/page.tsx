'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/config/firebase';
import { collection, getDocs, doc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { adminStyles } from '../styles/adminStyles';
import { saveToLocalStorage, getFromLocalStorage } from '@/utils/storageUtils';
import { withAdminAuth } from '@/utils/withAdminAuth';
import { toast } from 'react-hot-toast';

interface ExtendedUser {
  id: string;
  email?: string;
  displayName?: string;
  createdAt: Date;
  formattedDate?: string;
}

function UsersPage() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term changes
    const filtered = users.filter(user => {
      const matchesSearch = 
        searchTerm === '' || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

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



  return (
    // CSRF protection token is handled by Next.js middleware
    <div className={adminStyles.pageContainer}>
      <div className="mb-8">
        <h1 className={adminStyles.pageTitle}>User Management</h1>
        <p className={adminStyles.pageDescription}>
          View and manage all users of the Bulk Video Cropper platform.
        </p>
      </div>

      {/* Filter Controls */}
      <div className={adminStyles.contentCard}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Search Users
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by email or ID..."
              className={adminStyles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users by email or ID"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                fetchUsers();
              }}
              className={adminStyles.secondaryButton}
              aria-label="Reset search and refresh users"
            >
              Reset & Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table className={adminStyles.table} aria-label="Users table">
              <thead className={adminStyles.tableHeader}>
                <tr>
                  <th scope="col" className={adminStyles.tableHeaderCell}>
                    User
                  </th>
                  <th scope="col" className={adminStyles.tableHeaderCell}>
                    Joined
                  </th>

                  <th scope="col" className={adminStyles.tableHeaderCell}>
                    Status
                  </th>
                  <th scope="col" className={adminStyles.tableHeaderCell}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={adminStyles.tableBody}>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap">
                      <div className={`${adminStyles.contentCard} flex justify-center items-center h-64`}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 dark:border-teal-400" aria-label="Loading users"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                      No users found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={adminStyles.tableRow}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-300">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={adminStyles.tableCell}>
                        <div className="text-sm text-gray-800 dark:text-gray-200">{user.formattedDate}</div>
                      </td>

                      <td className={adminStyles.tableCell}>
                        <span className={adminStyles.statusPill.active} aria-label="User status: Active">
                          Active
                        </span>
                      </td>
                      <td className={adminStyles.tableCell + " text-right"}>
                        <button
                          onClick={() => alert('View details for ' + user.email)}
                          className="text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 mr-3 font-medium"
                          aria-label={`View details for ${user.email}`}
                        >
                          View
                        </button>
                        <button
                          onClick={() => alert('This would reset usage for ' + user.email)}
                          className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                          aria-label={`Reset usage for ${user.email}`}
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
              <div className="px-6 py-4 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center bg-gray-300 dark:bg-gray-700">
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  Showing <span className="font-semibold">{filteredUsers.length}</span> users
                </div>
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className={`${adminStyles.primaryButton} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Load more users"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export with withAdminAuth
export default withAdminAuth(UsersPage);
