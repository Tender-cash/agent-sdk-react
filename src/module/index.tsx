/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { createPortal } from "react-dom";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import "../styles/index.css";
import { ConfigProvider } from "./_context";
import TenderWidget from "./screens";
import { TenderAgentProps } from "./types";

const TenderAgentSdk = ({
    referenceId,
    amount,
    accessId,
    accessSecret,
    env,
    fiatCurrency,
    paymentExpirySeconds,
    onEventResponse,
}: TenderAgentProps) => {
    return createPortal(
        <div id="tender-cash-agent-sdk" className="tender-cash-agent-sdk">
            <ConfigProvider
                config={{
                    referenceId,
                    accessId,
                    accessSecret,
                    amount,
                    fiatCurrency,
                    env,
                    paymentExpirySeconds,
                    onEventResponse,
                }}
            >
                <TenderWidget />
            </ConfigProvider>
        </div>,
        document.body
    );
};

export default TenderAgentSdk;
