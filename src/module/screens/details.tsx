import { Copy, QrCode } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';

import { Button, Spinner } from '../_components';
import { FormHeader, FormFooter } from '../_components/layout';
import { PAYMENT_STATUS, paymentResponseProps, PAYMENT_RESPONSES, PAYMENT_ICONS, paymentStatusMap, paymentDetailsProps } from '../types';
import { sentenceCase } from '../lib/utils';

const RenderPendingDetails = ({
  address,
  amount,
  amountPaid,
  coin,
  loading,
  cancelPayment,
  confirmPayment,
}:paymentResponseProps & paymentDetailsProps) => {
  const [_, copy] = useCopyToClipboard();
  return(
  <>
    <FormHeader 
      title="Payment Details"
      description="Copy and paste payout wallet to complete your purchase."
    />
    
    <div className="ta-flex ta-flex-col ta-border-t-1 ta-px-6 ta-my-4 ta-gep-2 ta-w-full">
      <div className="ta-flex ta-flex-col ta-p-4 ta-justify-center ta-items-center">
        <p>YOU'RE PAYING</p>
        <div className="ta-flex ta-flex-row ta-gap-2">
          <span className="ta-text-[48px] leading-[48px] ta-font-bold">{amount}</span>
          <span className="ta-text-xl ta-mt-auto ta-mb-4 ta-text-secondary ta-font-bold">{coin?.toUpperCase()}</span>
        </div>
      </div>
      <div className="ta-flex ta-flex-row ta-bg-[#FAFAFA] ta-w-max-full ta-justify-between ta-p-4 ta-border ta-border-[#E6E6E6] ta-border-dashed ta-rounded-2xl ta-text-wrap ta-gap-4">
        <div className='ta-flex ta-flex-row ta-w-1/4'>
          <QrCode 
            size={140}
          />
        </div>
        <div className='ta-flex ta-flex-col ta-text-pretty ta-w-2/4 ta-my-auto'>
          <h3 className="ta-text-base ta-text-secondary">USDC Deposit Address</h3>
          <p className="ta-text-[13px] ta-underline ta-underline-offset-4 ta-break-all">{address}</p>
        </div>
        <div className='ta-flex ta-flex-row ta-w-1/4 ta-my-auto ta-justify-end'>
          <Button className='!ta-px-3 !ta-py-1 ta-flex-row !ta-bg-white !ta-border-[#D0D5DD] ta-rounded-2xl' variant="outline" onClick={()=>copy(address)}>
            <span className='ta-flex ta-flex-row ta-text-[14px] ta-text-[#344054] ta-font-medium ta-gap-1 ta-justify-center ta-items-center'>
              <Copy size={18} />
              <span>Copy</span>
            </span>
          </Button>
        </div>
      </div>
      <div className='ta-text-[14px] ta-text-secondary ta-my-4'>
        <p>Send only USDC to this deposit address - supports only USDC tokens on movement network. If you send wrong tokens, they'll be lost.</p>
      </div>
    </div>
    <FormFooter>
      {loading ? 
        <div className="ta-flex ta-flex-row ta-w-full ta-items-center ta-gap-4">
          <span><Spinner size={16} /> </span>
          <span className="ta-text-sm ta-text-secondary">Confirming Payment....</span>
        </div>
      :<>
        <Button 
          className="ta-block ta-p-2 ta-bg-transparent !ta-border !ta-border-secondary !ta-text-black/40 ta-rounded-lg ta-min-w-[60px]"
          type="button"
          disabled={loading}
          onClick={()=>loading ? null : cancelPayment()}
        >
          {loading ? <Spinner size={16} />: "Cancel"}
        </Button>
        <Button 
          className="ta-block ta-p-2 ta-bg-black ta-text-white ta-rounded-lg ta-min-w-[60px]"
          type="button"
          disabled={loading}
          onClick={()=>loading ? null : confirmPayment()}
        >
          {loading ? <Spinner size={16} />: "I've paid this amount"}
        </Button>
      </>}
    </FormFooter>
  </>
)}

const RenderFinishedDetails = ({
  address,
  amount,
  amountPaid,
  coin,
  status = "pending",
  balance,
  excess,
}:paymentResponseProps) => {
  const [_, copy] = useCopyToClipboard();
  const paymentType = paymentStatusMap[status];
  const iconTOShow = PAYMENT_ICONS[paymentType];
  const completed = status == PAYMENT_STATUS.COMPLETE;
  const isPartial = status == PAYMENT_STATUS.PARTIAL;
  const responseText = PAYMENT_RESPONSES[paymentType];
  console.log("excess", excess, balance);
  return(
    <>
      <FormHeader 
        title={`${sentenceCase(paymentType)} Payment received`}
        description="The customer made a partial or part payment of the requested amount."
        icon={iconTOShow}
      />
      
      <div className="ta-flex ta-flex-col ta-border-t-1 ta-px-6 ta-gap-2">
        <div className="ta-flex ta-flex-row ta-bg-[#FAFAFA] ta-w-max-full ta-justify-between ta-p-4 ta-border ta-border-[#E6E6E6] ta-border-dashed ta-rounded-2xl ta-text-wrap ta-gap-4">
          <div className='ta-flex ta-flex-row ta-w-1/4'>
            <QrCode 
              size={140}
            />
          </div>
          <div className='ta-flex ta-flex-col ta-text-pretty ta-w-2/4 ta-my-auto'>
            <h3 className="ta-text-base ta-text-secondary">{coin.toUpperCase()} Deposit Address</h3>
            <p className="ta-text-[13px] ta-underline ta-underline-offset-4 ta-break-all">{address}</p>
          </div>
        <div className='ta-flex ta-flex-row ta-w-1/4 ta-my-auto ta-justify-end'>
          <Button className='!ta-px-3 !ta-py-1 ta-flex-row !ta-bg-white !ta-border-[#D0D5DD] ta-rounded-2xl' variant="outline" onClick={()=>copy(address)}>
            <span className='ta-flex ta-flex-row ta-text-[14px] ta-text-[#344054] ta-font-medium ta-gap-1 ta-justify-center ta-items-center'>
              <Copy size={18} />
              <span>Copy</span>
            </span>
          </Button>
        </div>
        </div>
        {completed ? 
        <div className="ta-flex ta-flex-col ta-p-4 ta-justify-center ta-items-center">
          <p>YOU PAID</p>
          <div className="ta-flex ta-flex-row ta-gap-2">
            <span className="ta-text-[38px] leading-[48px] ta-font-bold">{amountPaid || amount}</span>
            <span className="ta-text-xl ta-mt-auto ta-mb-4 ta-text-secondary ta-font-bold">{coin.toUpperCase()}</span>
          </div>
        </div>: 
        <div className="ta-flex ta-flex-row ta-p-4 ta-justify-between ta-items-center ta-w-full">
          <div className="ta-flex ta-flex-col ta-p-4 ta-justify-center ta-items-center ta-w-1/2">
            <p className="ta-text-[12px] ta-text-secondary">YOU PAID</p>
            <div className="ta-flex ta-flex-row ta-gap-2">
              <span className="ta-text-[38px] leading-[48px] ta-font-bold">{amountPaid}</span>
              <span className="ta-text-xl ta-mt-auto ta-mb-4 ta-text-secondary ta-font-bold">{coin.toUpperCase()}</span>
            </div>
          </div>
          <div className="ta-flex ta-flex-col ta-p-4 ta-justify-center ta-items-center ta-w-1/2">
            <p className="ta-text-[12px] ta-text-secondary">{paymentType == "over" ? "EXCESS" : "REMAINING"}</p>
            <div className="ta-flex ta-flex-row ta-gap-2">
              <span className="ta-text-[38px] leading-[48px] ta-font-bold">{paymentType == "over" ? excess : balance}</span>
              <span className="ta-text-xl ta-mt-auto ta-mb-4 ta-text-secondary ta-font-bold">{coin.toUpperCase()}</span>
            </div>
          </div>
        </div>
        }
        <div className='ta-text-[14px] ta-text-secondary ta-my-4'>
          <p className="ta-text-sm ta-text-secondary">{responseText}</p>
        </div>
      </div>

      <FormFooter>
        {isPartial ?
          <div className="ta-flex ta-flex-row ta-w-full ta-items-center ta-gap-4">
            <span><Spinner size={16} /> </span>
            <span className="ta-text-sm ta-text-secondary">Transaction is pending ...</span>
          </div> : 
          <span className="ta-text-sm ta-text-secondary">You will be redirected  shortly</span>
        }
      </FormFooter>
    </>
  )
}

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
}:paymentResponseProps & paymentDetailsProps) => {
  if (status == PAYMENT_STATUS.PENDING){
  return <RenderPendingDetails 
    address={String(address)}
    amount={Number(amount)}
    amountPaid={Number(amountPaid)}
    coin={String(coin)}
    loading={loading}
    status={status}
    balance={balance}
    cancelPayment={cancelPayment}
    confirmPayment={confirmPayment}
  />;
}

return <RenderFinishedDetails 
  address={String(address)}
  amount={Number(amount)}
  amountPaid={Number(amountPaid)}
  coin={String(coin)}
  loading={loading}
  status={status}
  balance={balance}
  excess={excess}
/>
}

export default PaymentDetails;
