/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigProvider } from "./_context";
import TenderWidget from "./screens";
import { TenderAgentProps } from "./types";

const TenderAgentSdk = ({ referenceId, amount, accessId, accessSecret, env, fiatCurrency, onEventResponse }:TenderAgentProps) => {
  return (
      <ConfigProvider
        config={{
          referenceId,
          accessId,
          accessSecret,
          amount,
          fiatCurrency,
          env,
          onEventResponse
        }}
      >
        <TenderWidget />
      </ConfigProvider>
  )
}

export default TenderAgentSdk;
