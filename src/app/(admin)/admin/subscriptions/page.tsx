'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  videoLimit: number;
  durationLimit: number; // in seconds
  sizeLimit: number; // in MB
  features: string[];
  active: boolean;
}

interface Promotion {
  id: string;
  name: string;
  code: string;
  discountPercentage: number;
  appliesTo: string; // plan ID
  startDate: Date;
  endDate: Date;
  active: boolean;
}

export default function SubscriptionManagementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'free',
      name: 'Free Plan',
      description: 'Basic video cropping features',
      price: 0,
      videoLimit: 5,
      durationLimit: 60,
      sizeLimit: 100,
      features: ['5 videos per month', '60 seconds max duration', '100MB max file size'],
      active: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'Enhanced video cropping with more capacity',
      price: 9.99,
      videoLimit: 40,
      durationLimit: 300,
      sizeLimit: 500,
      features: ['40 videos per month', '5 minutes max duration', '500MB max file size', 'Priority processing'],
      active: true
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'Advanced video cropping for professionals',
      price: 19.99,
      videoLimit: 120,
      durationLimit: 1800,
      sizeLimit: 2048,
      features: ['120 videos per month', '30 minutes max duration', '2GB max file size', 'Priority support'],
      active: true
    }
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'summer20',
      name: 'Summer Special',
      code: 'SUMMER20',
      discountPercentage: 20,
      appliesTo: 'premium',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-08-31'),
      active: true
    },
    {
      id: 'pro15',
      name: 'Pro Discount',
      code: 'PRO15',
      discountPercentage: 15,
      appliesTo: 'pro',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-07-31'),
      active: false
    }
  ]);

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch plans and promotions from Firestore
    // For now, we're using the initial state
    setLoading(false);
  }, []);

  const handleSavePlan = async (plan: SubscriptionPlan) => {
    try {
      // In a real app, update the plan in Firestore
      // await updateDoc(doc(db, 'subscriptionPlans', plan.id), plan);
      
      // Update local state
      setPlans(prevPlans => 
        prevPlans.map(p => p.id === plan.id ? plan : p)
      );
      
      setEditingPlan(null);
      alert(`Plan "${plan.name}" updated successfully`);
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan. Please try again.');
    }
  };

  const handleSavePromotion = async (promotion: Promotion) => {
    try {
      // In a real app, update the promotion in Firestore
      // await updateDoc(doc(db, 'promotions', promotion.id), promotion);
      
      // Update local state
      setPromotions(prevPromotions => 
        prevPromotions.map(p => p.id === promotion.id ? promotion : p)
      );
      
      setEditingPromotion(null);
      alert(`Promotion "${promotion.name}" updated successfully`);
    } catch (error) {
      console.error('Error updating promotion:', error);
      alert('Failed to update promotion. Please try again.');
    }
  };

  const handleTogglePlanStatus = async (planId: string, active: boolean) => {
    try {
      // In a real app, update the plan status in Firestore
      // await updateDoc(doc(db, 'subscriptionPlans', planId), { active });
      
      // Update local state
      setPlans(prevPlans => 
        prevPlans.map(p => p.id === planId ? { ...p, active } : p)
      );
      
      alert(`Plan ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating plan status:', error);
      alert('Failed to update plan status. Please try again.');
    }
  };

  const handleTogglePromotionStatus = async (promotionId: string, active: boolean) => {
    try {
      // In a real app, update the promotion status in Firestore
      // await updateDoc(doc(db, 'promotions', promotionId), { active });
      
      // Update local state
      setPromotions(prevPromotions => 
        prevPromotions.map(p => p.id === promotionId ? { ...p, active } : p)
      );
      
      alert(`Promotion ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating promotion status:', error);
      alert('Failed to update promotion status. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading subscription data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage subscription plans and promotional offers for the Bulk Video Cropper platform.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="mb-10">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subscription Plans</h2>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plan Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Limits
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full 
                        ${plan.id === 'free' ? 'bg-gray-100 text-gray-600' : 
                          plan.id === 'premium' ? 'bg-teal-100 text-teal-600' : 
                          'bg-purple-100 text-purple-600'} 
                        flex items-center justify-center font-bold`}>
                        {plan.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {plan.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">${plan.price.toFixed(2)}/month</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <ul className="list-disc pl-5">
                        <li>Videos: {plan.videoLimit}</li>
                        <li>Duration: {Math.floor(plan.durationLimit / 60)} min</li>
                        <li>Size: {plan.sizeLimit}MB</li>
                      </ul>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${plan.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePlanStatus(plan.id, !plan.active)}
                      className={`${plan.active ? 
                        'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 
                        'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}`}
                    >
                      {plan.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Promotional Offers</h2>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Promotion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Discount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date Range
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">
                        %
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {promo.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Code: <span className="font-mono">{promo.code}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{promo.discountPercentage}% off</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      For {plans.find(p => p.id === promo.appliesTo)?.name || promo.appliesTo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {promo.endDate > new Date() ? 
                        `Expires in ${Math.ceil((promo.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` : 
                        'Expired'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${promo.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {promo.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingPromotion(promo)}
                      className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePromotionStatus(promo.id, !promo.active)}
                      className={`${promo.active ? 
                        'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 
                        'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}`}
                    >
                      {promo.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => {
                const newPromo: Promotion = {
                  id: `promo-${Date.now()}`,
                  name: 'New Promotion',
                  code: 'NEWPROMO',
                  discountPercentage: 10,
                  appliesTo: 'premium',
                  startDate: new Date(),
                  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                  active: false
                };
                setEditingPromotion(newPromo);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              Create New Promotion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
