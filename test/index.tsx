
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
        accessId="i0abrAVqbbntMGi2C8dCW1DqsatwBg4yfkGctW3w0F5KZZHBFNqo"
        accessSecret="dLAQ5U9ba71vQseaiyG9bqAEEgq6FU1mMGcOGNFcFItzhcQimm5C"
        env="live"
        onEventResponse={OnFinishedResponse}
      />
    </>
  );
};

export default App;
