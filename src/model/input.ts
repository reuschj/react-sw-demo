import { ChangeEventHandler } from "react";

/**
 * Describes any object containing a `label` attribute
 */
export interface Labeled {
    label: string;
}

export interface BasicInput<Value = string> {
    placeholder: string;
    value?: Value;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export interface StepperInput extends BasicInput<number> {
    placeholder: string;
    min?: number;
    max?: number;
    defaultValue: number;
}