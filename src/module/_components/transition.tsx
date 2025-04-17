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
				><div className="pam-fixed pam-inset-0 pam-bg-black pam-bg-opacity-80 pam-backdrop-blur-lg" /></Transition.Child>
				<div className="pam-fixed pam-inset-0 pam-overflow-y-auto">
					<div className="pam-flex pam-min-h-full pam-items-center pam-justify-center pam-p-4 pam-text-center">
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
