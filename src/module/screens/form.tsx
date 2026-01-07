/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import {
    SelectDropdown,
    Button,
    Spinner,
    FormBody,
    FormHeader,
    FormFooter,
} from "../_components";
import { Option } from "../types";

interface paymentFormProps {
    amount: number;
    fiatCurrency: string;
    networks: Option[];
    coins: Option[];
    selectedNetwork: Option | null;
    selectedCoin: Option | null;
    formDisabled: boolean;
    formLoading: boolean;
    selectCoin: (value: Option) => void;
    selectNetwork: (value: Option) => void;
    submitForm: () => void;
}

const PaymentForm = ({
    amount,
    fiatCurrency,
    networks,
    selectedNetwork,
    selectedCoin,
    coins,
    formDisabled,
    formLoading,
    selectCoin,
    selectNetwork,
    submitForm,
}: paymentFormProps) => {
    return (
        <>
            {/* Logo and Header */}
            <FormHeader
                title="Checkout Details"
                description="Complete your purchase by selecting your preferred chain"
                className="ta:px-6 ta:pt-8"
            />

            <FormBody className="ta:px-6 bg-[#EAECF0] ta:my-0">
                <div className="ta:flex ta:flex-col ta:items-center ta:justify-center ta:gap-6 ta:w-full">
                    {/* Amount display box */}
                    <div className="ta:w-full ta:bg-[#F5F5F5] ta:p-8 ta:flex ta:items-center ta:justify-center ta:border-y ta:border-[#EAECF0]">
                        <p className="ta:text-[#667085] ta:text-3xl ta:font-bold">
                            ${amount.toFixed(2)}
                        </p>
                    </div>

                    {/* Selection fields side by side */}
                    <div className="ta:flex ta:flex-row ta:w-full">
                        {/* Network / Chain */}
                        <div className="ta:flex ta:flex-col ta:gap-2 ta:flex-1">
                            <label className="ta:text-sm ta:text-[#667085] ta:font-medium">
                                Network / Chain
                            </label>
                            <SelectDropdown
                                onChange={selectNetwork}
                                options={networks}
                                value={selectedNetwork}
                                className="ta:w-full"
                                disabled={formLoading}
                                triggerClassName="!ta:bg-white !ta:border !ta:border-[#E6E6E6] ta:rounded-l-xl ta:px-4 ta:py-3 focus:ta:outline-none hover:ta:border-[#D0D5DD] ta:justify-between ta:w-full ta:min-h-[44px]"
                                placeholder="Select Network/Chain"
                                loading={formLoading}
                            />
                        </div>

                        {/* Coin/Token */}
                        <div className="ta:flex ta:flex-col ta:gap-2 ta:flex-1">
                            <label className="ta:text-sm ta:text-[#667085] ta:font-medium">
                                Coin/Token
                            </label>
                            <SelectDropdown
                                onChange={selectCoin}
                                options={coins}
                                value={selectedCoin}
                                disabled={!selectedNetwork || formLoading}
                                loading={formLoading}
                                className="ta:w-full"
                                triggerClassName="!ta:bg-white !ta:border !ta:border-[#E6E6E6] ta:rounded-r-xl ta:px-4 ta:py-3 focus:ta:outline-none hover:ta:border-[#D0D5DD] ta:justify-between ta:w-full ta:min-h-[44px]"
                                placeholder="Select Coin/Token"
                            />
                        </div>
                    </div>
                </div>
            </FormBody>

            {/* Continue button with purple glow */}
            <FormFooter className="ta:flex ta:justify-center ta:items-center ta:w-full ta:p-6">
                <Button
                    className="ta:block ta:bg-black ta:text-white ta:rounded-xl ta:w-full ta:min-h-[44px] ta:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:ta:shadow-[0_0_25px_rgba(147,51,234,0.4)] ta:transition-shadow"
                    type="button"
                    disabled={formLoading || formDisabled}
                    onClick={() => (formLoading ? null : submitForm())}
                >
                    {formLoading ? <Spinner size={16} /> : "Continue"}
                </Button>
            </FormFooter>
        </>
    );
};

export default PaymentForm;
