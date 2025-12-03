/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { type FC } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "../lib/utils";
import tenderIcon from '../../assets/icons/tender.svg';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 24, className }) => {
    return (
        <div className={cn(`ta:flex ta:w-full ta:items-center ta:justify-center`, className)}>
            <Loader className="ta:animate-spin" size={size} />
        </div>
    );
};

export const TenderSpinner: FC<SpinnerProps> = ({ size = 24, className }) => {
  return (
      <div className={cn(`ta:flex ta:w-full ta:min-h-[60vh] ta:items-center ta:justify-center`, className)}>
        <img 
          src={tenderIcon}
          alt="loading---"
          className={`ta:transition-opacity ta:duration-2000 ta:animate-[shimmer_1.5s_infinite] ta:w-[100px]`}
        />
      </div>
  );
};
