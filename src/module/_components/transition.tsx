"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { type FC, Fragment, memo } from "react";
import { Transition } from "@headlessui/react";

interface TransitionProps {
	children: React.ReactNode;
}

const TransitionWrapper: FC<TransitionProps> = ({ children }) => {
	return (
		<Transition appear show={true} as={Fragment}>
				<Transition.Child
					as={Fragment}
					enter="ease-out "
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				><div className="ta:fixed ta:inset-0 ta:bg-black ta:bg-opacity-80 ta:backdrop-blur-lg" /></Transition.Child>
				<div className="ta:fixed ta:inset-0 ta:overflow-y-auto">
					<div className="ta:flex ta:min-h-full ta:items-center ta:justify-center ta:p-4 ta:text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out "
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
              {children}
            </Transition.Child>
					</div>
				</div>
		</Transition>
	);
};

export default memo(TransitionWrapper);
