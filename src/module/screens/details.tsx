import { useEffect, useState } from "react";
import { Copy, QrCode } from "lucide-react";
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
import { sentenceCase } from "../lib/utils";

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
                title="Payment Details"
                description="Copy and paste payout wallet to complete your purchase."
            />

            <FormBody>
                <div className="ta:gap-1 ta:flex ta:w-full ta:flex-col ta:px-6">
                    <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:p-4">
                        <p className="ta:text-xs sm:ta:text-sm">YOU'RE PAYING</p>
                        <div className="ta:flex ta:flex-row ta:gap-2 ta:items-baseline">
                            <span className="ta:text-3xl sm:ta:text-[48px] ta:font-bold ta:leading-tight">
                                {amount}
                            </span>
                            <span className="ta:mb-0 sm:ta:mb-4 ta:mt-auto ta:text-base sm:ta:text-xl ta:font-bold ta:text-secondary">
                                {coin?.toUpperCase()}
                            </span>
                        </div>
                        <p className="ta:mt-2 ta:text-xs sm:ta:text-sm ta:text-primary">
                            Payment expires in{" "}
                            <span className="ta:font-mono">
                                {minutes}:{seconds}
                            </span>
                        </p>
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
                            />
                        </div>
                        <div className="ta:my-auto ta:flex ta:w-full sm:ta:w-2/4 ta:flex-col ta:text-pretty ta:gap-2">
                            <h3 className="ta:text-sm sm:ta:text-base ta:text-secondary">
                                {coin.toUpperCase()} Deposit Address
                            </h3>
                            <p className="ta:break-all ta:text-xs sm:ta:text-[13px] ta:underline ta:underline-offset-4">
                                {address}
                            </p>
                        </div>
                        <div className="ta:my-auto ta:flex ta:w-full sm:ta:w-1/4 ta:flex-row ta:justify-center sm:ta:justify-end">
                            <Button
                                className="ta:flex-row ta:rounded-2xl !ta:border-[#D0D5DD] !ta:bg-white !ta:px-3 !ta:py-2 ta:min-h-[44px] ta:w-full sm:ta:w-auto"
                                variant="outline"
                                onClick={() => copy(address)}
                            >
                                <span className="ta:flex ta:flex-row ta:items-center ta:justify-center ta:gap-1 ta:text-xs sm:ta:text-[14px] ta:font-medium ta:text-[#344054]">
                                    <Copy size={16} className="sm:ta:w-[18px] sm:ta:h-[18px]" />
                                    <span>Copy</span>
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className="ta:my-4 ta:text-[14px] ta:text-secondary">
                        <p>
                            Send only <strong>{coin.toUpperCase()}</strong> to this deposit
                            address - supports only <strong>{coin.toUpperCase()}</strong> tokens on <strong>{chain.toUpperCase()}</strong>{" "}
                            network. If you send wrong tokens, they'll be lost.
                        </p>
                    </div>
                </div>
            </FormBody>

            <FormFooter>
                {loading ? (
                    <div className="ta:flex ta:w-full ta:flex-row ta:items-center ta:gap-4">
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
                            className="ta:block ta:min-w-[60px] ta:min-h-[44px] ta:rounded-lg !ta:border !ta:border-[#D0D5DD] ta:bg-transparent ta:p-2 sm:ta:p-2 !ta:text-black !ta:bg-transparent ta:flex-1 sm:ta:flex-none"
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => (loading ? null : cancelPayment())}
                        >
                            {loading ? <Spinner size={16} /> : "Cancel"}
                        </Button>
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
    status = "pending",
    balance,
    excess,
}: paymentResponseProps) => {
    const [_, copy] = useCopyToClipboard();
    const paymentType = paymentStatusMap[status];
    const iconTOShow = PAYMENT_ICONS[paymentType];
    const completed = status == PAYMENT_STATUS.COMPLETE;
    const isPartial = status == PAYMENT_STATUS.PARTIAL;
    const responseText = PAYMENT_RESPONSES[paymentType];
    return (
        <>
            <FormHeader
                title={`${sentenceCase(paymentType)} Payment received`}
                description="The customer made a partial or part payment of the requested amount."
                icon={iconTOShow}
            />

            <FormBody>
                {/* <div className="ta:border-t-1 ta:flex ta:flex-col ta:gap-2 ta:px-6"> */}
                <div className="ta:w-max-full ta:flex ta:flex-row ta:justify-between ta:gap-4 ta:text-wrap ta:rounded-2xl ta:border ta:border-dashed ta:border-[#E6E6E6] ta:bg-[#FAFAFA] ta:p-4">
                    <div className="ta:flex ta:w-full sm:ta:w-1/4 ta:flex-row ta:justify-center sm:ta:justify-start">
                        <QrCode size={100} />
                    </div>
                    <div className="ta:my-auto ta:flex ta:w-full sm:ta:w-2/4 ta:flex-col ta:justify-start ta:text-pretty ta:gap-2">
                        <h3 className="ta:text-sm sm:ta:text-base ta:text-secondary">
                            {coin.toUpperCase()} Deposit Address
                        </h3>
                        <p className="ta:break-all ta:text-xs sm:ta:text-[13px] ta:underline ta:underline-offset-4">
                            {address}
                        </p>
                    </div>
                    <div className="ta:my-auto ta:flex ta:w-full sm:ta:w-1/4 ta:flex-row ta:justify-center sm:ta:justify-end">
                        <Button
                            className="ta:flex-row ta:rounded-2xl !ta:border-[#D0D5DD] !ta:bg-white !ta:px-3 !ta:py-2 ta:min-h-[44px] ta:w-full sm:ta:w-auto"
                            variant="outline"
                            onClick={() => copy(address)}
                        >
                            <span className="ta:flex ta:flex-row ta:items-center ta:justify-center ta:gap-1 ta:text-xs sm:ta:text-[14px] ta:font-medium ta:text-[#344054]">
                                <Copy size={16} className="sm:ta:w-[18px] sm:ta:h-[18px]" />
                                <span>Copy</span>
                            </span>
                        </Button>
                    </div>
                </div>
                {completed ? (
                    <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:p-4">
                        <p className="ta:text-xs sm:ta:text-sm">YOU PAID</p>
                        <div className="ta:flex ta:flex-row ta:gap-2 ta:items-baseline">
                            <span className="ta:text-2xl sm:ta:text-[38px] ta:font-bold ta:leading-tight">
                                {amountPaid || amount}
                            </span>
                            <span className="ta:mb-0 sm:ta:mb-4 ta:mt-auto ta:text-base sm:ta:text-xl ta:font-bold ta:text-secondary">
                                {coin.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="ta:flex ta:w-full ta:flex-col sm:ta:flex-row ta:items-center ta:justify-between ta:p-4 ta:gap-4 sm:ta:gap-0">
                        <div className="ta:flex ta:w-full sm:ta:w-1/2 ta:flex-col ta:items-center ta:justify-center ta:p-4">
                            <p className="ta:text-[10px] sm:ta:text-[12px] ta:text-secondary">
                                YOU PAID
                            </p>
                            <div className="ta:flex ta:flex-row ta:gap-2 ta:items-baseline">
                                <span className="ta:text-2xl sm:ta:text-[38px] ta:font-bold ta:leading-tight">
                                    {amountPaid}
                                </span>
                                <span className="ta:mb-0 sm:ta:mb-4 ta:mt-auto ta:text-base sm:ta:text-xl ta:font-bold ta:text-secondary">
                                    {coin.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ta:flex ta:w-full sm:ta:w-1/2 ta:flex-col ta:items-center ta:justify-center ta:p-4">
                            <p className="ta:text-[10px] sm:ta:text-[12px] ta:text-secondary">
                                {paymentType == "over" ? "EXCESS" : "REMAINING"}
                            </p>
                            <div className="ta:flex ta:flex-row ta:gap-2 ta:items-baseline">
                                <span className="ta:text-2xl sm:ta:text-[38px] ta:font-bold ta:leading-tight">
                                    {paymentType == "over" ? excess : balance}
                                </span>
                                <span className="ta:mb-0 sm:ta:mb-4 ta:mt-auto ta:text-base sm:ta:text-xl ta:font-bold ta:text-secondary">
                                    {coin.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="ta:my-4 ta:text-[14px] ta:text-secondary">
                    <p className="ta:text-sm ta:text-secondary">
                        {responseText}
                    </p>
                </div>
                {/* </div> */}
            </FormBody>

            <FormFooter>
                {isPartial ? (
                    <div className="ta:flex ta:w-full ta:flex-row ta:items-center ta:gap-4">
                        <span>
                            <Spinner size={16} />{" "}
                        </span>
                        <span className="ta:text-sm ta:text-secondary">
                            Transaction is pending ...
                        </span>
                    </div>
                ) : (
                    <span className="ta:text-sm ta:text-secondary">
                        You will be redirected shortly
                    </span>
                )}
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
