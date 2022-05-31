import { FC } from "react";
import { Labeled } from "../model";

export interface TitleProps extends Labeled {};

const Title: FC<TitleProps> = ({ label }) => (
  <h2>{label}</h2>
);

export default Title;
