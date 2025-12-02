
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
        accessId="RlQwBRgwFBAZ7mN8SiDVqkcs8OTlMjRvTKEX2T1AJAsFPuF97Hlu"
        accessSecret="fXARyx8qPkT49QXB9WyeUZJ1LjA9M9G6r9x0gWS5vUgHP8EMODN4"
        env="test"
        onEventResponse={OnFinishedResponse}
      />
    </>
  );
};

export default App;
