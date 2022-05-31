import { FC } from "react";
import { fallbackDefaults } from "../localization";
import { BasicInput } from "../model";

export interface FilterInputProps extends Partial<BasicInput> {} 

const FilterInput: FC<FilterInputProps> = ({
    value,
    onChange,
    placeholder = fallbackDefaults.filterByName,
}) => (
    <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />
);

export default FilterInput;
