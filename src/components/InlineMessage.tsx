import { FC } from "react";
import { TextContainer } from "../model";

const InlineMessage: FC<TextContainer> = ({ text }) => (
  <span>{text}</span>
);

export default InlineMessage;
