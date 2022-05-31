import { ChangeEventHandler, FC, useContext, useEffect, useState } from "react";
import { StarWarsPersonTable, FilterInput, InlineMessage, Loading, MultiplierInput, Title } from "./components";
import LabeledInput from "./components/LabeledInput";
import { DEFAULT_MULTIPLIER } from "./constants";
import { AppLocale, makeUIStringLookup } from "./localization";
import { EnvContext, LocaleContext, MainProps } from "./main";
import { StarWarsPerson } from "./model";
import { readAllPagesFromPeopleApi } from "./utility";

// --------------------------------------------------------------------- /

const FunctionalComp: FC<MainProps> = ({ useMockApi }) => {
  const locale = useContext(LocaleContext);
  const t = makeUIStringLookup({ locale, defaultLocale: AppLocale.EnglishUS });

  const env = useContext(EnvContext);

  // State ---------------------------------------------------------- /

  const [isLoading, setIsLoading] = useState(false);
  const [multiplier, setMultiplier] = useState(DEFAULT_MULTIPLIER);
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState<StarWarsPerson[] | undefined>(undefined);

  const resetState = () => {
    setIsLoading(false);
    setFilterText("");
    setMultiplier(DEFAULT_MULTIPLIER);
    setData(undefined);
  }

  // Data loading ---------------------------------------------------- /

  const getAllPeople = async (options?: { pageLimit?: number }) => {
    setIsLoading(true);
    await readAllPagesFromPeopleApi(env, {
      useMockApi,
      onNewDataCallback: (results) => {
        setData((current) => current ? [...current, ...results] : results);
      },
      onErrorCallback: onError,
      pageLimit: options?.pageLimit,
    });
    setIsLoading(false);
  };

  // Event handling -------------------------------------------------- /

  const onKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        resetState();
    }
  };

  const onFilterChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilterText(event.target.value);
  };

  const onMultiplierChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setMultiplier(Number.parseInt(event.target.value, 10));
  };

  const onError = (e: Error) => {
    setIsLoading(false);
    alert(e.message);
  };

  // Effects ------------------------------------------------------ /

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!data) getAllPeople();
  }, [env, data]);

  // Render ---------------------------------------------------------- /

  return (
    <div id="functional-comp">
      <Title label={t("titleFC")} />
      <LabeledInput label={t("filter")}>
        <FilterInput
          value={filterText}
          onChange={onFilterChange}
          placeholder={t("filterByName")}
        />
      </LabeledInput>
      <LabeledInput label={t("multiplier")}>
        <MultiplierInput
          value={multiplier}
          onChange={onMultiplierChange}
          placeholder={t("multiplier")}
        />
      </LabeledInput>
      <InlineMessage text={t("resetFields")} /> 
      <Loading
        isLoading={isLoading}
        text={t("loading")}
      />
      <StarWarsPersonTable
        data={data}
        filter={filterText}
        multiplier={multiplier}
        nameText={t("colName")}
        heightText={t("colHeight")}
        massText={t("colMass")}
        powerText={t("colPower")}
        unknownText={t("unknown")}
        incalculableText={t("incalculable")}
      />
    </div>
  );
};

export default FunctionalComp;
