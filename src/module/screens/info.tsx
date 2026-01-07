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
            className="ta:px-6 ta:pt-8"
        />

        <div className="ta:flex ta:flex-col ta:p-4 ta:gap-2 ta:justify-center ta:items-center ta:min-h-[250px] sm:ta:min-h-[350px] ta:text-lg sm:ta:text-2xl ta:text-secondary ta:text-center ta:w-full sm:ta:w-[60%] ta:mx-auto">
            <X size={48} className={"ta:text-danger sm:ta:w-[60px] sm:ta:h-[60px]"} />
            <p className="ta:text-sm sm:ta:text-base">{message}</p>
        </div>

        <FormFooter>
            <div className="ta:flex ta:flex-row ta:items-center ta:gap-1 ta:w-full ta:text-sm ta:text-secondary"> 
                <span><Spinner size={16} /></span>
                <span>You will be redirected  shortly</span>
            </div>
        </FormFooter>
    </>
  )
}

export default InfoScreen;
