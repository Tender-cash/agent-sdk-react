
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
      <TenderAgentSdk 
        amount={10}
        referenceId={"123456790-090-safsasf-12fg"}
        fiatCurrency={"ngn"}
        accessId="L1v0jee2iCVPd4rF2weKc29BmHvDJxsFHv0vH2ozkt50u2RAveRg"
        accessSecret="1JBYEwAvoc162Txwk3txLwvzgvp2vsgb3e2YwdY0Q8sfTY6QCgyb"
        env="test"
        onEventResponse={OnFinishedResponse}
      />
    </>
  );
};

export default App;
