'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAppStateCookie, updateAppStateCookie } from '@/utils/cookies';
import { usePathname } from 'next/navigation';

// Define the user's progress stages
export type WorkflowStage = 
  | 'new_visitor'      // First time on the site
  | 'onboarding'       // Has seen intro but not signed up
  | 'new_user'         // Just created account
  | 'upload_ready'     // Ready to upload first video
  | 'first_upload'     // Has uploaded but not processed
  | 'first_process'    // Has processed first video
  | 'repeat_user'      // Has processed multiple videos
  | 'considering_upgrade' // Has viewed pricing page
  | 'upgraded'         // Has upgraded to premium
  | 'power_user';      // Active premium user

// Define the workflow context type
interface WorkflowContextType {
  currentStage: WorkflowStage;
  progress: number; // 0-100 representing user progression 
  showStageGuide: boolean;
  completedActions: string[];
  suggestedNextAction: string;
  suggestedNextPath: string;
  dismissStageGuide: () => void;
  markActionCompleted: (action: string) => void;
  updateWorkflowStage: (stage: WorkflowStage) => void;
}

// Create the workflow context
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Custom hook to use the workflow context
export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

// Workflow provider component
export function WorkflowProvider({ children }: { children: ReactNode }) {
  const { user, subscription } = useAuth();
  const pathname = usePathname();
  
  // State for workflow tracking
  const [currentStage, setCurrentStage] = useState<WorkflowStage>('new_visitor');
  const [progress, setProgress] = useState<number>(0);
  const [showStageGuide, setShowStageGuide] = useState<boolean>(false);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [suggestedNextAction, setSuggestedNextAction] = useState<string>('Explore the app');
  const [suggestedNextPath, setSuggestedNextPath] = useState<string>('/');
  
  // Load user workflow state from cookies on mount
  useEffect(() => {
    const appState = getAppStateCookie();
    
    if (appState) {
      // Load completed actions if present
      if (appState.completedWorkflowActions) {
        setCompletedActions(appState.completedWorkflowActions);
      }
      
      // Load current workflow stage if present
      if (appState.workflowStage) {
        setCurrentStage(appState.workflowStage as WorkflowStage);
      }
    }
    
    // Determine initial workflow stage based on user state
    determineWorkflowStage();
  }, [user, subscription]);
  
  // Update user progress based on the current stage
  useEffect(() => {
    // Map stages to progress percentages
    const stageProgressMap: Record<WorkflowStage, number> = {
      'new_visitor': 0,
      'onboarding': 10,
      'new_user': 20,
      'upload_ready': 30,
      'first_upload': 40,
      'first_process': 50,
      'repeat_user': 65,
      'considering_upgrade': 75,
      'upgraded': 85,
      'power_user': 100
    };
    
    setProgress(stageProgressMap[currentStage]);
    
    // Update cookie with current workflow stage
    updateAppStateCookie({
      workflowStage: currentStage,
      completedWorkflowActions: completedActions
    });
    
    // Update next suggested action based on stage
    updateSuggestedAction();
    
    // Show stage guide when stage changes (except for new visitors who get onboarding)
    if (currentStage !== 'new_visitor') {
      setShowStageGuide(true);
    }
  }, [currentStage, completedActions]);
  
  // Track page views to update workflow stage
  useEffect(() => {
    updateAppStateCookie({
      lastVisitedPage: pathname,
      lastInteraction: new Date().toISOString()
    });
    
    // Automatically update stage based on page visit
    if (pathname === '/plans' && !completedActions.includes('viewed_pricing')) {
      markActionCompleted('viewed_pricing');
      if (currentStage !== 'upgraded' && currentStage !== 'power_user') {
        updateWorkflowStage('considering_upgrade');
      }
    }
    
    if (pathname === '/editor' && !completedActions.includes('visited_editor')) {
      markActionCompleted('visited_editor');
      if (currentStage === 'new_user') {
        updateWorkflowStage('upload_ready');
      }
    }
    
    if (pathname === '/payment-success' && !completedActions.includes('payment_completed')) {
      markActionCompleted('payment_completed');
      updateWorkflowStage('upgraded');
    }
  }, [pathname]);
  
  // Determine the workflow stage based on user state and history
  const determineWorkflowStage = () => {
    if (!user) {
      if (completedActions.includes('saw_onboarding')) {
        setCurrentStage('onboarding');
      } else {
        setCurrentStage('new_visitor');
      }
      return;
    }
    
    // User is authenticated
    const hasPaidSubscription = subscription && subscription.plan?.name.toLowerCase() !== 'free';
    
    if (hasPaidSubscription) {
      if (completedActions.includes('processed_multiple_videos')) {
        setCurrentStage('power_user');
      } else {
        setCurrentStage('upgraded');
      }
      return;
    }
    
    // User is on free tier
    if (completedActions.includes('processed_video')) {
      if (completedActions.includes('viewed_pricing')) {
        setCurrentStage('considering_upgrade');
      } else if (completedActions.includes('processed_multiple_videos')) {
        setCurrentStage('repeat_user');
      } else {
        setCurrentStage('first_process');
      }
    } else if (completedActions.includes('uploaded_video')) {
      setCurrentStage('first_upload');
    } else if (completedActions.includes('visited_editor')) {
      setCurrentStage('upload_ready');
    } else {
      setCurrentStage('new_user');
    }
  };
  
  // Update the suggested next action based on current stage
  const updateSuggestedAction = () => {
    const suggestions: Record<WorkflowStage, { action: string, path: string }> = {
      'new_visitor': { 
        action: 'Sign up for free',
        path: '/auth?signup=true'
      },
      'onboarding': { 
        action: 'Create an account',
        path: '/auth?signup=true&source=guided' 
      },
      'new_user': { 
        action: 'Try the editor',
        path: '/editor' 
      },
      'upload_ready': { 
        action: 'Upload your first video',
        path: '/editor' 
      },
      'first_upload': { 
        action: 'Process your video',
        path: '/editor' 
      },
      'first_process': { 
        action: 'Upload more videos',
        path: '/editor' 
      },
      'repeat_user': { 
        action: 'Explore premium features',
        path: '/plans' 
      },
      'considering_upgrade': { 
        action: 'Upgrade now',
        path: '/payment?plan=premium' 
      },
      'upgraded': { 
        action: 'Process videos in batch',
        path: '/editor' 
      },
      'power_user': { 
        action: 'View processing history',
        path: '/history' 
      }
    };
    
    setSuggestedNextAction(suggestions[currentStage].action);
    setSuggestedNextPath(suggestions[currentStage].path);
  };
  
  // Handler to dismiss the stage guide
  const dismissStageGuide = () => {
    setShowStageGuide(false);
  };
  
  // Handler to mark an action as completed
  const markActionCompleted = (action: string) => {
    if (!completedActions.includes(action)) {
      const updatedActions = [...completedActions, action];
      setCompletedActions(updatedActions);
      
      // Update cookie
      updateAppStateCookie({
        completedWorkflowActions: updatedActions
      });
      
      // Update stage if needed based on the completed action
      if (action === 'saw_onboarding' && currentStage === 'new_visitor') {
        updateWorkflowStage('onboarding');
      }
      
      if (action === 'uploaded_video' && currentStage === 'upload_ready') {
        updateWorkflowStage('first_upload');
      }
      
      if (action === 'processed_video' && currentStage === 'first_upload') {
        updateWorkflowStage('first_process');
      }
      
      if (action === 'processed_multiple_videos' && currentStage === 'first_process') {
        updateWorkflowStage('repeat_user');
      }
    }
  };
  
  // Handler to manually update workflow stage
  const updateWorkflowStage = (stage: WorkflowStage) => {
    setCurrentStage(stage);
  };
  
  // Provide the workflow context
  return (
    <WorkflowContext.Provider
      value={{
        currentStage,
        progress,
        showStageGuide,
        completedActions,
        suggestedNextAction,
        suggestedNextPath,
        dismissStageGuide,
        markActionCompleted,
        updateWorkflowStage
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
