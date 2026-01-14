import { useRef, useState } from 'react'
import './App.css'
import '@tender-cash/agent-sdk-react/dist/style.css';
import { TenderAgentRef, TenderAgentSdk, onFinishResponse } from '@tender-cash/agent-sdk-react';

function App() {
  const [accessId, setAccessId] = useState('');
  const [accessSecret, setAccessSecret] = useState('');
  const [amount, setAmount] = useState('');
  const [fiatCurrency, setFiatCurrency] = useState('USD');
  const [showSdk, setShowSdk] = useState(false);
  const [sdkResponse, setSdkResponse] = useState<onFinishResponse | null>(null);
  const tenderRef = useRef<TenderAgentRef>(null);

  const handleOpenSdk = () => {
    if (!accessId || !accessSecret || !amount || !fiatCurrency) {
      alert('Please fill in all fields');
      return;
    }
    setSdkResponse(null);
    setShowSdk(true);
    tenderRef.current?.initiatePayment({
      amount: parseFloat(amount) || 0,
      referenceId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    });
  };

  const handleEventResponse = (response: onFinishResponse) => {
    console.log('SDK Event Response:', response);
    setSdkResponse(response);
  };

  return (
    <>
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
        <h1 style={{textAlign: 'center', fontSize: '42px', fontWeight: 'bold', marginBottom: '20px'}}>Tender Agent SDK Example</h1>

        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', placeItems: 'center' }}>
          <div>
            <label htmlFor="accessId">Access ID: </label>
            <input
              id="accessId"
              type="text"
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              placeholder="Enter Access ID"
              style={{ width: '100%', height: '20px', padding: '20px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label htmlFor="accessSecret">Access Secret: </label>
            <input
              id="accessSecret"
              type="password"
              value={accessSecret}
              onChange={(e) => setAccessSecret(e.target.value)}
              placeholder="Enter Access Secret"
              style={{ width: '100%', height: '20px', padding: '20px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              style={{ width: '100%', height: '20px', padding: '20px', border: '1px solid #ccc' }} 
            />
          </div>
          <div>
            <label htmlFor="fiatCurrency">Fiat Currency: </label>
            <input
              id="fiatCurrency"
              type="text"
              value={fiatCurrency}
              onChange={(e) => setFiatCurrency(e.target.value)}
              placeholder="e.g., USD"
              style={{ width: '100%', height: '20px', padding: '20px', border: '1px solid #ccc' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleOpenSdk} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            Open Tender SDK
          </button>
        </div>
      </div>

      {showSdk && (
        <>
          <h2>Tender SDK Component:</h2>
          <button className='main-btn' onClick={() => setShowSdk(false)} style={{ marginTop: '10px' }}>
            Cancel / Close SDK Manually
          </button>
        </>
      )}

      {sdkResponse && (
        <div style={{ marginTop: '20px', width: '100%', padding: '10px', border: '1px solid blue' }}>
          <h3>Last SDK Response:</h3>
          <pre style={{ width: '100%', textAlign: 'left' }}>{JSON.stringify(sdkResponse, null, 2)}</pre>
        </div>
      )}
      
      <TenderAgentSdk
        accessId={accessId}
        fiatCurrency={fiatCurrency}
        env="test"
        ref={tenderRef}
        onEventResponse={handleEventResponse}
      />
    </>
  )
}

export default App
