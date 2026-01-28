
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
// import { useState } from "react";
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

  return (
    <>
      <TenderAgentSdk
        fiatCurrency="ngn"
        accessId="6t6hr2lqfGtSyKV6e4XAoZRsx4v85NwdqafEGwhUyHn2Tt7BelS3"
        env="local"
        onEventResponse={OnFinishedResponse}
        amount={7269.63}
        referenceId={randomUUID()}
        paymentExpirySeconds={1800}
      />
    </>
  );
};

export default App;


