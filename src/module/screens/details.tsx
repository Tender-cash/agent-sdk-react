import { Copy, QrCode } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";
import QRCode from "react-qr-code";

import { Button, Spinner } from "../_components";
import { FormHeader, FormFooter } from "../_components/layout";
import {
    PAYMENT_STATUS,
    paymentResponseProps,
    PAYMENT_RESPONSES,
    PAYMENT_ICONS,
    paymentStatusMap,
    paymentDetailsProps,
} from "../types";
import { sentenceCase } from "../lib/utils";

const RenderPendingDetails = ({
    address,
    amount,
    amountPaid,
    coin,
    loading,
    cancelPayment,
    confirmPayment,
}: paymentResponseProps & paymentDetailsProps) => {
    const [_, copy] = useCopyToClipboard();
    return (
        <>
            <FormHeader
                title="Payment Details"
                description="Copy and paste payout wallet to complete your purchase."
            />

            <div className="ta:gep-2 ta:my-4 ta:flex ta:w-full ta:flex-col ta:px-6">
                <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:p-4">
                    <p>YOU'RE PAYING</p>
                    <div className="ta:flex ta:flex-row ta:gap-2">
                        <span className="leading-[48px] ta:text-[48px] ta:font-bold">
                            {amount}
                        </span>
                        <span className="ta:mb-4 ta:mt-auto ta:text-xl ta:font-bold ta:text-secondary">
                            {coin?.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="ta:w-max-full ta:flex ta:flex-row ta:justify-between ta:gap-4 ta:text-wrap ta:rounded-2xl ta:border ta:border-dashed ta:border-[#E6E6E6] ta:bg-[#FAFAFA] ta:p-4">
                    <div className="ta:flex ta:w-1/4 ta:flex-row">
                        <QRCode
                            size={256}
                            value={address}
                            style={{
                                height: "auto",
                                maxWidth: "100%",
                                width: "100%",
                            }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <div className="ta:my-auto ta:flex ta:w-2/4 ta:flex-col ta:text-pretty">
                        <h3 className="ta:text-base ta:text-secondary">
                            USDC Deposit Address
                        </h3>
                        <p className="ta:break-all ta:text-[13px] ta:underline ta:underline-offset-4">
                            {address}
                        </p>
                    </div>
                    <div className="ta:my-auto ta:flex ta:w-1/4 ta:flex-row ta:justify-end">
                        <Button
                            className="ta:flex-row ta:rounded-2xl !ta:border-[#D0D5DD] !ta:bg-white !ta:px-3 !ta:py-1"
                            variant="outline"
                            onClick={() => copy(address)}
                        >
                            <span className="ta:flex ta:flex-row ta:items-center ta:justify-center ta:gap-1 ta:text-[14px] ta:font-medium ta:text-[#344054]">
                                <Copy size={18} />
                                <span>Copy</span>
                            </span>
                        </Button>
                    </div>
                </div>
                <div className="ta:my-4 ta:text-[14px] ta:text-secondary">
                    <p>
                        Send only USDC to this deposit address - supports only
                        USDC tokens on movement network. If you send wrong
                        tokens, they'll be lost.
                    </p>
                </div>
            </div>
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
                            className="ta:block ta:min-w-[60px] ta:rounded-lg !ta:border !ta:border-[#D0D5DD] ta:bg-transparent ta:p-2 !ta:text-black"
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => (loading ? null : cancelPayment())}
                        >
                            {loading ? <Spinner size={16} /> : "Cancel"}
                        </Button>
                        <Button
                            className="ta:block ta:min-w-[60px] ta:rounded-lg ta:bg-black ta:p-2 ta:text-white"
                            type="button"
                            disabled={loading}
                            onClick={() => (loading ? null : confirmPayment())}
                        >
                            {loading ? (
                                <Spinner size={16} />
                            ) : (
                                "I've paid this amount"
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

            <div className="ta:border-t-1 ta:flex ta:flex-col ta:gap-2 ta:px-6">
                <div className="ta:w-max-full ta:flex ta:flex-row ta:justify-between ta:gap-4 ta:text-wrap ta:rounded-2xl ta:border ta:border-dashed ta:border-[#E6E6E6] ta:bg-[#FAFAFA] ta:p-4">
                    <div className="ta:flex ta:w-1/4 ta:flex-row">
                        <QrCode size={140} />
                    </div>
                    <div className="ta:my-auto ta:flex ta:w-2/4 ta:flex-col ta:justify-start ta:text-pretty">
                        <h3 className="ta:text-base ta:text-secondary">
                            {coin.toUpperCase()} Deposit Address
                        </h3>
                        <p className="ta:break-all ta:text-[13px] ta:underline ta:underline-offset-4">
                            {address}
                        </p>
                    </div>
                    <div className="ta:my-auto ta:flex ta:w-1/4 ta:flex-row ta:justify-end">
                        <Button
                            className="ta:flex-row ta:rounded-2xl !ta:border-[#D0D5DD] !ta:bg-white !ta:px-3 !ta:py-1"
                            variant="outline"
                            onClick={() => copy(address)}
                        >
                            <span className="ta:flex ta:flex-row ta:items-center ta:justify-center ta:gap-1 ta:text-[14px] ta:font-medium ta:text-[#344054]">
                                <Copy size={18} />
                                <span>Copy</span>
                            </span>
                        </Button>
                    </div>
                </div>
                {completed ? (
                    <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:p-4">
                        <p>YOU PAID</p>
                        <div className="ta:flex ta:flex-row ta:gap-2">
                            <span className="leading-[48px] ta:text-[38px] ta:font-bold">
                                {amountPaid || amount}
                            </span>
                            <span className="ta:mb-4 ta:mt-auto ta:text-xl ta:font-bold ta:text-secondary">
                                {coin.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="ta:flex ta:w-full ta:flex-row ta:items-center ta:justify-between ta:p-4">
                        <div className="ta:flex ta:w-1/2 ta:flex-col ta:items-center ta:justify-center ta:p-4">
                            <p className="ta:text-[12px] ta:text-secondary">
                                YOU PAID
                            </p>
                            <div className="ta:flex ta:flex-row ta:gap-2">
                                <span className="leading-[48px] ta:text-[38px] ta:font-bold">
                                    {amountPaid}
                                </span>
                                <span className="ta:mb-4 ta:mt-auto ta:text-xl ta:font-bold ta:text-secondary">
                                    {coin.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ta:flex ta:w-1/2 ta:flex-col ta:items-center ta:justify-center ta:p-4">
                            <p className="ta:text-[12px] ta:text-secondary">
                                {paymentType == "over" ? "EXCESS" : "REMAINING"}
                            </p>
                            <div className="ta:flex ta:flex-row ta:gap-2">
                                <span className="leading-[48px] ta:text-[38px] ta:font-bold">
                                    {paymentType == "over" ? excess : balance}
                                </span>
                                <span className="ta:mb-4 ta:mt-auto ta:text-xl ta:font-bold ta:text-secondary">
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
            </div>

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
    loading,
    status,
    balance,
    excess,
    cancelPayment,
    confirmPayment,
}: paymentResponseProps & paymentDetailsProps) => {
    if (status == PAYMENT_STATUS.PENDING) {
        return (
            <RenderPendingDetails
                address={String(address)}
                amount={Number(amount)}
                amountPaid={Number(amountPaid)}
                coin={String(coin)}
                loading={loading}
                status={status}
                balance={balance}
                cancelPayment={cancelPayment}
                confirmPayment={confirmPayment}
            />
        );
    }

    return (
        <RenderFinishedDetails
            address={String(address)}
            amount={Number(amount)}
            amountPaid={Number(amountPaid)}
            coin={String(coin)}
            loading={loading}
            status={status}
            balance={balance}
            excess={excess}
        />
    );
};

export default PaymentDetails;
