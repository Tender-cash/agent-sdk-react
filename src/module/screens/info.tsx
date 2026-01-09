import completedIcon from "@/assets/icons/completed.svg";
import errorIcon from "@/assets/icons/error.svg";
import { FormHeader, FormFooter, FormBody } from "../_components/layout";
import { Spinner } from "../_components";

// main response
const InfoScreen = ({
    title = "An Error Occured",
    message = "An error occurred while processing your payment. Please try again.",
    dataToView,
    isError = false,
}: {
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
    console.log("isError--->", isError);
    return (
        <>
            <FormHeader
                title={title}
                description={message}
                icon={isError ? errorIcon : completedIcon}
                className="ta:px-6 ta:pt-8"
                isInfo={true}
            />

            <FormBody className="ta:flex ta:px-6 ta:gap-2 ta:my-0 bg-[#EAECF0] ta:px-12">
                {Object.entries(dataToView || {}).map(([key, value]) => (
                    <div key={key} className="ta:flex ta:flex-row ta:items-center ta:justify-between ta:gap-2 ta:w-full">
                    <p className="ta:text-sm sm:ta:text-base ta:font-bold">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </p>
                    <p className="ta:text-sm sm:ta:text-base">{key.charAt(0).toUpperCase() + key.slice(1) == "address" ? value.length > 10 ? value.slice(0, 6) + "..." + value.slice(-6) : value : value}</p>
                </div>
                ))}
            </FormBody>
            <FormFooter>
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
