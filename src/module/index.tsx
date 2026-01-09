/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";
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
    const [isOpen, setIsOpen] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        // Delay removal to allow for exit animation
        setTimeout(() => {
            setShouldRender(false);
            const modalElement = document.getElementById("tender-cash-agent-sdk");
            if (modalElement) {
                modalElement.remove();
            }
        }, 200);
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            const modalElement = document.getElementById("tender-cash-agent-sdk");
            if (modalElement) {
                modalElement.remove();
            }
        };
    }, []);

    if (!shouldRender) return null;

    return createPortal(
        <div className={`tender-cash-agent-sdk-modal ${!isOpen ? "tender-cash-agent-sdk-modal-closing" : ""}`}>
            {/* Modal Backdrop */}
            <div className="tender-cash-agent-sdk-modal-backdrop" />
            
            {/* Modal Content Container */}
            <div className="tender-cash-agent-sdk-modal-content">
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
                        onClose: handleClose,
                    }}
                >
                    <TenderWidget />
                </ConfigProvider>
            </div>
        </div>,
        document.getElementById("tender-cash-agent-sdk") || document.body
    );
};

export default TenderAgentSdk;
