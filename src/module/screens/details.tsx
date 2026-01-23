import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";
// import QRCode from "react-qr-code";
import { QRCode } from "react-qrcode-logo";

import { Button, Spinner } from "../_components";
import { FormHeader, FormFooter, FormBody } from "../_components/layout";
import {
    PAYMENT_STATUS,
    paymentResponseProps,
    PAYMENT_RESPONSES,
    PAYMENT_ICONS,
    paymentStatusMap,
    paymentDetailsProps,
} from "../types";
import { useConfig } from "../_context";

const RenderPendingDetails = ({
    address,
    amount,
    amountPaid,
    coin,
    chain,
    loading,
    cancelPayment,
    confirmPayment,
    expirePayment,
    coinIcon,
    chainIcon,
}: paymentResponseProps & paymentDetailsProps) => {
    const [_, copy] = useCopyToClipboard();
    const { paymentExpirySeconds } = useConfig();

    const initialSeconds =
        Number.isFinite(paymentExpirySeconds || 0) &&
            (paymentExpirySeconds || 0) > 0
            ? (paymentExpirySeconds as number)
            : 30 * 60; // default 30 minutes

    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        // Start countdown timer
        const interval = window.setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    window.clearInterval(interval);
                    setHasExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        if (hasExpired) {
            // Automatically trigger expiry flow when timer runs out
            expirePayment();
        }
    }, [hasExpired, expirePayment]);

    const minutes = Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return (
        <>
            <FormHeader
                title="Payement Details"
                description="Complete your purchase by making the deposit amount to the wallet address below."
                className="ta:px-6 ta:pt-8"
            />

            <FormBody
                className="ta:px-6"
            >
                <div className="ta:gap-1 ta:flex ta:w-full ta:flex-col ta:px-6">
                    <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:p-4">
                        <div className="ta:flex ta:flex-row ta:gap-2 ta:items-baseline ta:justify-center ta:items-center">
                            <span className="ta:text-5xl ta:font-bold ta:leading-tight">
                                {amount}
                            </span>
                            <span className="ta:my-auto ta:text-base sm:ta:text-4xl ta:font-bold">
                                {coin?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="ta:w-max-full ta:flex ta:flex-col ta:flex-row ta:justify-between ta:gap-4 ta:text-wrap ta:rounded-2xl ta:border ta:border-dashed ta:border-[#E6E6E6] ta:bg-[#FAFAFA] ta:p-4">
                        <div className="ta:flex ta:w-full sm:ta:w-1/4 ta:flex-row ta:justify-center sm:ta:justify-start">
                            <QRCode
                                size={256}
                                value={address}
                                style={{
                                    height: "auto",
                                    maxWidth: "100%",
                                    width: "100%",
                                    maxHeight: "200px",
                                }}
                                logoImage={coinIcon || chainIcon}
                                logoPadding={5}
                                logoPaddingStyle="circle"
                            />
                        </div>
                        <div className="ta:my-auto ta:flex ta:w-full sm:ta:w-2/4 ta:flex-col ta:text-pretty ta:gap-4">
                            <h3 className="ta:text-sm sm:ta:text-base ta:text-secondary">
                                {coin.toUpperCase()} Deposit Address
                            </h3>
                            <p className="ta:break-all ta:text-sm sm:ta:text-[14px] ta:underline ta:underline-offset-4">
                                {address}
                            </p>
                            <button
                                className="ta:flex-row ta:rounded-2xl ta:border-[#D0D5DD] ta:bg-[#FFFFFF] ta:p-2 ta:w-[64px] ta:cursor-pointer ta:rounded-lg ta:shadow-sm ta:shadow-[#0000000D]"
                                onClick={() => copy(address)}
                            >
                                <span className="ta:flex ta:flex-row ta:items-center ta:justify-center ta:gap-1 ta:text-xs sm:ta:text-[14px] ta:font-medium ta:text-[#344054]">
                                    <Copy size={16} className="sm:ta:w-[18px] sm:ta:h-[18px]" />
                                    <span>Copy</span>
                                </span>
                            </button>
                        </div>
                        {/* <div className="ta:my-auto ta:flex ta:w-full sm:ta:w-1/4 ta:flex-row ta:justify-center sm:ta:justify-end">
                        </div> */}
                    </div>
                    <div className="ta:my-4 ta:text-sm ta:text-secondary font-inter">
                        <p>
                            Send only <strong>{coin.toUpperCase()}</strong> to this deposit
                            address - supports only <strong>{coin.toUpperCase()}</strong> tokens on <strong>{chain.toUpperCase()}</strong>{" "}
                            network. If you send wrong tokens, they'll be lost.
                        </p>
                    </div>
                    <div className="ta:text-sm ta:text-secondary ta:mx-auto">
                        <p>
                            This Payment will expire in <span className="ta:font-bold ta:text-[#079455]">{minutes}m {seconds}s</span>
                        </p>
                    </div>
                </div>
            </FormBody>

            <FormFooter
                className="ta:p-6"
            >
                {loading ? (
                    <div className="ta:flex ta:w-full ta:flex-row ta:items-center ta:gap-4 ta:justify-center">
                        <span>
                            <Spinner size={16} />{" "}
                        </span>
                        <span className="ta:text-sm ta:text-secondary">
                            Confirming Payment....
                        </span>
                    </div>
                ) : (
                    <>
                        <Button
                            className="ta:block ta:min-w-[60px] ta:min-h-[44px] ta:rounded-lg ta:bg-black ta:p-2 sm:ta:p-2 ta:text-white ta:flex-1 sm:ta:flex-none"
                            type="button"
                            disabled={loading}
                            onClick={() => (loading ? null : confirmPayment())}
                        >
                            {loading ? (
                                <Spinner size={16} />
                            ) : (
                                <span className="ta:text-xs sm:ta:text-base">I've paid this amount</span>
                            )}
                        </Button>
                    </>
                )}
            </FormFooter>
        </>
    );
};

const RenderFinishedDetails = ({
    address,
    amount,
    amountPaid,
    coin,
    chain,
    status = "pending",
    balance,
    excess,
}: paymentResponseProps) => {
    const paymentType = paymentStatusMap[status];
    const iconTOShow = PAYMENT_ICONS[paymentType];
    const completed = status == PAYMENT_STATUS.COMPLETE;
    const isPartial = status == PAYMENT_STATUS.PARTIAL;
    const responseText = PAYMENT_RESPONSES[paymentType];
    
    // Get the appropriate title based on payment type
    const getTitle = () => {
        if (completed) return "Payment Completed";
        if (isPartial) return "Partial Payment Received";
        return "Overpayment Received";
    };

    // Get the appropriate description based on payment type
    const getDescription = () => {
        if (completed) return "Your payment has been successfully received and confirmed.";
        if (isPartial) return "We've received a partial payment. Please complete the remaining amount.";
        return "You have overpaid the requested amount. Please contact the merchant for a refund of the excess.";
    };

    return (
        <>
            <div className="ta:relative ta:w-full">
                <FormHeader
                    title={getTitle()}
                    description={getDescription()}
                    icon={iconTOShow}
                    className="ta:px-6 ta:pt-8"
                    isInfo={true}
                />
            </div>

            <FormBody className="ta:flex ta:flex-col ta:px-6 ta:gap-4">
                {/* Payment Amount Display */}
                <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:py-4">
                    <p className="ta:text-xs sm:ta:text-sm ta:text-secondary ta:mb-2">
                        {completed ? "YOU PAID" : isPartial ? "AMOUNT RECEIVED" : "YOU OVERPAID"}
                    </p>
                    <div className="ta:flex ta:flex-row ta:gap-2 ta:items-baseline">
                        <span className="ta:text-3xl sm:ta:text-5xl ta:font-bold ta:leading-tight">
                            {amountPaid || amount}
                        </span>
                        <span className="ta:mt-auto ta:text-lg sm:ta:text-2xl ta:font-bold ta:text-secondary">
                            {coin.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="ta:flex ta:flex-col ta:gap-3 ta:px-4 ta:py-4 ta:rounded-xl ta:bg-[#F9FAFB] ta:border ta:border-[#E6E6E6]">
                    <div className="ta:flex ta:flex-row ta:items-center ta:justify-between">
                        <span className="ta:text-sm ta:font-medium ta:text-secondary">Network</span>
                        <span className="ta:text-sm ta:font-semibold">
                            {chain.toUpperCase()}
                        </span>
                    </div>
                    <div className="ta:flex ta:flex-row ta:items-center ta:justify-between">
                        <span className="ta:text-sm ta:font-medium ta:text-secondary">Coin</span>
                        <span className="ta:text-sm ta:font-semibold">
                            {coin.toUpperCase()}
                        </span>
                    </div>
                    <div className="ta:flex ta:flex-row ta:items-center ta:justify-between">
                        <span className="ta:text-sm ta:font-medium ta:text-secondary">Original Amount</span>
                        <span className="ta:text-sm ta:font-semibold">
                            {amount} {coin.toUpperCase()}
                        </span>
                    </div>
                    <div className="ta:flex ta:flex-row ta:items-center ta:justify-between">
                        <span className="ta:text-sm ta:font-medium ta:text-secondary">Address</span>
                        <span className="ta:text-sm ta:font-semibold ta:font-mono">
                            {address.length > 16 
                                ? `${address.slice(0, 8)}...${address.slice(-8)}` 
                                : address}
                        </span>
                    </div>
                    {!completed && (
                        <>
                            <div className="ta:w-full ta:h-px ta:bg-[#E6E6E6] ta:my-1" />
                            <div className="ta:flex ta:flex-row ta:items-center ta:justify-between">
                                <span className="ta:text-sm ta:font-medium">
                                    {isPartial ? "Remaining Balance" : "Excess Amount"}
                                </span>
                                <span className="ta:text-base ta:font-bold ta:text-[#079455]">
                                    {isPartial ? balance : excess} {coin.toUpperCase()}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {responseText && (
                    <div className="ta:text-center ta:px-2">
                        <p className="ta:text-sm ta:text-secondary">
                            {responseText}
                        </p>
                    </div>
                )}
            </FormBody>

            <FormFooter className="ta:p-6">
                <div className="ta:flex ta:w-full ta:flex-row ta:items-center ta:justify-center ta:gap-2">
                    <span>
                        <Spinner size={16} />
                    </span>
                    <span className="ta:text-sm ta:text-secondary">
                        {isPartial 
                            ? `Awaiting remaining ${balance} ${coin.toUpperCase()}`
                            : "You will be redirected shortly"}
                    </span>
                </div>
            </FormFooter>
        </>
    );
};

// main response
const PaymentDetails = ({
    address,
    amount,
    amountPaid,
    coin,
    chain,
    loading,
    status,
    balance,
    excess,
    cancelPayment,
    confirmPayment,
    expirePayment,
    coinIcon,
    chainIcon,
}: paymentResponseProps & paymentDetailsProps) => {
    if (status == PAYMENT_STATUS.PENDING) {
        return (
            <RenderPendingDetails
                address={String(address)}
                amount={Number(amount)}
                amountPaid={Number(amountPaid)}
                coin={String(coin)}
                chain={String(chain)}
                loading={loading}
                status={status}
                balance={balance}
                cancelPayment={cancelPayment}
                confirmPayment={confirmPayment}
                expirePayment={expirePayment}
                coinIcon={coinIcon}
                chainIcon={chainIcon}
            />
        );
    }

    return (
        <RenderFinishedDetails
            address={String(address)}
            amount={Number(amount)}
            amountPaid={Number(amountPaid)}
            coin={String(coin)}
            chain={String(chain)}
            loading={loading}
            status={status}
            balance={balance}
            excess={excess}
        />
    );
};

export default PaymentDetails;
