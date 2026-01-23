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

## Usage

Pass all payment parameters directly as props. The modal will automatically open when the component mounts with the required payment parameters.

```jsx
import { TenderAgentSdk, onFinishResponse } from '@tender-cash/agent-sdk-react';

function PaymentComponent() {
  const handleEventResponse = (response: onFinishResponse) => {
    console.log('SDK Response:', response);
    // Handle success, partial payment, overpayment, error based on response.status
  };

  return (
    <TenderAgentSdk
      accessId="YOUR_ACCESS_ID"
      fiatCurrency="USD"
      env="test"
      onEventResponse={handleEventResponse}
      amount={150.00}
      referenceId="unique-payment-reference-123"
      paymentExpirySeconds={1800}
    />
  );
}

export default PaymentComponent;
```

**Note:** The modal opens automatically on component mount when `referenceId` and `amount` are provided as props.

## API Reference

### Component Props (`TenderAgentProps`)

The `TenderAgentSdk` component accepts the following props:

#### Required Props

| Prop             | Type                                        | Description                                                                 |
|------------------|---------------------------------------------|-----------------------------------------------------------------------------|
| `fiatCurrency`   | `string`                                    | The fiat currency code (e.g., "USD", "EUR").                               |
| `accessId`       | `string`                                    | Your Tender Cash merchant Access ID.                                        |
| `env`            | `"test"` \| `"live"` \| `"local"`          | The environment to use (`"test"` for testing, `"live"` for production, `"local"` for local development). |

#### Optional Props

| Prop                    | Type                                        | Description                                                                 |
|-------------------------|---------------------------------------------|-----------------------------------------------------------------------------|
| `onEventResponse`       | `(data: onFinishResponse) => void`          | Callback function triggered on payment completion or status change.         |
| `referenceId`           | `string`                                    | Payment reference ID. Required to auto-open the modal.                     |
| `amount`               | `number`                                    | Payment amount in fiat currency. Required to auto-open the modal.          |
| `paymentExpirySeconds` | `number`                                    | Payment expiry time in seconds. Optional, defaults to 30 minutes.           |
| `theme`                | `"light"` \| `"dark"`                       | Theme for the payment modal. Optional, defaults to "light".                 |


**Note:** When `referenceId` and `amount` are provided as props, the modal will automatically open on component mount.

### Using Ref to Control Modal

You can use a ref to programmatically control the modal from outside the widget:

```jsx
import { useRef } from 'react';
import { TenderAgentSdk, TenderAgentRef } from '@tender-cash/agent-sdk-react';

function PaymentComponent() {
  const tenderRef = useRef<TenderAgentRef>(null);

  const handleEventResponse = (response) => {
    console.log("response");
  }

  const handleOpenPayment = () => {
    tenderRef.current?.initiatePayment({
      amount: 150.00,
      referenceId: "unique-payment-reference-123",
      paymentExpirySeconds: 1800
    });
  };

  const handleCloseModal = () => {
    // Close the modal programmatically from outside the widget
    tenderRef.current?.closeModal();
  };

  return (
    <>
      <button onClick={handleOpenPayment}>Open Payment</button>
      <button onClick={handleCloseModal}>Close Modal</button>
      
      <TenderAgentSdk
        ref={tenderRef}
        accessId="YOUR_ACCESS_ID"
        fiatCurrency="USD"
        env="test"
        onEventResponse={handleEventResponse}
        amount={150.00}
        referenceId="unique-payment-reference-123"
        paymentExpirySeconds={1800}
      />
    </>
  );
}
```

#### Ref Methods (`TenderAgentRef`)

| Method            | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `initiatePayment` | Opens the modal and initiates a payment with the provided parameters.      |
| `dismiss`         | Closes the modal.                        |

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

## Features

- **Shadow DOM Isolation**: The component uses Shadow DOM to prevent CSS leaks and conflicts with your application styles.
- **Auto-Open**: The modal automatically opens when payment parameters are provided.
- **TypeScript Support**: Full TypeScript definitions included.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## License

[MIT](./LICENSE) 
