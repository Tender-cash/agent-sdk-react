/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMemo, useState } from "react";
import { AxiosResponse } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { IPaymentData, PaymentStatusProps, newPaymentResponse, PAYMENT_STAGE, PAYMENT_STATUS } from "../types";
import { useConfig } from "../_context";
import { URL_PATHS } from "../lib/utils";
import { APIResponse } from "../types";
import ApiRequestQueue from "../lib/queue";
import Logger from "../lib/logger";
import { toast } from "../_components";

const confirmPaymentQueue = new ApiRequestQueue();

const fetchPaymentDetailAction = ({ nextScreen, setPageLoading }: { nextScreen:(stage:PAYMENT_STAGE)=>void, setPageLoading:(c:boolean)=>void }) => {
  let interval:NodeJS.Timeout;
  const { client, CONFIRM_INTERVAL, onEventResponse } = useConfig();
  const [paymentDetails, setPaymentDetails] = useState<IPaymentData | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [paymentError, setPaymentError] = useState<{title:string, message: string, data: any} | undefined>(undefined);

  const initiatePayment = async ({
    amount, chain, coin, fiatCurrency, referenceId
  }:{
    amount: number, chain: string, coin: string, fiatCurrency:string, 
    referenceId: string,
  }) => {
    setIsFetching(true);
    setPageLoading(true);
    const response = await client?.post(`${URL_PATHS.PAYMENT_INITIATE}/${fiatCurrency.toLowerCase()}`, {
      amount: String(amount),
      chain,
      currency: coin.toLowerCase(),
      referenceId: referenceId
    }) as APIResponse<newPaymentResponse>;
    if (response?.data?.data){
      const res = response.data.data;
      const paymentResponse = {
        id: res.txId,
        address: res.walletAddress,
        chain: res.chain,
        coin: coin,
        coinAmount: Number(res.coinAmount),
        amount: Number(res.usdAmount),
        amountPaid: "0",
        status: "pending",
      } as IPaymentData;
      setPaymentDetails(paymentResponse);
      setIsFetching(false);
      setPageLoading(false);
      nextScreen(PAYMENT_STAGE.DETAILS);
      RetryConfirmPay(res.txId);
    } 
  }

  const RecordConfirmedTx = (response:AxiosResponse) => {
    Logger.debug("API Confirm-Response", {response});
    const payResponse = response as APIResponse<newPaymentResponse>;
    if (payResponse?.data?.data){
      const paymentResponse: IPaymentData = {
        ...paymentDetails,
        status: payResponse.data.data.status as PaymentStatusProps,
        amountPaid: payResponse.data.data.amountReceived,
        balance: payResponse.data.data.balanceRequired,
        excess: (parseFloat(payResponse.data.data.amountReceived || "0") - parseFloat(payResponse.data.data?.amount || "0")).toFixed(4),
        coin: payResponse.data.data.currency?.name,
      };
      setPaymentDetails((prev)=>({...prev, ...paymentResponse} as IPaymentData));
      onEventResponse && onEventResponse({ status: payResponse.data.data.status as PaymentStatusProps, message: payResponse.data.message, data: paymentResponse });
      if ([PAYMENT_STATUS.OVER, PAYMENT_STATUS.COMPLETE].includes(payResponse.data.data.status as any) && interval){
        confirmPaymentQueue.clearQueue();
        clearInterval(interval);
      }
    }
  }

  const CallConfirmPayment = async (id:string, isBackground?: boolean) => {
    Logger.debug("confirming...");
    const addedHeaders = isBackground ? { "hide-notify": "true"} : undefined;
    try {
    const response = await confirmPaymentQueue.addToQueue({
        url: `${URL_PATHS.PAYMENT_VALIDATE}/${id}`,
        method: "POST",
      },{
        ...addedHeaders
      }, 1);
      RecordConfirmedTx(response);
    } catch (error) {
        Logger.error("no payment yet..", { error });
    } finally {
        setIsFetching(false);
    }
  }

  const RetryConfirmPay = (id: string) => {
    interval = setInterval(()=>CallConfirmPayment(id, true), CONFIRM_INTERVAL)
  };

  const triggerPaymentConfirm = (isCancelled?:boolean) => {
    setIsFetching(true);
    if (isCancelled ) {
      // make api request to cancel and close all confirmation queues
      Logger.debug("canceling-payment....");
      confirmPaymentQueue.clearQueue();
      onEventResponse && onEventResponse({ status: "error", message: "user cancelled transaction", data: {...paymentDetails, status: "cancelled"} });
      setIsFetching(false);
      setPaymentError({title: "User Cancelled Payment", message: "You've cancelled the payment request. Please try again.", data: {...paymentDetails, status: "cancelled"}});
      confirmPaymentQueue.clearQueue();
      return nextScreen(PAYMENT_STAGE.INFO);
    }
    if (paymentDetails?.id){
      return CallConfirmPayment(paymentDetails.id, false);
    }
  };

  return useMemo(()=>({
    paymentDetails,
    isFetching,
    initiatePayment,
    paymentError,
    confirmPayment: ()=>triggerPaymentConfirm(false),
    cancelPayment: ()=>triggerPaymentConfirm(true),
  }),[paymentDetails, isFetching, initiatePayment, triggerPaymentConfirm, paymentError]);
};

export default fetchPaymentDetailAction;
