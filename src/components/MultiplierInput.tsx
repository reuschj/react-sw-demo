import { FC } from "react";
import { DEFAULT_MULTIPLIER, MAX_MULTIPLIER, MIN_MULTIPLIER } from "../constants";
import { StepperInput } from "../model";

export interface MultiplierInputProps extends Partial<StepperInput> {}

const MultiplierInput: FC<MultiplierInputProps> = ({
    value,
    onChange,
    placeholder,
    min = MIN_MULTIPLIER,
    max = MAX_MULTIPLIER,
    defaultValue = DEFAULT_MULTIPLIER
}) => (
    <input
        placeholder={placeholder ?? `${defaultValue}`}
        value={value}
        onChange={onChange}
        type="number"
        min={min}
        max={max}
    />
);

export default MultiplierInput;
