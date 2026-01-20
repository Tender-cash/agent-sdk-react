/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactNode } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import partialIcon from "@/assets/icons/partial.png";
import overpaymentIcon from "@/assets/icons/overpayment.png";
import completedIcon from "@/assets/icons/completed.png";
type IAny = any;

interface ITheme extends Record<string, any> {
  primary?: string;
  secondary?: string;
  info?: string;
  warning?: string;
  success?: string;
  danger?: string;
}

interface IGetRequestSignature {
  signature: string;
  timeStamp: string;
  requestId: string;
}

interface IGetRequestSignatureParam {
  accessId: string;
  accessSecret: string;
}

enum PAYMENT_STATUS {
  PENDING = "pending",
  PARTIAL = "partial-payment",
  COMPLETE = "completed",
  OVER = "overpayment",
}

interface Option {
	label: string;
	value: string;
  icon?: string;
}

enum paymentStatusMap {
  "overpayment" = "over",
  "partial-payment" = "partial",
  "completed" = "complete",
  "pending" = "pending",
  "error" = "error",
  "cancelled" = "cancelled",
}

type  PaymentTypeProps = "partial" | "complete" | "over" | "pending" | "error";
type  PaymentStatusProps = "partial-payment" | "completed" | "overpayment" | "pending" | "error" | "cancelled";
type TenderEnvironments = "test" | "live" | "local";

interface FormHeaderProps {
  title: string;
  description: string;
  icon?: string;
  className?: string;
  isInfo?: boolean;
}

interface FormFooterProps {
  children: ReactNode;
  className?: string;
}

interface IPaymentData {
  id?: string;
  amount?: number;
  coinAmount?: number;
  coin?: string;
  chain?: string;
  address?: string;
  amountPaid?: string;
  balance?: string;
  excess?: string;
  status?: PaymentStatusProps;
}

interface paymentResponseProps {
  address: string;
  amount: number;
  amountPaid: number;
  coin: string;
  chain: string;
  loading: boolean;
  status?: PaymentStatusProps;
  balance?: string;
  excess?: string;
  coinIcon?: string;
  chainIcon?: string;
}

enum PAYMENT_RESPONSES {
  partial = "Please complete the remaining payment to finalize this transaction. If the full amount is not received within 24 hours, the transaction will be canceled. For a refund, please contact the Merchant.",
  over = "You have overpaid. If the excess amount is significant, please contact your Merchant for a refund.",
  complete = "",
  pending = "",
  error = "",
  cancelled = "",
};

const PAYMENT_ICONS ={
  partial: partialIcon,
  over: overpaymentIcon,
  complete: completedIcon,
  pending: undefined,
  error: undefined,
  cancelled: undefined,
}

interface paymentDetailsProps {
  cancelPayment: () => void;
  confirmPayment: () => void;
  expirePayment: () => void;
}

enum PAYMENT_STAGE {
  FORM = 1,
  DETAILS = 2,
  INFO = 3,
}

interface QueueItem {
  id: string;
  config: AxiosRequestConfig;
  controller: AbortController;
  resolve: (value: AxiosResponse<any>) => void;
  reject: (reason?: any) => void;
  retries: number;
}


type APIResponse<T = unknown> = AxiosResponse<{
  message: string;
  status: string;
  data: T;
}>;

type APIError<T = unknown> = AxiosError<{
  message: string;
  status: string;
  data?: T;
}>;


interface newPaymentResponse {
  activationFee: number;
  activationFeeUSD: number;
  agentAmount: string;
  agentCurrency: string;
  agentId: string;
  agentRate: number;
  agentRateUSD: number;
  amount: string;
  chain: string,
  chainId?: {
    coin: string;
  },
  coinAmount: string;
  contractAddress: string,
  currency:{
    name: string;
  };
  fee: number;
  feeSent: boolean;
  feeUSD: number;
  merchantId: string;
  rate: number;
  txId: string;
  type: string;
  usdAmount: string;
  walletAddress: string;
  walletAddressIndex: number
  status?: PaymentStatusProps;
  amountReceived?: string;
  balanceRequired?: string;
}

interface onFinishResponse {
  status: PaymentStatusProps;
  message: string;
  data: IPaymentData | undefined;
}
interface ConfigContextType {
  referenceId: string; // required referenceId
  accessId: string; // required accessId
  amount: number; // required amount in fiat to Charge
  fiatCurrency: string; // required currency to make payment
  env: TenderEnvironments; // required environment for sdk
  confirmationInterval?: number //optional defaults to 5000ms
  paymentExpirySeconds?: number // optional expiry for payment countdown, defaults to 30 mins
  theme?: "light" | "dark"; // light or dark 
  onEventResponse?:(data:onFinishResponse) => void;
  closeModal?: () => void; // optional close handler for modal - when called, closes the modal
}

// Public widget props (used when embedding the component directly)
// Supports two patterns:
// 1. With ref: Pass only static props, use ref to initiate payment
// 2. Without ref: Pass all props including payment params, widget auto-opens
interface TenderAgentProps {
  fiatCurrency: string;
  accessId: string;
  env: TenderEnvironments;
  onEventResponse?: (data:onFinishResponse)=> void;
  // Optional payment params for direct usage (without ref)
  referenceId?: string;
  amount?: number;
  paymentExpirySeconds?: number;
  theme?: "light" | "dark";
  closeModal?: () => void; // Optional close handler for modal - when called, closes the modal
}

// Parameters passed when initiating a payment via ref
interface StartPaymentParams {
  referenceId: string;
  amount: number;
  paymentExpirySeconds?: number;
}

interface TenderAgentRef {
  initiatePayment: (params: StartPaymentParams) => void;
  dismiss: () => void;
}

interface PaymentChain {
  _id: string;
  name: string;
  icon: string;
  id: string;
  coin: string;
  status: string;
  explorer: string;
  chainType: string;
  isMultiChain: boolean;
  cType: string;
}
interface PaymentCoin {
  _id: string;
  id: string;
  name: string;
  icon: string;
  isContract: boolean;
  chains: string[],
  priceTag: string;
  symbol: string;
  status: string;
}

interface PaymentChainResponse {
  data: PaymentChain[]
  pages: number;
  page:  number;
  limit: number;
}

interface PaymentCoinsResponse {
  data: PaymentCoin[]
  pages: number;
  page:  number;
  limit: number;
}

export {
  type IAny,
  type FormHeaderProps,
  type FormFooterProps,
  type IPaymentData,
  type PaymentTypeProps,
  type PaymentStatusProps,
  type paymentResponseProps,
  type paymentDetailsProps,
  type newPaymentResponse,
  type Option,
  type IGetRequestSignatureParam,
  type IGetRequestSignature,
  type ITheme,
  type ConfigContextType,
  type TenderEnvironments,
  type TenderAgentProps,
  type StartPaymentParams,
  type TenderAgentRef,
  type QueueItem,
  type PaymentCoinsResponse,
  type PaymentChainResponse,
  type PaymentCoin,
  type APIResponse,
  type APIError,
  type onFinishResponse,
  paymentStatusMap,
  PAYMENT_STAGE,
  PAYMENT_STATUS,
  PAYMENT_RESPONSES,
  PAYMENT_ICONS,
}
