import { FC } from "react";
import { fallbackDefaults } from "../localization";
import { TextContainer } from "../model";

export interface LoadingProps extends Partial<TextContainer> {
  isLoading?: boolean;
};

const Loading: FC<LoadingProps> = ({
  isLoading,
  text = fallbackDefaults.loading,
}) => (
  <div>
    { isLoading && <div className="loader">{text}</div> }
  </div>
);

export default Loading;
