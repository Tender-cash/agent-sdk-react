import tenderIcon from "@/assets/icons/tender.svg";
import { FormHeader, FormFooter } from '../_components/layout';
import { X } from "lucide-react";
import { Spinner } from "../_components";
// main response
const InfoScreen = ({
  title = "An Error Occured",
  message = "An error occurred while processing your payment. Please try again."
}:{title?: string, message?: string}) => {
    return( 
    <>
        <FormHeader 
            title={title}
            description={message}
            icon={tenderIcon}
        />

        <div className="ta-flex ta-flex-col ta-p-4 ta-gap-2 ta-justify-center ta-items-center ta-w-full ta-min-h-[250px] ta-text-2xl ta-text-secondary ta-text-center ta-w-[70%] ta-mx-auto">
            <X size={60} className={"ta-text-danger"} />
            <p className="">{message}</p>
        </div>

        <FormFooter>
            <div className="ta-flex ta-flex-row ta-items-center ta-gap-1 ta-w-full ta-text-sm ta-text-secondary"> 
                <span><Spinner size={16} /></span>
                <span>You will be redirected  shortly</span>
            </div>
        </FormFooter>
    </>
  )
}

export default InfoScreen;
