/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { FormFooterProps, FormHeaderProps } from "../types";

const FormFooter = ({ children }:FormFooterProps) => (
  <div className="ta-flex ta-gap-2 ta-justify-between ta-items-center ta-bg-[#FAFAFA] ta-p-6 ta-rounded-b-2xl ta-w-full">
    {children}
  </div>
)

const  FormHeader = ({ title, description, icon }:FormHeaderProps) => (
  <div className="ta-relative tx-flex ta-flex-col ta-px-6 ta-pb-1 ta-pt-4 ta-bg-[#FAFAFA] ta-border-b-2 ta-border-[#EAECF0] ta-rounded-t-2xl ta-items-start ta-text-start ta-w-full">
    <div className="!ta-flex ta-relative !ta-w-full !ta-flex-row">
      <div className='!ta-w-3/4 ta-flex ta-flex-col'>
        <h3 className="ta-text-black ta-text-lg ta-font-bold">{title}</h3>
        <p className="ta-text-black">{description}</p>
      </div>
      {icon && 
        <span className="ta-flex ta-w-1/4 ta-top-0 ta-h-fit ta-justify-end">
          <img src={icon} className='ta-w-[100px] ta-h-[100px]' />
        </span>
      }
    </div>
  </div>
);

export { FormFooter, FormHeader}; 
