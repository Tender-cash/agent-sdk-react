/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "../lib/utils";

const button = cva(
    "ta-focus:outline-none ta-py-3 ta-whitespace-nowrap ta-duration-200 ta-capitalize ta-focus-visible:ring-1 ta-focus-visible:ring-[#19A966] ta-relative ta-z-0 ta-rounded-[10px] ta-text-center ta-w-fit ta-px-6 ta-font-semibold ta-focus-visible:border-transparent",
    {
        variants: {
            variant: {
                primary:
                    "ta-border-white ta-border-opacity-10 ta-bg-btn-primary ta-text-white",
                secondary:
                    "ta-border-primary ta-border ta-text-primary ta-bg-primary-brighter ta-hover:bg-green-100 ta-duration-200 ta-font-normal",
                outline:
                    "ta-border-primary ta-border ta-text-primary ta-border-opacity-100 ta-bg-transparent ta-hover:border-opacity-50 ta-font-normal ta-duration-200",
                transparent:
                    "ta-border-transparent ta-text-primary ta-bg-transparent ta-hover:bg-[#008D6C1A] ta-duration-200",
                danger: "ta-bg-red-200 ta-text-red-600 ta-hover:bg-red-100 ta-border ta-border-transparent",
            },
            size: {
                xs: "ta-px-2 ta-py-[8px] ta-text-xs",
                sm: "ta-px-2 ta-py-2 ta-text-sm",
                md: "ta-px-3 ta-py-3 ta-text-base",
                lg: "ta-px-4 ta-py-4 ta-text-lg",
                xl: "ta-px-5 ta-py-5 ta-text-xl",
            },
            fullWidth: {
                true: "ta-w-full",
            },
            disabled: {
                true: "ta-cursor-not-allowed !ta-bg-none !ta-bg-[#E3E5E5] !ta-text-[#979C9E]",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "primary",
        },
        compoundVariants: [
            {
                variant: "outline",
                disabled: true,
                className: "ta-border-gray-300",
            },
            {
                variant: "transparent",
                disabled: true,
                className: "ta-border-none ta-hover:bg-transparent",
            },
        ],
    }
);

const gradientHover = cva(
    "ta-absolute ta-inset-0 ta-rounded-lg ta-border ta-border-transparent ta-opacity-0 ta-duration-200 ta-hover:opacity-100 ta-pointer-events-none",
    {
        variants: {
            variant: {
                primary: "ta-bg-primary",
                secondary: "ta-bg-transparent",
                outline: "ta-bg-transparent",
                transparent: "ta-bg-transparent",
                danger: "ta-bg-transparent",
            },
            disabled: {
                true: "ta-bg-none ta-bg-transparent",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof button> {
    disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { variant, className, disabled, fullWidth, size, children, ...props },
        ref
    ) => {
        return (
            // eslint-disable-next-line react/button-has-type
            <button
                className={cn(
                    button({ disabled, size, fullWidth, variant }),
                    className
                )}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                {children}
                <div className={gradientHover({ variant, disabled })} />
            </button>
        );
    }
);

