/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import "../styles/index.css";
import { ConfigProvider } from "./_context";
import TenderWidget from "./screens";
import { TenderAgentProps } from "./types";

const TenderAgentSdk = ({ referenceId, amount, accessId, accessSecret, env, fiatCurrency, onEventResponse }:TenderAgentProps) => {
  return (
    <div className="tender-cash-agent-sdk">
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
    </div>
  )
}

export default TenderAgentSdk;
