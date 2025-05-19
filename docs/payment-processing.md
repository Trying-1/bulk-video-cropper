# Payment Processing Documentation

## Stripe Integration Overview

This document details the integration of Stripe for payment processing in the Bulk Video Cropper application. The integration follows a clean, user-friendly approach without intrusive popups while maintaining robust security and error handling.

## Implementation Components

### 1. API Configuration

#### Key Management

- **Publishable Key**: Stored safely in environment variables for client-side Stripe Elements
- **Secret Key**: Secured in server-side environment variables, never exposed to the client
- **Webhook Secret**: Used to verify incoming webhook events from Stripe

```javascript
// Environment variables structure (.env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### API Initialization

```javascript
// Server-side Stripe initialization
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Using a specific API version for stability
  appInfo: {
    name: 'Bulk Video Cropper',
    version: '1.0.0',
  },
});

// Client-side initialization for Stripe Elements
import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

### 2. Frontend Payment Components

#### Stripe Elements Integration

A clean, minimal payment form using Stripe Elements has been implemented with the following features:

- **Card Element**: Secure input for card details with built-in validation
- **Address Element**: Collects billing address with international support
- **Non-intrusive Error Display**: Inline error messages without modal popups
- **Loading States**: Clear visual feedback during processing without full-page overlays

```jsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Wrapper component with Stripe context
export default function PaymentFormPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

// Actual payment form component
function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Payment submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please refresh the page.');
      setProcessing(false);
      return;
    }
    
    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    
    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      // Send to server for processing
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentMethodId: paymentMethod.id,
          priceId: selectedPriceId,
        }),
      });
      
      const subscription = await response.json();
      
      // Handle subscription response
      if (subscription.error) {
        setError(subscription.error);
        setProcessing(false);
      } else {
        // Success handling without popups
        router.push(`/payment-success?session_id=${subscription.id}`);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={cardElementOptions} />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={processing}>
        {processing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
}
```

### 3. Backend Payment Processing

#### Subscription Creation Endpoint

```javascript
// /api/create-subscription endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { paymentMethodId, priceId } = req.body;
  const { uid } = req.auth; // From auth middleware
  
  try {
    // Get or create customer
    let customerId;
    const userRecord = await db.collection('users').doc(uid).get();
    
    if (userRecord.exists && userRecord.data().stripeCustomerId) {
      customerId = userRecord.data().stripeCustomerId;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: req.user.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      
      customerId = customer.id;
      
      // Save customer ID to user record
      await db.collection('users').doc(uid).update({
        stripeCustomerId: customerId,
      });
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    
    // Return subscription details
    return res.json({
      id: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(400).json({ error: error.message });
  }
}
```

#### Webhook Handler for Subscription Events

```javascript
// /api/webhook endpoint
export default async function handler(req, res) {
  const signature = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle specific events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

async function handleSubscriptionChange(subscription) {
  // Get customer information
  const customer = await stripe.customers.retrieve(subscription.customer);
  
  // Find user by customer ID
  const userSnapshot = await db.collection('users')
    .where('stripeCustomerId', '==', subscription.customer)
    .limit(1)
    .get();
    
  if (userSnapshot.empty) {
    console.error('No user found with customer ID:', subscription.customer);
    return;
  }
  
  const userData = userSnapshot.docs[0];
  
  // Update user subscription info
  await userData.ref.update({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      plan: subscription.items.data[0].price.product,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}
```

### 4. Success and Error Handling

#### Success Page

A clean, informative success page has been implemented to confirm successful payments without intrusive popups:

```jsx
// /payment-success page component
export default function PaymentSuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!session_id) return;
    
    async function fetchSubscriptionDetails() {
      try {
        const response = await fetch(`/api/subscription-details?session_id=${session_id}`);
        const data = await response.json();
        
        if (data.error) {
          console.error('Error fetching subscription details:', data.error);
        } else {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscriptionDetails();
  }, [session_id]);
  
  return (
    <div className="success-container">
      <h1>Thank You for Your Subscription!</h1>
      
      {loading ? (
        <p>Loading your subscription details...</p>
      ) : subscription ? (
        <div className="subscription-details">
          <p>Your {subscription.plan} plan is now active.</p>
          <p>Next billing date: {formatDate(subscription.currentPeriodEnd)}</p>
          <div className="action-buttons">
            <button onClick={() => router.push('/editor')}>
              Start Using Premium Features
            </button>
            <Link href="/profile/subscription">
              Manage Subscription
            </Link>
          </div>
        </div>
      ) : (
        <p>Subscription details not found. Please check your account.</p>
      )}
    </div>
  );
}
```

#### Error Handling

A comprehensive approach to error handling has been implemented:

1. **Client-Side Validation**: Pre-validates payment details before submission
2. **Inline Error Messages**: Displays specific error messages directly in the payment form
3. **Transaction Error Recovery**: Provides clear guidance on how to resolve payment issues
4. **Network Error Handling**: Gracefully handles API connectivity issues
5. **Session Management**: Preserves form data when possible to avoid re-entry after errors

## Security Measures

1. **PCI Compliance**: Using Stripe Elements to ensure card data never touches our servers
2. **HTTPS Only**: All payment communications occur over secure connections
3. **Webhook Signature Verification**: Prevents tampering with Stripe event notifications
4. **API Key Rotation**: Regular rotation of API keys with zero-downtime transitions
5. **Restricted API Permissions**: Using restricted API keys with only necessary permissions
6. **Request Validation**: Server-side validation of all payment request parameters

## Testing and Validation

### Test Accounts and Cards

Striped test mode is configured with the following test cards for development and QA:

- `4242 4242 4242 4242`: Successful payment
- `4000 0000 0000 0341`: Failed payment (insufficient funds)
- `4000 0000 0000 3220`: 3D Secure authentication required

### Integration Tests

A comprehensive test suite validates the payment flow, including:

1. Successful subscription creation
2. Failed payment handling
3. Subscription updates and cancellations
4. Webhook event processing
5. Error scenario handling
