/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import toastPrimitive from "react-hot-toast";
import { CheckCircle, CircleAlert } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// import { TalentProfile } from "./talent-profile-image";

export const toast = {
    error: (message: string) =>
        toastPrimitive.custom(
            (t) => {
                return (
                    <div
                        className={`${t.visible ? "ta:animate-enter" : "ta:animate-leave"} ta:pointer-events-auto ta:flex ta:w-full ta:max-w-md ta:rounded-lg ta:bg-red-100 ta:ring-1 ta:ring-red-800 ta:ring-opacity-50`}
                    >
                        <div className="ta:w-0 ta:flex-1 ta:p-4">
                            <div className="ta:flex ta:items-center">
                                <div className="ta:flex-shrink-0">
                                    <CircleAlert className="ta:h-6 ta:w-6 ta:text-red-600" />
                                </div>
                                <div className="ta:ml-3 ta:flex-1 ta:md:flex ta:md:justify-between">
                                    <p className="ta:text-sm ta:leading-5 ta:text-red-700">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
            {
                duration: 5000,
            }
        ),
    success: (message: string) =>
        toastPrimitive.custom(
            (t) => (
                <div
                    className={`${t.visible ? "ta:animate-enter" : "ta:animate-leave"} ta:pointer-events-auto ta:flex ta:w-full ta:max-w-md ta:rounded-lg ta:bg-green-100 ta:ring-1 ta:ring-green-800 ta:ring-opacity-50`}
                >
                    <div className="ta:w-0 ta:flex-1 ta:p-4">
                        <div className="ta:flex ta:items-center">
                            <div className="ta:flex-shrink-0">
                                <CheckCircle className="ta:h-6 ta:w-6 ta:text-green-600" />
                            </div>
                            <div className="ta:ml-3 ta:flex-1 ta:md:flex ta:md:justify-between">
                                <p className="ta:text-sm ta:leading-5 ta:text-green-700">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                duration: 5000,
            }
        ),
    // message: (title: string, message: string, userId: string, image?: string, score?: number, messageId?: string) => {
    // 	toastPrimitive.custom((t) => {
    // 		const router = useRouter();
    // 		return messageId ? (
    // 			<div
    // 				className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md cursor-pointer rounded-lg
    // 					bg-green-100 ring-1 ring-green-800 ring-opacity-50`}
    // 				onClick={() => {
    // 					router.push(`/messages/${messageId}`);
    // 				}}
    // 				role="button"
    // 				tabIndex={0}
    // 				onKeyDown={(e) => {
    // 					e.preventDefault();
    // 				}}
    // 			>
    // 				<div className="flex-1 p-1">
    // 					<div className="flex flex-row items-center">
    // 						{/* <TalentProfile src={image} size="sm" score={score ?? 0} url={`/talents/${userId}`} /> */}
    // 						<div className="ml-3 flex flex-col">
    // 							<h2 className="text-sm font-bold leading-5 text-green-700">{title}</h2>
    // 							<p className="text-sm leading-5 text-green-700">{message}</p>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    // 		) : (
    // 			<div
    // 				className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg bg-green-100 ring-1
    // 					ring-green-800 ring-opacity-50`}
    // 			>
    // 				<div className="flex-1 p-1">
    // 					<div className="flex flex-row items-center">
    // 						{/* <TalentProfile src={image} size="sm" score={score ?? 0} url={`/talents/${userId}`} /> */}
    // 						<div className="ml-3 flex flex-col">
    // 							<h2 className="text-sm font-bold leading-5 text-green-700">{title}</h2>
    // 							<p className="text-sm leading-5 text-green-700">{message}</p>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    // 		);
    // 	});
    // },
    info: (message: string) =>
        toastPrimitive.custom(
            (t) => (
                <div
                    className={`${t.visible ? "ta:animate-enter" : "ta:animate-leave"} ta:pointer-events-auto ta:flex ta:w-full ta:max-w-md ta:rounded-lg ta:bg-blue-100 ta:ring-1 ta:ring-blue-800 ta:ring-opacity-50`}
                >
                    <div className="ta:w-0 ta:flex-1 ta:p-4">
                        <div className="ta:flex ta:items-center">
                            <div className="ta:flex-shrink-0">
                                <CircleAlert className="ta:h-6 ta:w-6 ta:text-blue-600" />
                            </div>
                            <div className="ta:ml-3 ta:flex ta:md:flex ta:md:justify-between">
                                <p className="ta:text-sm ta:leading-5 ta:text-blue-700">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                duration: 5000,
            }
        ),
};
