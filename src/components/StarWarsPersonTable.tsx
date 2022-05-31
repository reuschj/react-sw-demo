import { createElement, FC, useMemo } from "react";
import { DataContainer, Filtered, Labeled, Multiplied, StepperInput, StarWarsPerson } from "../model";
import StarWarsPersonRow from "./StarWarsPersonRow";

export interface StarWarsPersonTableProps extends Partial<DataContainer<StarWarsPerson[]>>, Partial<Filtered>, Partial<Multiplied> {
    nameText?: string;
    heightText?: string;
    massText?: string;
    powerText?: string;
    unknownText?: string;
    incalculableText?: string;
}

const StarWarsPersonTable: FC<StarWarsPersonTableProps> = ({
    data,
    filter,
    multiplier = 1,
    nameText,
    heightText,
    massText,
    powerText,
    unknownText,
    incalculableText
}) => {
    if (!data) return null;
    const deps = [data, multiplier];
    const allRows = useMemo(() => data.map((person, index) => ({
        name: person.name,
        element: createElement(
            StarWarsPersonRow, {
                key: index,
                person,
                multiplier,
                unknownText,
                incalculableText,
            }
        ),
    })), deps);
    const filteredRows = useMemo(() => {
        const filtered = allRows.filter(
            ({ name }) => filter && filter.length ? name.toLowerCase().includes(filter.toLowerCase()) : true
        );
        return filtered.map(({ element }) => element);
    }, [...deps, filter]);
    return (
        <table width="100%">
            <thead>
                <tr>
                    <th>{nameText}</th>
                    <th>{heightText}</th>
                    <th>{massText}</th>
                    <th>{powerText}</th>
                </tr>
            </thead>
            <tbody>
                { filteredRows }
            </tbody>
        </table>
    );
}

export default StarWarsPersonTable;
