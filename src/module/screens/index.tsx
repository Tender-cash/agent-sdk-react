// import '../../styles/index.scss';
import { PAYMENT_STAGE } from "../types";
import useAgentSdkAction from "../_actions";
import PaymentForm from "./form";
import PaymentDetails from "./details";
import { TenderSpinner } from "../_components";
import Logger from "../lib/logger";
import InfoScreen from "./info";
const TenderWidget = () => {
  const { 
    currentStage,
    networks,
    coins,
    amount,
    fiatCurrency,
    selectedNetwork,
    selectedCoin,
    formDisabled,
    formLoading,
    setCoin,
    setNetwork, 
    submitForm,
    paymentData,
    pageLoading,
    coinFetching,
    paymentError,
  } = useAgentSdkAction();
  Logger.info("stage-->", { currentStage, pageLoading, coinFetching });
  return (
    <div className="ta:mx-auto ta:flex ta:w-full ta:flex-col ta:gap-6 ta:bg-white ta:rounded-2xl ta:border ta:border-[#EAECF0] ta:gap-4 ta:text-black ta:items-start">
      {pageLoading ? 
        <TenderSpinner /> 
        :
        <>
        {currentStage === PAYMENT_STAGE.FORM && 
          <PaymentForm 
            coins={coins}
            networks={networks}
            amount={amount}
            fiatCurrency={fiatCurrency}
            selectCoin={setCoin}
            selectNetwork={setNetwork}
            selectedCoin={selectedCoin}
            selectedNetwork={selectedNetwork}
            submitForm={submitForm}
            formDisabled={formDisabled}
            formLoading={formLoading || coinFetching}
          /> }
        {currentStage === PAYMENT_STAGE.DETAILS && paymentData &&
        <PaymentDetails 
          address={String(paymentData.address)}
          amount={Number(paymentData?.coinAmount)}
          amountPaid={Number(paymentData?.amountPaid)}
          coin={String(paymentData?.coin)}
          chain={String(paymentData?.chain)}
          loading={paymentData.loading}
          cancelPayment={paymentData.cancelPayment}
          confirmPayment={paymentData.confirmPayment}
          balance={paymentData.balance}
          status={paymentData.status}
          excess={paymentData.excess}
        />}
        {currentStage === PAYMENT_STAGE.INFO &&
          <InfoScreen 
            title={paymentError?.title}
            message={paymentError?.message}
          />
        }
        </>
      }
    </div>
  );
}

export default TenderWidget;
