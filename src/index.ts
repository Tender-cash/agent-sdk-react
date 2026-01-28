//  Author: BeardKoda for Tender (https://github.com/BeardKoda)
import React, { forwardRef, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

/* -------------------------------------------------------------------------- */
/*                             SDK Public Exports                             */
/* -------------------------------------------------------------------------- */
import TenderAgentSdkWidget from "./module";
import { TenderAgentProps, TenderAgentRef } from "./types";
import { injectStylesIntoShadow } from "./lib/styles-converter";

const TenderAgentSdk = forwardRef<TenderAgentRef, TenderAgentProps>((props, ref) => {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);

    const destroyHost = () => {
        if (rootRef.current) {
            rootRef.current.unmount();
            rootRef.current = null;
        }
        if (hostRef.current && hostRef.current.parentNode) {
            hostRef.current.parentNode.removeChild(hostRef.current);
        }
        hostRef.current = null;
    };

    useEffect(() => {
        // 1. Create host element
        const host = document.createElement('div');
        host.setAttribute('data-tender-sdk-shadow-host', 'true');
        hostRef.current = host;

        // 2. Attach shadow root
        const shadowRoot = host.attachShadow({ mode: 'open' });

        // 3. Inject styles into shadow DOM only (not into main document)
        // Uses styles converter to generate single inline style string
        injectStylesIntoShadow(shadowRoot);

        // 4. Create React mount point inside shadow DOM
        const mountPoint = document.createElement('div');
        shadowRoot.appendChild(mountPoint);

        // 5. Create container for portal inside shadow DOM (component will detect and render directly)
        const portalContainer = document.createElement('div');
        portalContainer.id = "tender-cash-agent-sdk";
        shadowRoot.appendChild(portalContainer);

        // 6. Render React component with props directly into mount point
        const root = createRoot(mountPoint);
        rootRef.current = root;
        root.render(
            React.createElement(TenderAgentSdkWidget as any, {
                ...props,
                __tenderDestroyHost: destroyHost,
            })
        );

        // 7. Append host to body
        document.body.appendChild(host);

        // Cleanup on unmount
        return () => {
            destroyHost();
        };
    }, []); // Only run once on mount

    // Update component when props change
    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.render(
                React.createElement(TenderAgentSdkWidget as any, {
                    ...props,
                    __tenderDestroyHost: destroyHost,
                })
            );
        }
    }, [props]);

    return null;
});

export * from "./types";
export { TenderAgentSdk };

