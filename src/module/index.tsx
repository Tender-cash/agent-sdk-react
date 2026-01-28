/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
// import "../styles/index.css";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
// CSS is injected into shadow DOM only, not imported here to avoid leaking into main document
import { ConfigProvider } from "./_context";
import TenderWidget from "./screens";
import { ConfigContextType, TenderAgentProps, TenderAgentRef, StartPaymentParams } from "./types";
import { findElementInShadowDOM, isInShadowDOM } from "../lib/shadow-dom-utils";

type InternalTenderAgentProps = TenderAgentProps & {
    __tenderDestroyHost?: () => void;
};

const TenderAgentSdk = forwardRef<TenderAgentRef, InternalTenderAgentProps>(({
    accessId,
    fiatCurrency,
    env,
    onEventResponse,
    // Direct props for legacy usage (without ref)
    referenceId: directReferenceId,
    amount: directAmount,
    paymentExpirySeconds: directPaymentExpirySeconds,
    theme: directTheme = "light",
    closeModal: closeModalProp,
    __tenderDestroyHost,
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [config, setConfig] = useState<ConfigContextType | null>(null);

    // Check if using direct props pattern (without ref)
    const isDirectMode = !!(directReferenceId && directAmount);

    const removeModalContainer = useCallback(() => {
        const modalElement = findElementInShadowDOM("tender-cash-agent-sdk");
        if (modalElement) {
            // Always remove the modal container so the DOM and
            // all attached events are fully cleaned up between runs.
            modalElement.remove();
        }
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        // Delay removal to allow for exit animation
        setTimeout(() => {
            setShouldRender(false);
            removeModalContainer();
        }, 200);
        // Call the closeModal prop if provided
        if (closeModalProp) {
            closeModalProp();
        }
        if (__tenderDestroyHost) {
            __tenderDestroyHost();
        }
    }, [closeModalProp, removeModalContainer, __tenderDestroyHost]);

    const initiatePayment = useCallback(({ amount, referenceId, paymentExpirySeconds }: StartPaymentParams) => {
        setConfig({
            referenceId,
            accessId,
            amount,
            fiatCurrency,
            env,
            paymentExpirySeconds,
            onEventResponse,
            confirmationInterval: undefined,
            theme: directTheme,
            closeModal: handleClose,
        });

        setShouldRender(true);
        // Ensure modal container exists.
        // Prefer creating it inside the SDK shadow root when available,
        // otherwise fall back to the regular DOM (for non-shadow usage).
        const existingContainer = findElementInShadowDOM("tender-cash-agent-sdk");
        if (!existingContainer) {
            const shadowHost = document.querySelector("[data-tender-sdk-shadow-host]") as HTMLElement | null;
            if (shadowHost && shadowHost.shadowRoot) {
                const container = document.createElement("div");
                container.id = "tender-cash-agent-sdk";
                shadowHost.shadowRoot.appendChild(container);
            } else {
                const container = document.createElement("div");
                container.id = "tender-cash-agent-sdk";
                document.body.appendChild(container);
            }
        }
        // Small delay to ensure DOM is ready before showing
        setTimeout(() => {
            setIsOpen(true);
        }, 10);
    }, [accessId, fiatCurrency, env, onEventResponse, directTheme, handleClose]);

    // Auto-initiate payment when using direct props pattern (legacy mode without ref)
    // This supports the legacy usage where all params are passed directly
    // The modal will open automatically when referenceId and amount are provided
    useEffect(() => {
        if (isDirectMode && directReferenceId && directAmount) {
            // Auto-open modal when direct props are provided (legacy mode)
            initiatePayment({
                amount: directAmount,
                referenceId: directReferenceId,
                paymentExpirySeconds: directPaymentExpirySeconds,
            });
        }
    }, [isDirectMode, directReferenceId, directAmount, directPaymentExpirySeconds, initiatePayment]);

    const dismiss = useCallback(() => {
        handleClose();
    }, [handleClose]);

    const closeModal = useCallback(() => {
        handleClose();
    }, [handleClose]);

    useImperativeHandle(ref, () => ({
        initiatePayment,
        dismiss,
        closeModal,
    }), [initiatePayment, dismiss, closeModal]);

    useEffect(() => {
        // Cleanup on unmount – remove any existing modal container
        // so tests and repeated mounts always start from a clean DOM.
        return () => {
            removeModalContainer();
        };
    }, [removeModalContainer]);

    if (!shouldRender || !config) return null;

    const handleCloseClick = (event?: React.MouseEvent) => {
        // Prevent event bubbling if called from button click
        if (event) {
            event.stopPropagation();
        }
        handleClose();
    };

    const modalContent = (
        <div className={`tender-cash-agent-sdk-modal ${!isOpen ? "tender-cash-agent-sdk-modal-closing" : ""}`}>
            {/* Modal Backdrop */}
            <div className="tender-cash-agent-sdk-modal-backdrop" />

            {/* Modal Content Container */}
            <div className="tender-cash-agent-sdk-modal-content">
                {/* Close Button */}
                <button
                    onClick={handleCloseClick}
                    className="ta:absolute ta:top-4 ta:right-4 ta:z-[10001] ta:flex ta:items-center ta:justify-center ta:w-8 ta:h-8 ta:rounded-full ta:bg-white ta:border ta:border-[#E6E6E6] ta:text-[#667085] ta:hover:bg-gray-50 ta:hover:text-[#101828] ta:transition-colors ta:cursor-pointer ta:touch-manipulation ta:shadow-sm"
                    aria-label="Close modal"
                    type="button"
                >
                    <X size={18} />
                </button>

                <ConfigProvider
                    config={config}
                >
                    <TenderWidget />
                </ConfigProvider>
            </div>
        </div>
    );

    // Find container (searches both document and shadow DOM)
    const container = findElementInShadowDOM("tender-cash-agent-sdk");
    const containerIsInShadowDOM = container ? isInShadowDOM(container) : false;

    // If inside shadow DOM, render directly; otherwise use portal
    if (containerIsInShadowDOM && container) {
        return modalContent;
    }

    return createPortal(
        modalContent,
        container || document.body
    );
});

TenderAgentSdk.displayName = "TenderAgentSdk";

export default TenderAgentSdk;
