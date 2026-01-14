# @tender-cash/agent-sdk-react

[![npm version](https://badge.fury.io/js/%40tender-cash%2Fagent-sdk-react.svg)](https://badge.fury.io/js/%40tender-cash%2Fagent-sdk-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React component library for integrating the Tender Cash payment flow into your application.

## Installation

Using yarn:
```bash
yarn add @tender-cash/agent-sdk-react
```

Using npm:
```bash
npm install @tender-cash/agent-sdk-react
```

## Styling

The component requires its CSS file to be imported for proper styling. Import it in your main application entry point (e.g., `src/index.js`, `src/main.tsx`):

```javascript
import '@tender-cash/agent-sdk-react/dist/style.css';
```

## Usage

There are two ways to use the Tender Cash SDK:
1. Using the `TenderAgentSdk` component with a ref (recommended)
2. Rendering the `TenderAgentSdk` component directly (legacy approach)

### Method 1: Using `TenderAgentSdk` Component with Ref (Recommended)

For more control over the modal, use the `TenderAgentSdk` component with a ref. This allows you to programmatically initiate and dismiss the payment modal.

```jsx
import { useRef } from 'react';
import '@tender-cash/agent-sdk-react/dist/style.css'; // Don't forget styles!
import { TenderAgentSdk, TenderAgentRef, onFinishResponse } from '@tender-cash/agent-sdk-react';

function PaymentComponent() {
  const tenderRef = useRef<TenderAgentRef>(null);

  // --- Static Configuration ---
  const accessId = 'YOUR_ACCESS_ID'; // Replace with your actual Access ID
  const fiatCurrency = 'USD'; // Currency code

  const handleEventResponse = (response: onFinishResponse) => {
    console.log('SDK Response:', response);
    // Handle success, partial payment, overpayment, error based on response.status
  };

  const handleOpenModal = () => {
    tenderRef.current?.initiatePayment({
      amount: 150.00,
      referenceId: 'unique-payment-reference-123',
      env: 'test',
      paymentExpirySeconds: 1800,
    });
  };

  const handleDismissModal = () => {
    tenderRef.current?.dismiss();
  };

  return (
    <div>
      <button onClick={handleOpenModal}>
        Pay ${amount.toFixed(2)} {fiatCurrency}
      </button>
      <button onClick={handleDismissModal}>
        Close Modal
      </button>

      <TenderAgentSdk
        ref={tenderRef}
        accessId={accessId}
        fiatCurrency={fiatCurrency}
        onEventResponse={handleEventResponse}
      />
    </div>
  );
}

export default PaymentComponent;
```

### Method 3: Using `TenderAgentSdk` Component Directly (Legacy)

Alternatively, you can render the `TenderAgentSdk` component directly within your React application using conditional rendering.

```jsx
import React, { useState } from 'react';
import '@tender-cash/agent-sdk-react/dist/style.css'; // Don't forget styles!
import { TenderAgentSdk, onFinishResponse } from '@tender-cash/agent-sdk-react';

function PaymentComponent() {
  const [showSdk, setShowSdk] = useState(false);
  const [sdkResponse, setSdkResponse] = useState<onFinishResponse | null>(null);

  // --- Configuration ---
  const accessId = 'YOUR_ACCESS_ID'; // Replace with your actual Access ID
  const amount = 150.00; // Amount to charge
  const fiatCurrency = 'USD'; // Currency code
  const environment = 'test'; // 'test' or 'live'
  const referenceId = 'unique-payment-reference-123'; // Unique reference for this payment

  const handlePaymentRequest = () => {
    setSdkResponse(null);
    setShowSdk(true);
  };

  const handleEventResponse = (response: onFinishResponse) => {
    console.log('SDK Response:', response);
    setSdkResponse(response);
    setShowSdk(false); // Hide the component after response
    // Handle success, partial payment, overpayment, error based on response.status
  };

  return (
    <div>
      {!showSdk && (
        <button onClick={handlePaymentRequest}>
          Pay ${amount.toFixed(2)} {fiatCurrency}
        </button>
      )}

      {showSdk && (
        <div>
          <TenderAgentSdk
            accessId={accessId}
            amount={amount}
            fiatCurrency={fiatCurrency}
            referenceId={referenceId}
            env={environment}
            onEventResponse={handleEventResponse}
          />
          <button onClick={() => setShowSdk(false)}>Cancel Payment</button>
        </div>
      )}

      {sdkResponse && (
        <div>
          <h3>Payment Result:</h3>
          <p>Status: {sdkResponse.status}</p>
          <p>Message: {sdkResponse.message}</p>
          {sdkResponse.data && <pre>{JSON.stringify(sdkResponse.data, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
}

export default PaymentComponent;
```

## API Reference

### `TenderAgentSdk` Component with Ref

The `TenderAgentSdk` component can be used with a ref to programmatically control the modal.

**Ref Methods (`TenderAgentRef`):**

| Method              | Description                                              |
|---------------------|----------------------------------------------------------|
| `initiatePayment()` | Initiates a payment and opens the payment modal          |
| `dismiss()`         | Closes/dismisses the payment modal                       |

**Example:**
```typescript
import { useRef } from 'react';
import { TenderAgentSdk, TenderAgentRef } from '@tender-cash/agent-sdk-react';

const tenderRef = useRef<TenderAgentRef>(null);

// Open modal
tenderRef.current?.initiatePayment({
  amount: 150.00,
  referenceId: 'unique-payment-reference-123',
  env: 'test',
  paymentExpirySeconds: 1800,
});

// Close modal
tenderRef.current?.dismiss();

// Render component
<TenderAgentSdk
  ref={tenderRef}
  accessId="YOUR_ACCESS_ID"
  fiatCurrency="USD"
/>;
```

### Component Props (`TenderAgentProps`)

The `TenderAgentSdk` component (when used directly) accepts the following configuration props:

| Prop             | Type                                        | Required | Description                                                                 |
|------------------|---------------------------------------------|----------|-----------------------------------------------------------------------------|
| `fiatCurrency`   | `string`                                    | Yes      | The fiat currency code (e.g., "USD", "EUR").                               |
| `accessId`       | `string`                                    | Yes      | Your Tender Cash merchant Access ID.                                        |
| `onEventResponse`| `(data: onFinishResponse) => void`          | No       | Optional callback function triggered on payment completion or status change. |

## Callback Data (`onFinishResponse`)

The `onEventResponse` callback receives an object with the following structure:

```typescript
interface onFinishResponse {
  status: "partial-payment" | "completed" | "overpayment" | "pending" | "error" | "cancelled";
  message: string;
  data: IPaymentData | undefined; // Contains details like amountPaid, coin, address, etc.
}

interface IPaymentData {
  id?: string;
  amount?: number;
  coinAmount?: number;
  coin?: string;
  chain?: string;
  address?: string;
  amountPaid?: string;
  balance?: string;
  status?: "partial-payment" | "completed" | "overpayment" | "pending" | "error" | "cancelled";
}
```

## License

[MIT](./LICENSE) 
