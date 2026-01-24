
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TenderAgentSdk, onFinishResponse } from "../src";
// import { TenderAgentSdk, onFinishResponse } from "../dist/tender-cash-agent-sdk-react.es.js";

const randomUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const App = () => {
  const OnFinishedResponse = (data: onFinishResponse) => {
    console.log("response--->", data);
  };
// https://unpkg.com/@tender-cash/agent-sdk-react@latest/dist/tender-cash-agent-sdk-react.es.js
  return (
    <>
      <TenderAgentSdk
        fiatCurrency="ngn"
        accessId="6t6hr2lqfGtSyKV6e4XAoZRsx4v85NwdqafEGwhUyHn2Tt7BelS3"
        env="test"
        onEventResponse={OnFinishedResponse}
        amount={1000}
        referenceId={randomUUID()}
        paymentExpirySeconds={1800}
      />
    </>
  );
};

export default App;


