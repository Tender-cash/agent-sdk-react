
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { TenderAgentSdk, onFinishResponse } from "../src";
// import { TenderAgentSdk, onFinishResponse } from "../dist/tender-cash-agent-sdk-react.es.js";

const App = () => {
  const OnFinishedResponse = (data: onFinishResponse) => {
    console.log("response--->", data);
  };

  return (
    <>
      <TenderAgentSdk
        fiatCurrency="ngn"
        accessId="6t6hr2lqfGtSyKV6e4XAoZRsx4v85NwdqafEGwhUyHn2Tt7BelS3"
        env="test"
        onEventResponse={OnFinishedResponse}
        amount={100000}
        referenceId="123456790-090-safsasf-12fg"
        paymentExpirySeconds={1800}
      />
    </>
  );
};

export default App;


