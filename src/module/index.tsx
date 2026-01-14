/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import "../styles/index.css";
import { ConfigProvider } from "./_context";
import TenderWidget from "./screens";
import { ConfigContextType, TenderAgentProps, TenderAgentRef, StartPaymentParams } from "./types";

const TenderAgentSdk = forwardRef<TenderAgentRef, TenderAgentProps>(({
    accessId,
    fiatCurrency,
    env,
    onEventResponse,
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [config, setConfig] = useState<ConfigContextType | null>(null);

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

    const initiatePayment = ({ amount, referenceId, paymentExpirySeconds }: StartPaymentParams) => {
        setConfig({
            referenceId,
            accessId,
            amount,
            fiatCurrency,
            env,
            paymentExpirySeconds,
            onEventResponse,
            confirmationInterval: undefined,
            theme: "light",
            onClose: handleClose,
        });

        setShouldRender(true);
        // Small delay to ensure DOM is ready before showing
        setTimeout(() => {
            setIsOpen(true);
        }, 10);
    };

    const dismiss = () => {
        handleClose();
    };

    useImperativeHandle(ref, () => ({
        initiatePayment,
        dismiss,
    }));

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            const modalElement = document.getElementById("tender-cash-agent-sdk");
            if (modalElement) {
                modalElement.remove();
            }
        };
    }, []);

    if (!shouldRender || !config) return null;

    return createPortal(
        <div className={`tender-cash-agent-sdk-modal ${!isOpen ? "tender-cash-agent-sdk-modal-closing" : ""}`}>
            {/* Modal Backdrop */}
            <div className="tender-cash-agent-sdk-modal-backdrop" />
            
            {/* Modal Content Container */}
            <div className="tender-cash-agent-sdk-modal-content">
                <ConfigProvider
                    config={config}
                >
                    <TenderWidget />
                </ConfigProvider>
            </div>
        </div>,
        document.getElementById("tender-cash-agent-sdk") || document.body
    );
});

TenderAgentSdk.displayName = "TenderAgentSdk";

export default TenderAgentSdk;
