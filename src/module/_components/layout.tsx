/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactNode } from "react";
import { FormFooterProps, FormHeaderProps } from "../types";
import { cn } from "../lib/utils";
import tenderIconLogo from "../../assets/icons/tender.svg";

const FormFooter = ({ children, className }: FormFooterProps) => (
    <div
        className={cn(
            `ta:flex ta:h-full ta:gap-2 ta:justify-between ta:items-center ta:bg-[#FAFAFA] ta:p-4 sm:ta:p-6 ta:rounded-b-2xl ta:w-full ta:flex-wrap sm:ta:flex-nowrap ${className}`
        )}
    >
        {children}
    </div>
);

const FormHeader = ({
    title,
    description,
    icon,
    className,
    isInfo = false
}: FormHeaderProps) => (
    <div
        className={cn(
            `ta:flex ta:flex-col ta:items-center ta:justify-center ta:w-full ${className}`
        )}
    >
        {/* Circular green logo with white "7" */}
        <div className="ta:w-[100px] ta:h-[100px] ta:rounded-full ta:flex ta:items-center ta:justify-center ta:mb-4">
            <img
                src={icon || tenderIconLogo}
                className="ta:w-full ta:h-full ta:object-fit"
                alt="icon"
            />
        </div>
        {/* "Holla," text */}
        {!isInfo && <p className="ta:text-[#667085] ta:text-base ta:mb-1">Holla,</p>}
        {/* "Checkout Details" heading */}
        <h2 className="ta:text-black ta:text-xl ta:font-bold ta:mb-2">
            {title}
        </h2>
        {/* Instruction text */}
        <p className="ta:text-[#667085] ta:text-sm ta:text-center ta:mx-12">
            {description}
        </p>
    </div>
);

const FormBody = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => (
    <div
        className={`ta:flex ta:flex-col ta:w-full sm:ta:h-[400px] ta:mx-auto ta:w-full ta:overflow-y-auto ta:overflow-x-visible ${className}`}
    >
        {children}
    </div>
);

export { FormFooter, FormHeader, FormBody };
