/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigProvider } from "./_context";
import TenderWidget from "./screens";
import { TenderAgentProps } from "./types";

const TenderAgentSdk = ({ amount, accessId, accessSecret, env, fiatCurrency, onEventResponse }:TenderAgentProps) => {
  return (
      <ConfigProvider
        config={{
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
