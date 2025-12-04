/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactNode } from "react";
import { FormFooterProps, FormHeaderProps } from "../types";

const FormFooter = ({ children }:FormFooterProps) => (
  <div className="ta:flex ta:h-full ta:gap-2 ta:justify-between ta:items-center ta:bg-[#FAFAFA] ta:p-6 ta:rounded-b-2xl ta:w-full">
    {children}
  </div>
)

const  FormHeader = ({ title, description, icon }:FormHeaderProps) => (
  <div className="ta:relative ta:flex ta:flex-col ta:px-6 ta:pb-1 ta:pt-4 ta:bg-[#FAFAFA] ta:border-b-2 ta:border-[#EAECF0] ta:rounded-t-2xl ta:items-start ta:text-start ta:w-full">
    <div className="ta:flex ta:relative ta:w-full ta:flex-row">
      <div className='!ta:w-3/6 ta:flex ta:flex-col'>
        <h3 className="ta:text-primary ta:text-lg ta:font-bold">{title}</h3>
        <p className="ta:text-secondary">{description}</p>
      </div>
      {icon && 
        <div className="ta:flex ta:w-1/4 ta:mr-0 ta:top-0 ta:h-fit ta:justify-end ">
          <img src={icon} className='ta:w-[80px] ta:h-[80px] ta:w-full' />
        </div>
      }
    </div>
  </div>
);

const FormBody = ({ children }: { children: ReactNode }) => (
  <div className="ta:flex ta:flex-col ta:h-[400px] ta:mx-auto ta:my-4 ta:w-full ta:px-6">
    {children}
  </div>
)

export { FormFooter, FormHeader, FormBody }; 
