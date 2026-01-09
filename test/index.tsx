
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { TenderAgentSdk, onFinishResponse } from "../src";

const App = () => {
  const OnFinishedResponse = (data:onFinishResponse) => {
    console.log("response--->", data);
  }
  return (
    <>
    <button onClick={() => {
      const modalElement = document.getElementById("tender-cash-agent-sdk");
      if (modalElement) {
        modalElement.remove();
      }
    }}>Open Modal</button>
      <TenderAgentSdk 
        amount={100000}
        referenceId={"123456790-090-safsasf-12fg"}
        fiatCurrency={"ngn"}
        accessId="6t6hr2lqfGtSyKV6e4XAoZRsx4v85NwdqafEGwhUyHn2Tt7BelS3"
        accessSecret="LOKSBUnmyq5KRPwBS3lqtgvr7YHL5f4yUUm6n4STlHhSE03lGWKo"
        env="test"
        onEventResponse={OnFinishedResponse}
      />
    </>
  );
};

export default App;
