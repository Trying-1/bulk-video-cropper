'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/config/firebase';
import { collection, query, getDocs, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import AdminHeader from '../components/AdminHeader';
import { MetricCard } from '../components/MetricCard';
import { LineChart } from '../components/LineChart';
import { PieChart } from '../components/PieChart';
import { 
  saveToLocalStorage, 
  getFromLocalStorage, 
  saveToSessionStorage, 
  getFromSessionStorage 
} from '@/utils/storageUtils';
import { adminStyles } from '../styles/adminStyles';
import { withAdminAuth } from '@/utils/withAdminAuth';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm rounded-md transition-all ${isActive 
        ? adminStyles.filterButton.active.all
        : adminStyles.filterButton.inactive}`}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
}

function AdvancedAnalyticsPage() {
  // Initialize activeTab from localStorage if available, otherwise default to 'user'
  const [activeTab, setActiveTab] = useState<'user' | 'business' | 'content' | 'technical'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bvc_admin_analytics_tab');
      return saved ? (saved as 'user' | 'business' | 'content' | 'technical') : 'user';
    }
    return 'user';
  });
  
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bvc_admin_analytics_timerange');
      return saved ? (saved as '7d' | '30d' | '90d' | 'all') : '30d';
    }
    return '30d';
  });
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Define chart data
  const userRetentionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Free',
        data: [100, 90, 85, 82, 78, 75],
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
      },
      {
        label: 'Premium',
        data: [100, 95, 92, 90, 88, 87],
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
      },
      {
        label: 'Pro',
        data: [100, 98, 96, 95, 94, 93],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
      },
    ],
  };

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bvc_admin_analytics_tab', activeTab);
    }
  }, [activeTab]);

  // Save timeRange to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bvc_admin_analytics_timerange', timeRange);
    }
  }, [timeRange]);

  // Fetch data based on active tab and time range
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch different data based on activeTab and timeRange
        // For this example, we'll simulate a loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDashboardData({
          metrics: {
            users: {
              total: 1250,
              growth: 12.5,
              trend: 'up'
            },
            revenue: {
              total: 15000,
              growth: 8.3,
              trend: 'up'
            },
            retention: {
              value: 87.2,
              growth: 3.1,
              trend: 'up'
            },
            churn: {
              value: 2.8,
              growth: -0.5,
              trend: 'down'
            }
          }
        });
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Handle error state
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, timeRange]);

  // Set the active tab and save to localStorage
  const setTab = (tab: 'user' | 'business' | 'content' | 'technical') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bvc_admin_analytics_tab', tab);
    }
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className={adminStyles.pageContainer}>
        <AdminHeader 
          title="Advanced Analytics" 
          description="Loading data..."
        />
        <div className={`${adminStyles.contentCard} flex justify-center items-center h-64`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 dark:border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.pageContainer}>
      <AdminHeader 
        title="Advanced Analytics" 
        description="In-depth metrics and business intelligence"
      />
      
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <TabButton isActive={activeTab === 'user'} onClick={() => setTab('user')}>User Metrics</TabButton>
          <TabButton isActive={activeTab === 'business'} onClick={() => setTab('business')}>Business Metrics</TabButton>
          <TabButton isActive={activeTab === 'content'} onClick={() => setTab('content')}>Content Analytics</TabButton>
          <TabButton isActive={activeTab === 'technical'} onClick={() => setTab('technical')}>Technical Performance</TabButton>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden shadow-sm">
          <button 
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 text-sm ${timeRange === '7d' ? adminStyles.filterButton.active.all : adminStyles.filterButton.inactive}`}
            aria-pressed={timeRange === '7d'}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 text-sm ${timeRange === '30d' ? adminStyles.filterButton.active.all : adminStyles.filterButton.inactive}`}
            aria-pressed={timeRange === '30d'}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 text-sm ${timeRange === '90d' ? adminStyles.filterButton.active.all : adminStyles.filterButton.inactive}`}
            aria-pressed={timeRange === '90d'}
          >
            Last 90 Days
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 text-sm ${timeRange === 'all' ? adminStyles.filterButton.active.all : adminStyles.filterButton.inactive}`}
            aria-pressed={timeRange === 'all'}
          >
            All Time
          </button>
        </div>
      </div>  

      {/* Last updated timestamp */}
      {lastUpdated && (
        <div className="text-right text-xs text-slate-500 dark:text-slate-400 mb-4">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
      
      {/* User Behavior Analytics */}
      {activeTab === 'user' && (
        <div>
          {/* User Insights Section */}
          <section className="mb-8">
            <h2 className={adminStyles.sectionTitle}>User Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Users" 
                value={dashboardData?.metrics.users.total.toString() || '0'}
                trend={{
                  value: dashboardData?.metrics.users.growth || 0,
                  label: 'vs last period',
                  direction: dashboardData?.metrics.users.trend || 'up'
                }}
              />
              <MetricCard 
                title="Retention Rate" 
                value={`${dashboardData?.metrics.retention.value || 0}%`}
                trend={{
                  value: dashboardData?.metrics.retention.growth || 0,
                  label: 'vs last period',
                  direction: dashboardData?.metrics.retention.trend || 'up'
                }}
              />
              <MetricCard 
                title="Monthly Revenue" 
                value={`$${dashboardData?.metrics.revenue.total || 0}`}
                trend={{
                  value: dashboardData?.metrics.revenue.growth || 0,
                  label: 'vs last month',
                  direction: dashboardData?.metrics.revenue.trend || 'up'
                }}
              />
              <MetricCard 
                title="Churn Rate" 
                value={`${dashboardData?.metrics.churn.value || 0}%`}
                trend={{
                  value: Math.abs(dashboardData?.metrics.churn.growth || 0),
                  label: 'vs last period',
                  direction: dashboardData?.metrics.churn.trend || 'down'
                }}
              />
            </div>
          </section>

          {/* User Retention Chart */}
          <section className="mb-8">
            <h2 className={adminStyles.sectionTitle}>User Retention by Plan</h2>
            <div className={adminStyles.contentCard}>
              <div className="h-80">
                <LineChart data={userRetentionData} />
              </div>
            </div>
          </section>

          {/* Demographics Section */}
          <section className="mb-8">
            <h2 className={adminStyles.sectionTitle}>User Demographics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={adminStyles.contentCard}>
                <h3 className={adminStyles.sectionTitle}>Device Distribution</h3>
                <div className="h-64">
                  <PieChart data={{
                    labels: ['Desktop', 'Mobile', 'Tablet'],
                    datasets: [{
                      data: [65, 30, 5],
                      backgroundColor: ['#0d9488', '#6366f1', '#8b5cf6'],
                      borderWidth: 1,
                    }]
                  }} />
                </div>
              </div>
              <div className={adminStyles.contentCard}>
                <h3 className={adminStyles.sectionTitle}>Subscription Types</h3>
                <div className="h-64">
                  <PieChart data={{
                    labels: ['Free', 'Premium', 'Pro'],
                    datasets: [{
                      data: [55, 30, 15],
                      backgroundColor: ['#94a3b8', '#0d9488', '#6366f1'],
                      borderWidth: 1,
                    }]
                  }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {activeTab === 'business' && (
        <div className={adminStyles.contentCard + " flex justify-center items-center h-64"}>
          <p className="text-slate-500 dark:text-slate-400">Business metrics data will appear here</p>
        </div>
      )}
      
      {activeTab === 'content' && (
        <div>
          <section className="mb-8">
            <h2 className={adminStyles.sectionTitle}>Credit Usage Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Credits Used" 
                value={dashboardData?.metrics?.credits?.total?.toString() || '0'}
                trend={{
                  value: dashboardData?.metrics?.credits?.growth || 0,
                  label: 'vs last period',
                  direction: dashboardData?.metrics?.credits?.trend || 'up'
                }}
                icon="video"
              />
              <MetricCard 
                title="Avg. Credits Per User" 
                value={(dashboardData?.metrics?.credits?.avgPerUser || 0).toFixed(1)}
                subtitle="Credits per active user"
                icon="processing"
              />
              <MetricCard 
                title="Most Active Plan" 
                value={dashboardData?.metrics?.credits?.mostActivePlan || 'Pro'}
                subtitle={`${dashboardData?.metrics?.credits?.mostActivePlanUsage || 75}% of total credits`}
                icon="premium"
              />
              <MetricCard 
                title="Peak Usage Day" 
                value={dashboardData?.metrics?.credits?.peakDay || 'Wednesday'}
                subtitle={`${dashboardData?.metrics?.credits?.peakDayCredits || 250} credits used`}
                icon="calendar"
              />
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={adminStyles.contentCard}>
                <h3 className={adminStyles.sectionTitle}>Credit Usage Over Time</h3>
                <div className="h-64">
                  <LineChart data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                      label: 'Credits Used',
                      data: [350, 420, 580, 690, 1250, 1580, 1890],
                      borderColor: '#0d9488',
                      backgroundColor: 'rgba(13, 148, 136, 0.2)',
                      tension: 0.3
                    }]
                  }} />
                </div>
              </div>
              <div className={adminStyles.contentCard}>
                <h3 className={adminStyles.sectionTitle}>Credits by Plan Type</h3>
                <div className="h-64">
                  <PieChart data={{
                    labels: ['Free Users', 'Premium Users', 'Pro Users'],
                    datasets: [{
                      data: [150, 650, 1750],
                      backgroundColor: ['#94a3b8', '#0d9488', '#6366f1'],
                      borderWidth: 1,
                    }]
                  }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {activeTab === 'technical' && (
        <div className={adminStyles.contentCard + " flex justify-center items-center h-64"}>
          <p className="text-slate-500 dark:text-slate-400">Technical performance data will appear here</p>
        </div>
      )}
    </div>
  );
}
export default withAdminAuth(AdvancedAnalyticsPage);
