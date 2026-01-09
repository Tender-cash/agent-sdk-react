// import '../../styles/index.scss';
import { PAYMENT_STAGE } from "../types";
import useAgentSdkAction from "../_actions";
import PaymentForm from "./form";
import PaymentDetails from "./details";
import { TenderSpinner } from "../_components";
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
  
  return (
    <div className="ta:mx-auto ta:flex ta:w-full ta:flex-col ta:bg-white ta:rounded-lg sm:ta:rounded-2xl ta:border ta:border-[#EAECF0] ta:text-black ta:items-start ta:max-w-full ta:overflow-hidden ta:flex ta:flex-col ta:w-full ta:gap-6">
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
          expirePayment={paymentData.expirePayment}
          balance={paymentData.balance}
          status={paymentData.status}
          excess={paymentData.excess}
          coinIcon={selectedCoin?.icon}
          chainIcon={selectedNetwork?.icon}
        />}
        {currentStage === PAYMENT_STAGE.INFO &&
          <InfoScreen 
            title={paymentError?.title}
            message={paymentError?.message}
            isError={paymentError?.isError}
            dataToView={{
              network: selectedNetwork?.label || "-",
              coin: selectedCoin?.label || "-",
              amount: amount.toString() || "-",
              address: paymentData?.address || "-",
            }}
          />
        }
        </>
      }
    </div>
  );
}

export default TenderWidget;
