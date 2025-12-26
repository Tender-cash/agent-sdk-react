/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactNode } from "react";
import { FormFooterProps, FormHeaderProps } from "../types";

const FormFooter = ({ children }:FormFooterProps) => (
  <div className="ta:flex ta:h-full ta:gap-2 ta:justify-between ta:items-center ta:bg-[#FAFAFA] ta:p-4 sm:ta:p-6 ta:rounded-b-2xl ta:w-full ta:flex-wrap sm:ta:flex-nowrap">
    {children}
  </div>
)

const  FormHeader = ({ title, description, icon }:FormHeaderProps) => (
  <div className="ta:relative ta:flex ta:flex-col ta:px-4 sm:ta:px-6 ta:pb-1 ta:pt-4 ta:bg-[#FAFAFA] ta:border-b-2 ta:border-[#EAECF0] ta:rounded-t-2xl ta:items-start ta:text-start ta:w-full">
    <div className="ta:flex ta:relative ta:w-full ta:flex-row ta:items-start ta:gap-2 sm:ta:gap-0">
      <div className='!ta:w-full sm:!ta:w-3/6 ta:flex ta:flex-col ta:flex-1'>
        <h3 className="ta:text-primary ta:text-base sm:ta:text-lg ta:font-bold">{title}</h3>
        <p className="ta:text-secondary ta:text-sm sm:ta:text-base">{description}</p>
      </div>
      {icon && 
        <div className="ta:flex ta:w-auto sm:ta:w-1/4 ta:mr-0 ta:top-0 ta:h-fit ta:justify-end ta:shrink-0">
          <img src={icon} className='ta:w-[60px] ta:h-[60px] sm:ta:w-[80px] sm:ta:h-[80px]' alt="icon" />
        </div>
      }
    </div>
  </div>
);

const FormBody = ({ children }: { children: ReactNode }) => (
  <div className="ta:flex ta:flex-col ta:min-h-[300px] sm:ta:h-[400px] ta:mx-auto ta:my-4 ta:w-full ta:px-4 sm:ta:px-6 ta:overflow-y-auto ta:overflow-x-visible">
    {children}
  </div>
)

export { FormFooter, FormHeader, FormBody }; 
