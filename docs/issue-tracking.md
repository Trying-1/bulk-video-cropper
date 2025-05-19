# Issues Faced and Resolved

This document tracks significant issues encountered during the development of the Bulk Video Cropper application and their resolutions. It serves as both a historical record and a reference for similar issues that may arise in the future.

## TypeScript Build Errors

### Issue: Static Generation Errors with useSearchParams

**Problem:**
Pages using `useSearchParams()` from Next.js would throw errors during build time because this hook is meant for client-side execution but was being invoked during static generation.

**Affected Components:**
- EditorPage
- PaymentPage
- PaymentSuccessPage
- PaymentFormPage

**Error Message:**
```
Error: useSearchParams() is a Client Component hook that cannot be used within a Server Component.
```

**Solution:**
1. Added `export const dynamic = 'force-dynamic'` to affected page components
2. Wrapped components using `useSearchParams()` in a `<Suspense>` boundary
3. Used proper Next.js data fetching patterns to avoid static generation conflicts

**Code Implementation:**
```typescript
"use client";

// This prevents static generation errors with useSearchParams
export const dynamic = 'force-dynamic';

// Component implementation
export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
```

### Issue: TypeScript Errors in EditorPage

**Problem:**
The EditorPage component had serious structural issues where component code was placed after return statements, causing multiple TypeScript errors. Additionally, there were issues with EditorSettings type usage.

**Error Messages:**
```
TS1128: Declaration or statement expected.
TS2345: Argument of type is not assignable...
TS2339: Property does not exist on type...
```

**Solution:**
1. Properly restructured the EditorPage component by moving all code before the return statement
2. Fixed incorrect usage of EditorSettings by adding proper null checking
3. Fixed method calls using the correct parameter types

**Code Implementation:**
```typescript
// Before accessing potentially null values
const currentSettings = getEditorSettingsCookie() || DEFAULT_EDITOR_SETTINGS;

// Proper type implementation for EditorSettings
setEditorSettingsCookie({
  aspectRatio: ratio,
  useCurrentCropForAll: currentSettings.useCurrentCropForAll,
  lastUploadDirectory: currentSettings.lastUploadDirectory
});
```

## User Interface Issues

### Issue: Intrusive Popup Notifications

**Problem:**
Users reported that popup notifications (particularly the QuickStart popup and Welcome to Premium popup) were interrupting their workflow and causing frustration.

**Solution:**
1. Removed the QuickStart popup completely
2. Removed the WorkflowGuide component that displayed the Welcome to Premium popup
3. Implemented a more subtle notification system using inline messages and non-blocking toasts
4. Updated documentation to reflect a commitment to a non-intrusive UI

### Issue: Missing Terms of Service Acceptance

**Problem:**
The application lacked proper Terms of Service acceptance functionality, creating potential legal compliance issues.

**Solution:**
1. Implemented checkbox-based Terms of Service acceptance on signup and signin pages
2. Added proper validation to prevent form submission without acceptance
3. Created dedicated legal pages with proper navigation
4. Implemented a minimally intrusive cookie consent banner

## Payment Processing Issues

### Issue: Payment Integration Complexity

**Problem:**
Integrating Stripe presented challenges in maintaining a clean UI while ensuring proper error handling and security.

**Solution:**
1. Implemented Stripe Elements for a secure payment UI that handles validation
2. Created backend endpoints for secure payment processing
3. Implemented comprehensive error handling for payment issues
4. Added proper success/failure flows without intrusive popups
5. Set up robust webhook handling for subscription events

**Code Implementation:**
```typescript
// Client-side payment processing with inline error handling
const { error, paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: elements.getElement(CardElement),
});

if (error) {
  setError(error.message); // Inline error message
  setProcessing(false);
} else {
  // Proceed with payment...
}
```

## Video Processing Issues

### Issue: FFmpeg Loading Strategy

**Problem:**
Different FFmpeg loading approaches had varying impacts on performance, user experience, and monetization strategies.

**Solution:**
1. Analyzed multiple FFmpeg loading strategies
2. Implemented an optimized loading approach that balances performance and user experience
3. Created comprehensive documentation on the chosen strategy
4. Added appropriate progress indicators during video processing

## Deployment Issues

### Issue: Environmental Variable Management

**Problem:**
Securely managing sensitive API keys (particularly for Stripe) across different environments while ensuring they're available where needed.

**Solution:**
1. Separated environment variables into `.env.local` and `.env.production`
2. Used proper naming conventions for client-side exposed variables (NEXT_PUBLIC_*)
3. Implemented validation checks to ensure required environment variables are present
4. Added documentation on proper environment setup

## Performance Issues

### Issue: Large Video Processing Performance

**Problem:**
Processing large videos in the browser caused performance issues and potential crashes.

**Solution:**
1. Implemented file size and duration limits based on subscription tier
2. Added clear validation feedback for files exceeding limits
3. Optimized video processing by using chunked processing for larger files
4. Implemented cancellation support for long-running processes

## Next Steps

While many issues have been resolved, there are still areas for improvement:

1. **Automated Testing:** Implement more comprehensive unit and integration tests to catch issues earlier
2. **Performance Optimization:** Continue optimizing video processing for larger files
3. **Error Telemetry:** Implement better error tracking to catch issues in production
4. **User Flow Analysis:** Gather metrics on common user paths to identify potential friction points
5. **Accessibility Improvements:** Ensure the application meets WCAG guidelines
