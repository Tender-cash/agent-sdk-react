import { X } from "lucide-react";
import completedIcon from "@/assets/icons/completed.svg";
import tenderIcon from "@/assets/icons/tender.svg";
import errorIcon from "@/assets/icons/error.svg";
import { FormHeader, FormFooter, FormBody } from "../_components/layout";
import { Spinner } from "../_components";
import { useConfig } from "../_context";

// main response
const InfoScreen = ({
    type = "info",
    title = "An Error Occured",
    message = "An error occurred while processing your payment. Please try again.",
    dataToView,
    isError = false,
}: {
    type?: string;
    title?: string;
    message?: string;
    isError?: boolean;
    dataToView?: {
        network: string;
        coin: string;
        amount: string;
        address: string;
    };
}) => {
    const { onClose } = useConfig();

    return (
        <>
            <div className="ta:relative ta:w-full ta:h-1/3">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ta:absolute ta:top-4 ta:right-4 ta:z-10 ta:flex ta:items-center ta:justify-center ta:w-10 ta:h-10 ta:rounded-full ta:bg-white ta:border ta:border-[#E6E6E6] hover:ta:bg-gray-50 ta:transition-colors ta:cursor-pointer ta:text-gray-600 hover:ta:text-gray-800 ta:shadow-sm"
                        aria-label="Close modal"
                        type="button"
                    >
                        <X size={18} />
                    </button>
                )}
                <FormHeader
                    title={title}
                    description={type === "info" ? message : ""}
                    icon={isError ? errorIcon : completedIcon}
                    className="ta:px-6 ta:pt-8"
                    isInfo={true}
                />
            </div>

            {type === "info" ? (
                <FormBody className="ta:flex ta:px-6 ta:gap-2 ta:my-0 ta:px-12 bg-[#EAECF0] ta:h-[220px]">
                    {Object.entries(dataToView || {}).map(([key, value]) => (
                        <div
                            key={key}
                            className="ta:flex ta:flex-row ta:items-center ta:justify-between ta:gap-2 ta:w-full"
                        >
                            <p className="ta:text-sm sm:ta:text-base ta:font-bold">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </p>
                            <p className="ta:text-sm sm:ta:text-base">
                                {key.charAt(0).toUpperCase() + key.slice(1) ==
                                "address"
                                    ? value.length > 10
                                        ? value.slice(0, 6) +
                                          "..." +
                                          value.slice(-6)
                                        : value
                                    : value}
                            </p>
                        </div>
                    ))}
                </FormBody>
            ) : (
                <FormBody className="ta:flex ta:px-6 ta:gap-2 ta:my-0 bg-[#EAECF0] ta:items-center ta:justify-center ta:text-center ta:h-[220px]">
                    {message == "Network Error" ? "An error occurred while processing your payment. Please try again." : message}
                </FormBody>
            )}
            <FormFooter className="ta:mb-0">
                <div className="ta:flex ta:flex-row ta:items-center ta:gap-1 ta:w-full ta:text-sm ta:text-secondary">
                    <span>
                        <Spinner size={16} />
                    </span>
                    <span>You will be redirected shortly</span>
                </div>
            </FormFooter>
        </>
    );
};

export default InfoScreen;
