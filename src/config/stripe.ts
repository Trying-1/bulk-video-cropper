/**
 * Stripe integration is temporarily disabled for security reasons
 * This file provides a placeholder implementation for future integration
 */

// Mock Stripe interface for type compatibility
interface MockStripe {
  // Add minimal interface properties needed by the application
  disabled: boolean;
  reason: string;
}

// Provide a simple mock implementation
const stripeMock: MockStripe = {
  disabled: true,
  reason: 'Stripe integration temporarily disabled for security improvements'
};

// Export the mock for type compatibility
export default stripeMock as any; // Using 'any' to maintain compatibility with Stripe usage
