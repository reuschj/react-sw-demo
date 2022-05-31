import { FC, ReactElement } from "react";
import { Labeled } from "../model";

export interface LabeledInputProps extends Labeled {
    children: ReactElement;
} 

const LabeledInput: FC<LabeledInputProps> = ({
    label,
    children,
}) => (
    <span>
        <span>{label}: </span>{ children }
    </span>
);

export default LabeledInput;
