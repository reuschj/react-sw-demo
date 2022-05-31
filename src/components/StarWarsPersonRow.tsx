import { createElement, FC, useContext, useMemo } from "react";
import { fallbackDefaults } from "../localization";
import { LocaleContext } from "../main";
import { Multiplied, StarWarsPerson } from "../model";

export interface StarWarsPersonRowInnerProps {
    name: string;
    height: string;
    mass: string;
    power: string;
}

export const StarWarsPersonRowInner: FC<StarWarsPersonRowInnerProps> = ({
    name,
    height,
    mass,
    power,
}) => (
    <tr>
        <td>{name}</td>
        <td>{height}</td>
        <td>{mass}</td>
        <td>{power}</td>
    </tr>
);

// ----------------------------------------------------------------- /

export interface StarWarsPersonRowProps extends Partial<Multiplied> {
    person: StarWarsPerson;
    unknownText?: string;
    incalculableText?: string;
}

const StarWarsPersonRow: FC<StarWarsPersonRowProps> = ({
    person,
    multiplier = 1,
    unknownText = fallbackDefaults.unknown,
    incalculableText = fallbackDefaults.incalculable,
}) => {
    const { name, height, mass } = person;
    const deps = [height, mass, multiplier];
    const locale = useContext(LocaleContext);
    const power = useMemo(() => {
        if (typeof height === "undefined" || typeof mass === "undefined") {
            return incalculableText;
        }
        return (height * mass * multiplier).toLocaleString(locale);
    }, deps);
    const describe = (numeric?: number): string => numeric?.toLocaleString(locale) ?? unknownText;
    const element = useMemo(() => createElement(StarWarsPersonRowInner, {
        name,
        height: describe(height),
        mass: describe(mass),
        power
    }), [...deps, power]);
    return element;
}

export default StarWarsPersonRow;
