
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { TenderAgentSdk, onFinishResponse, TenderAgentRef } from "../src";

const App = () => {
  const tenderRef = useRef<TenderAgentRef>(null);
  
  const OnFinishedResponse = (data: onFinishResponse) => {
    console.log("response--->", data);
  };

  const handleOpenWithRef = () => {
    tenderRef.current?.initiatePayment({
      amount: 100000,
      referenceId: "123456790-090-safsasf-12fg",
      env: "local",
      paymentExpirySeconds: 1800,
    });
  };

  const handleDismissWithRef = () => {
    tenderRef.current?.dismiss();
  };

  return (
    <>
      <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
        <button onClick={handleOpenWithRef}>
          Open Modal (Ref)
        </button>
        <button onClick={handleDismissWithRef}>
          Dismiss Modal (Ref)
        </button>
      </div>

      <TenderAgentSdk
        ref={tenderRef}
        fiatCurrency="ngn"
        accessId="6t6hr2lqfGtSyKV6e4XAoZRsx4v85NwdqafEGwhUyHn2Tt7BelS3"
        onEventResponse={OnFinishedResponse}
      />
    </>
  );
};

export default App;


