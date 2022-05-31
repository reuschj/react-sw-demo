import { ChangeEvent, Component } from "react";
import { Title, FilterInput, MultiplierInput, InlineMessage, Loading, StarWarsPersonTable } from "./components";
import LabeledInput from "./components/LabeledInput";
import { DEFAULT_MULTIPLIER } from "./constants";
import { AppLocale, makeUIStringLookup } from "./localization";
import { EnvContext, LocaleContext, MainProps } from "./main";
import { StarWarsPerson } from "./model";
import { Env } from "./services";
import { readAllPagesFromPeopleApi } from "./utility";

// --------------------------------------------------------------------- /

interface ClassCompState {
  isLoading: boolean;
  multiplier: number;
  filterText: string;
  data?: StarWarsPerson[];
}

const initialState: ClassCompState = {
  isLoading: false,
  multiplier: DEFAULT_MULTIPLIER,
  filterText: "",
  data: undefined,
};

// --------------------------------------------------------------------- /

class ClassComp extends Component<MainProps, ClassCompState> {
  constructor(props: MainProps) {
    super(props);
    this.state = { ...initialState };
    ClassComp.contextType = EnvContext;
  }

  // Lifecycle ---------------------------------------------------------- /

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress);

    if (!this.state.data) {
      this.getAllPeople();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  }

  // ---------------------------------------------------------------- /

  private get env(): Env {
    return this.context as Env;
  }

  private reset = () => {
    this.setState({ ...initialState });
    this.getAllPeople();
  }

  private setLoading = (isLoading: boolean) => {
    this.setState({
      isLoading,
    });
  }

  // Data loading ---------------------------------------------------- /

  private getAllPeople = async (options?: { pageLimit?: number }) => {
    this.setLoading(true);
    const { useMockApi } = this.props;
    await readAllPagesFromPeopleApi(this.env, {
      useMockApi,
      onNewDataCallback: (results) => {
        this.setState((currentState) => {
          const { data } = currentState;
          return {
            data: data ? [...(data), ...results] : results,
          };
        });
      },
      onErrorCallback: this.onError,
      pageLimit: options?.pageLimit,
    });
    this.setLoading(false);
  };

  // Event handling ---------------------------------------------------- /

  private onKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        this.reset();
    }
  };

  private onFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      filterText: event.target.value,
    });
  };

  private onMultiplierChange = ( event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      multiplier: Number.parseInt(event.target.value, 10),
    });
  };

  private onError = (e: Error) => {
    this.setLoading(false);
    alert(e.message);
  };

  // Render ---------------------------------------------------------- /

  render() {
    return (
      <LocaleContext.Consumer>
        {(locale) => {
          const t = makeUIStringLookup({ locale, defaultLocale: AppLocale.EnglishUS });
          return (
            <div id="class-comp">
              <Title label={t("titleCC")} />
              <LabeledInput label={t("filter")}>
                <FilterInput
                  value={this.state.filterText}
                  onChange={this.onFilterChange}
                  placeholder={t("filterByName")}
                />
              </LabeledInput>
              <LabeledInput label={t("multiplier")}>
                <MultiplierInput
                  value={this.state.multiplier}
                  onChange={this.onMultiplierChange}
                  placeholder={t("multiplier")}
                />
              </LabeledInput>
              <InlineMessage text={t("resetFields")} /> 
              <Loading
                isLoading={this.state.isLoading}
                text={t("loading")}
              />
              <StarWarsPersonTable
                data={this.state.data}
                filter={this.state.filterText}
                multiplier={this.state.multiplier}
                nameText={t("colName")}
                heightText={t("colHeight")}
                massText={t("colMass")}
                powerText={t("colPower")}
                unknownText={t("unknown")}
                incalculableText={t("incalculable")}
              />
            </div>
          );
        }}
      </LocaleContext.Consumer>
    );
  }
}

export default ClassComp;
