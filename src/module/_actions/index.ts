/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useEffect, useMemo, useState } from "react";
import { useCopyToClipboard } from 'usehooks-ts';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useConfig } from "../_context";
import fetchPaymentDetailAction from "./details";
import { URL_PATHS } from "../lib/utils";
import { APIResponse } from "../types";
import { PaymentChainResponse, PaymentCoin, IPaymentData, Option, PAYMENT_STAGE } from "../types";

const useAgentSdkAction = () => {
  const { amount, fiatCurrency, client, referenceId } = useConfig();
  const [stage, setStage] = useState<number>(PAYMENT_STAGE.FORM);
  const [networks, setNetworks] = useState<Option[]|[]>([]);
  const [coins, setCoins] = useState<Option[]|[]>([]);
  const [selectedNetwork, setNetwork] = useState<Option|null>(null);
  const [selectedCoin, setCoin] = useState<Option|null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [coinFetching, setCoinFetching] = useState<boolean>(false);

  const { paymentDetails, isFetching, initiatePayment, confirmPayment, cancelPayment, expirePayment, paymentError } = fetchPaymentDetailAction({ nextScreen:setStage, setPageLoading });

  const fetchChains = async () => {
    const chainsDF = await client?.get(`${URL_PATHS.CHAINS}`) as APIResponse<PaymentChainResponse>
    if (chainsDF.data.status === "success"){
      const chainList = chainsDF.data?.data?.data;
      setNetworks(chainList.map(c=>({
        label: c.name,
        value: c.id,
        icon: c.icon,
      })));
      setPageLoading(false);
    }
  }

  const fetchCoins = async (network: Option) => {
    setCoinFetching(true);
    setNetwork(network);
    setCoin(null);
    const coinsDF = await client?.get(`${URL_PATHS.CHAINS}/${network.value}/currency`) as APIResponse<PaymentCoin[]>;
    if (coinsDF.data.status === "success"){
      const coinsList = coinsDF.data?.data;
      setCoins(coinsList.map(c=>({ label: c.name, value: c.id, icon: c.icon })));
      setCoinFetching(false);
    }
  }

  useEffect(()=>{
    fetchChains();
  },[])

  const submitForm = async () => {
    if (!selectedCoin || !selectedNetwork) return null;
    setFormLoading(true);
    return await initiatePayment({
      amount, 
      fiatCurrency, 
      chain: selectedNetwork?.value, 
      coin: selectedCoin?.value,
      referenceId,
    });
  }

  const paymentData:IPaymentData & { cancelPayment:()=>void, confirmPayment: ()=>void, expirePayment: ()=>void, disabled: boolean, loading: boolean } = useMemo(()=>({
    ...paymentDetails,
    disabled: isFetching,
    loading: isFetching,
    cancelPayment,
    confirmPayment,
    expirePayment
  }),[paymentDetails, isFetching, confirmPayment, cancelPayment, expirePayment, setStage, setPageLoading]);

  return useMemo(()=>({
    currentStage:stage,
    amount,
    fiatCurrency,
    networks,
    coins,
    selectedCoin,
    selectedNetwork,
    setCoin,
    setNetwork: fetchCoins,
    submitForm,
    formDisabled: !selectedNetwork || !selectedCoin,
    formLoading,
    paymentData,
    pageLoading,
    coinFetching,
    paymentError,
  }),[stage, amount, fiatCurrency, selectedCoin, selectedNetwork, setCoin, setNetwork, submitForm, formLoading, paymentData, coinFetching, paymentError]);
}

export default useAgentSdkAction;
