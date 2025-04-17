# @tender-cash/agent-sdk-react

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

Import the `TenderAgentSdk` component and render it within your React application. Pass the required configuration as props.

```jsx
import React, { useState } from 'react';
import '@tender-cash/agent-sdk-react/dist/style.css'; // Don't forget styles!
import { TenderAgentSdk, onFinishResponse } from '@tender-cash/agent-sdk-react';

function PaymentComponent() {
  const [showSdk, setShowSdk] = useState(false);
  const [sdkResponse, setSdkResponse] = useState<onFinishResponse | null>(null);

  // --- Configuration ---
  const accessId = 'YOUR_ACCESS_ID'; // Replace with your actual Access ID
  const accessSecret = 'YOUR_ACCESS_SECRET'; // Replace with your actual Access Secret
  const amount = 150.00; // Amount to charge
  const fiatCurrency = 'USD'; // Currency code
  const environment = 'test'; // 'test' or 'live'

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
            accessSecret={accessSecret}
            amount={amount}
            fiatCurrency={fiatCurrency}
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

## Component Props (`TenderAgentProps`)

| Prop             | Type                                        | Required | Description                                                                 |
|------------------|---------------------------------------------|----------|-----------------------------------------------------------------------------|
| `amount`         | `number`                                    | Yes      | The amount to be charged in the specified fiat currency.                    |
| `fiatCurrency`   | `string`                                    | Yes      | The fiat currency code (e.g., "USD", "EUR").                               |
| `accessId`       | `string`                                    | Yes      | Your Tender Cash merchant Access ID.                                        |
| `accessSecret`   | `string`                                    | Yes      | Your Tender Cash merchant Access Secret.                                    |
| `env`            | `"test"` \| `"live"`                        | Yes      | The environment to use (`"test"` for testing, `"live"` for production).     |
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
