/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import {
    SelectDropdown,
    Button,
    Spinner,
    FormHeader,
    FormBody,
} from "../_components";
import tenderIcon from "../../assets/icons/tender.svg";
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
        <div className="ta:flex ta:flex-col ta:h-full ta:w-full ta:gap-8">
            <FormHeader
                title="Checkout Details"
                description="Complete your purchase by selecting your preferred chain"
                icon={tenderIcon}
            />

            <FormBody>
                <div className="ta:flex ta:flex-row ta:bg-[#FAFAFA] ta:w-full ta:justify-between ta:p-4 ta:border-[#EAECF0]">
                    <h3 className="ta:text-base ta:font-bold">Total</h3>
                    <p className="ta:text-2xl ta:font-bold">
                        {amount} {fiatCurrency.toUpperCase()}{" "}
                    </p>
                </div>
                <div className="ta:flex ta:flex-col ta:p-4 ta:gap-4">
                    <div className="ta:flex ta:flex-col ta:gap-2 ta:w-full">
                        <label>Network / Chain</label>
                        <SelectDropdown
                            onChange={selectNetwork}
                            options={networks}
                            value={selectedNetwork}
                            className="sm:ta:w-full"
                            disabled={formLoading}
                            triggerClassName="ta:w-full focus:ta:outline-none !ta:bg-transparent"
                            placeholder="Select Network / Chain"
                            loading={formLoading}
                        />
                    </div>
                    <div className="ta:flex ta:flex-col ta:gap-2 ta:w-full">
                        <label>Select Currency</label>
                        <SelectDropdown
                            onChange={selectCoin}
                            options={coins}
                            value={selectedCoin}
                            disabled={!selectedNetwork || formLoading}
                            loading={formLoading}
                            className="sm:ta:w-full"
                            triggerClassName="ta:w-full focus:ta:outline-non !ta:bg-transparent"
                            placeholder="Select Currency"
                        />
                    </div>
                </div>
            </FormBody>

            <div className="ta:flex ta:h-full ta:gap-2 ta:justify-center ta:items-center ta:bg-[#FAFAFA] ta:p-6 ta:w-full ta:bottom-0 ta:rounded-b-2xl">
                <Button
                    className="ta:block ta:p-2 ta:bg-black ta:text-white ta:rounded-lg ta:min-w-[280px]"
                    type="button"
                    disabled={formLoading || formDisabled}
                    onClick={() => (formLoading ? null : submitForm())}
                >
                    {formLoading ? <Spinner size={16} /> : "Continue"}
                </Button>
            </div>
        </div>
    );
};

export default PaymentForm;
