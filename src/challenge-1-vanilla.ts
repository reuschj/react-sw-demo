import { DEFAULT_MULTIPLIER } from "./constants";
import { AppLocale, LocalizedStrings, makeUIStringLookup, UIStringLookup } from "./localization";
import { StarWarsPerson } from "./model";
import { Env } from "./services";
import { readAllPagesFromPeopleApi } from "./utility";

// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

enum Col {
  Name = "col-name",
  Height = "col-height",
  Mass = "col-mass",
  Power = "col-power",
}

const vanillaPrefix = "v-";

// Omit the 'v-' prefix here
const stringToIDMap: Record<keyof LocalizedStrings, string | undefined> = {
  titleVanilla: "title",
  titleFC: undefined,
  titleCC: undefined,
  filter: "filter-label",
  filterByName: undefined,
  multiplier: "multiplier-label",
  resetFields: 'reset-fields',
  loading: "loader",
  colName: Col.Name,
  colHeight: Col.Height,
  colMass: Col.Mass,
  colPower: Col.Power,
  unknown: undefined,
  incalculable: undefined,
}

// Setup and state ---------------------------------------------------------------- /

export interface VanillaAppSetup {
  locale: AppLocale;
  env: Env;
  useMockApi: boolean;
}

interface VanillaAppState {
  isLoading: boolean;
  multiplier: number;
  filterText: string;
  data?: StarWarsPerson[];
}

const initialState: VanillaAppState = {
  isLoading: false,
  multiplier: DEFAULT_MULTIPLIER,
  filterText: "",
  data: undefined,
};

// Class def ------------------------------------------------------------------ /

class VanillaApp {
  private document: Document;
  private setup: VanillaAppSetup;
  private state: VanillaAppState = { ...initialState };
  private lastStateRendered: Partial<Omit<VanillaAppState, "isLoading" | "data">> = {};
  private translate: UIStringLookup;

  private static idDict = {
    tableBody: `${vanillaPrefix}tbody`,
    filter: `${vanillaPrefix}filter`,
    multiplier: `${vanillaPrefix}multiplier`,
    loader: `${vanillaPrefix}loader`,
  };

  /**
   * Builds an instance of the vanilla app but does not initialize.
   * Call `.init()` method to initialize.
   *
   * @param document - Pass document reference
   * @param setup - Setup object of required settings for the app.
   */
  constructor(
    document: Document,
    setup: VanillaAppSetup,
  ) {
    this.document = document;
    this.setup = setup;
    const { locale } = setup;
    this.translate = makeUIStringLookup({ locale, defaultLocale: AppLocale.EnglishUS });
  }

  // Initialization ------------------------------------------------------------------ /

  /**
   * Sets the app up and loads data
   */
  init = () => {
    this.setLoading(false);
    this.setAllLocalizedUITextStrings();
    this.initializeInputs();
    this.setListeners();
    this.getAllPeople();
  }

  // State setters ------------------------------------------------------------------ /
  // These ensure updates to estate also kick off necessary re-renders

  private setLoading = (isLoading: boolean) => {
    this.state.isLoading = isLoading;
    const loader = this.document.getElementById(VanillaApp.idDict.loader);
    if (loader) {
      loader.style.display = isLoading ? "block" : "none";
    }
  }

  private setFilter = (filterText: string) => {
    const current = this.state.filterText;
    if (filterText === current) return;
    this.state.filterText = filterText;
    this.rerenderTable();
  }

  private setMultiplier = (multiplier: number) => {
    const current = this.state.multiplier;
    if (multiplier === current) return;
    this.state.multiplier = multiplier;
    this.rerenderTable();
  }

  private setData = (data: StarWarsPerson[], options?: { increment?: boolean }) => {
    const { increment } = options ?? {};
    const { data: current } = this.state;
    const updatedData = current ? [...current, ...data] : data;
    this.state.data = updatedData;
    try {
      this.loadDataToTable(increment ? data : updatedData, {
        clearContent: !increment,
      });
    } catch (e) {
      this.onError(e as Error);
    }
  };

  // Common element getters ------------------------------------------------------- /

  private get tableBody(): HTMLElement | undefined {
    return this.document.getElementById(VanillaApp.idDict.tableBody) ?? undefined;
  }

  private get filterElement(): HTMLInputElement | undefined {
    return this.document.getElementById(VanillaApp.idDict.filter) as HTMLInputElement ?? undefined;
  }

  private get multiplierElement(): HTMLInputElement | undefined {
    return this.document.getElementById(VanillaApp.idDict.multiplier) as HTMLInputElement ?? undefined;
  }

  // Error handling ------------------------------------------------------------------ /

  private onError = (e: Error | string) => {
    this.setLoading(false);
    alert(typeof e === "string" ? e : e.message);
  };

  // Initialization steps ------------------------------------------------------------------ /

  private initializeInputs = () => {
    const { filterElement, multiplierElement } = this;
    if (filterElement) filterElement.value = initialState.filterText;
    if (multiplierElement) multiplierElement.value = initialState.multiplier.toString();
  };

  private setAllLocalizedUITextStrings = () => {
    const setTextContentFor = (id: string, key: keyof LocalizedStrings) => {
      const element = this.document.getElementById(id);
      if (!element) return;
      element.textContent = this.translate(key);
    }
    (Object.keys(stringToIDMap) as (keyof LocalizedStrings)[]).forEach((key) => {
      const value = stringToIDMap[key];
      if (!value) return;
      const id = `${vanillaPrefix}${value}`;
      setTextContentFor(id, key);
    });
    const filterInput = this.document.getElementById(VanillaApp.idDict.filter);
    if (filterInput) (filterInput as HTMLInputElement).placeholder = this.translate("filterByName");
  }

  private getAllPeople = async (options?: { pageLimit?: number }) => {
    this.setLoading(true);
    const { useMockApi, env } = this.setup;
    await readAllPagesFromPeopleApi(env, {
      useMockApi,
      onNewDataCallback: (results) => {
        this.setData(results, { increment: true });
      },
      onErrorCallback: this.onError,
      pageLimit: options?.pageLimit,
    });
    this.setLoading(false);
  };

  // Data loading ---------------------------------------------------------- /

  private loadDataToTable = (data?: StarWarsPerson[], options?: { clearContent?: boolean }) => {
    const { clearContent } = options ?? {};
    const dataToLoad = data ?? this.state.data;
    if (!dataToLoad) return;
    const { tableBody } = this;
    if (!tableBody) {
      throw new Error(`Could on load table data: ID "${VanillaApp.idDict.tableBody}" was not found.`);
    }
    if (clearContent) VanillaApp.emptyContentFrom(tableBody);
    dataToLoad.forEach((person) => {
      const row = this.makeRowFor(person);
      if (row) tableBody.appendChild(row);
    });
    this.lastStateRendered.filterText = this.state.filterText;
    this.lastStateRendered.multiplier = this.state.multiplier;
  }

  // Load data helper methods ---- /

  private makeRowFor(person: StarWarsPerson): HTMLTableRowElement | undefined {
    const { name, height, mass } = person;
    const rowId = this.toId(name);
    const display = this.shouldRender(rowId);
    if (!display) return undefined;
    const getColId = (col: Col) => this.getColId(rowId, col);
    return this.makeRow(
      [
        { content: name, id: getColId(Col.Name) },
        { content: this.describe(height), id: getColId(Col.Height) },
        { content: this.describe(mass), id: getColId(Col.Mass) },
        { content: this.getPower(height, mass), id: getColId(Col.Power) }
      ],
      { id: rowId }
    );
  }

  private makeRow(
    colContent: { content: string, id?: string, className?: string }[],
    rowOptions?: { id?: string, className?: string },
  ) {
    const row = this.document.createElement("tr");
    if (rowOptions) {
      const { id, className } = rowOptions;
      if (id) row.id = id;
      if (className) row.className = className;
    }
    colContent.forEach(({ content, id, className }) => {
      const col = this.document.createElement("td");
      if (id) col.id = id;
      if (className) col.className = className;
      const textNode = this.document.createTextNode(content);
      col.appendChild(textNode);
      row.appendChild(col);
    });
    return row;
  }

  // Available overloads
  private getPower(person: StarWarsPerson): string;
  private getPower(height?: number, mass?: number): string;

  // Implementation only
  private getPower(heightOrPerson?: StarWarsPerson | number, m?: number): string {
    const height = typeof heightOrPerson === "object" ? heightOrPerson.height : heightOrPerson;
    const mass = typeof heightOrPerson === "object" ? heightOrPerson.mass ?? m : m;
    if (typeof height === "undefined" || typeof mass === "undefined") {
      return this.translate("incalculable");
    }
    const { multiplier } = this.state;
    const { locale } = this.setup;
    return (height * mass * multiplier).toLocaleString(locale);
  }

  private static emptyContentFrom = (element: HTMLElement) => {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  };

  // Rendering ------------------------------------------------------------- /

  private rerenderTable = () => {
    const { filterText, multiplier } = this.state;
    const body = this.tableBody;
    if (!body) return;
    const updatedFilter = filterText !== this.lastStateRendered.filterText;
    const updatedMultiplier = multiplier !== this.lastStateRendered.multiplier;
    for (let index in body.children) {
      const row = body.children[index] as HTMLElement;
      if (updatedFilter) {
        this.setElementVisibilityBasedOnFilter(row);
        this.lastStateRendered.filterText = filterText;
      }
      if (updatedMultiplier) {
        this.updatePowerCalculationForRow(row.id, index);
        this.lastStateRendered.multiplier = multiplier;
      }
    }
    this.lastStateRendered.filterText = filterText;
  };

  // Render helper methods ---- /

  private shouldRender = (value?: string): boolean => {
    const { filterText } = this.state;
    if (filterText.length === 0 || typeof value === "undefined") return true;
    return this.standardized(value).includes(this.standardized(filterText));
  }

  private setElementVisibilityBasedOnFilter = (element: HTMLElement) => {
    const display = this.shouldRender(element.id);
    if (element.style) element.style.display = display ? "table-row" : "none";
  };

  private updatePowerCalculationForRow = (rowId: string, rowIndex: string) => {
    const person = this.state.data ? this.state.data[Number.parseInt(rowIndex, 10)] : undefined;
    if (person) {
      const powerCol = this.document.getElementById(this.getColId(rowId, Col.Power));
      if (powerCol) powerCol.textContent = this.getPower(person);
    }
  }

  // Utils to ensure standardized string reformatting ------------------------- /

  private standardized = (value: string): string => typeof value === "string" ? value.toLowerCase().replace(" ", "-") : value;

  private toId = (value: string): string => `${vanillaPrefix}${this.standardized(value)}`;

  private getColId = (rowId: string, col: Col) => `${rowId}-${col}`;

  describe = (numeric?: number): string => numeric?.toLocaleString(this.setup.locale) ?? this.translate("unknown");

  // Listeners ---------------------------------------------------------------- /

  private setListeners() {
    this.document.addEventListener("keydown", this.keyboardEventListener);
    this.filterElement?.addEventListener("keyup", this.filterChangeListener);
    this.multiplierElement?.addEventListener("change", this.multiplierChangeListener);
  }

  private removeListeners() {
    this.document.removeEventListener("keyup", this.keyboardEventListener);
    this.filterElement?.removeEventListener("keyup", this.filterChangeListener);
    this.multiplierElement?.removeEventListener("change", this.multiplierChangeListener);
  }

  // ----------------- /

  private keyboardEventListener = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        this.reset();
    }
  };

  private filterChangeListener = (event: Event) => {
    const filter = (event as unknown as React.ChangeEvent<HTMLInputElement>).target.value;
    if (typeof filter === "string") this.setFilter(filter);
  };

  private multiplierChangeListener = (event: Event) => {
    const multiplier = (event as unknown as React.ChangeEvent<HTMLInputElement>).target.value;
    if (typeof multiplier !== "undefined") this.setMultiplier(Number.parseInt(multiplier, 10));
  };

  // Reset ---------------------------------------------------------------- /

  private reset = () => {
    this.removeListeners();
    this.resetState();
    this.resetTable();
    this.init();
  }

  private resetState() {
    this.setLoading(initialState.isLoading);
    this.setFilter(initialState.filterText);
    this.setMultiplier(initialState.multiplier);
    this.state.data = undefined;
  }

  private resetTable() {
    const { tableBody } = this;
    if (tableBody) VanillaApp.emptyContentFrom(tableBody);
  }
}

// Load app ---------------------------------------------------------------- /

export function runVanillaApp(document: Document, setup: VanillaAppSetup) {
  const vanillaApp = new VanillaApp(document, setup);
  vanillaApp.init();
}
