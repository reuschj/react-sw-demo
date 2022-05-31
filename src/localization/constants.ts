import { AppLocale, LocalizedStrings } from "./model"

export const localizedStrings: Record<AppLocale, Partial<LocalizedStrings>> = {
  [AppLocale.EnglishUS]: {},
  [AppLocale.EnglishGB]: {},
  [AppLocale.SpanishUS]: {
    titleVanilla: "Vainilla TS",
    titleFC: "React Componente Funcional",
    titleCC: "React Componente Clase",
    filter: "Filtrar",
    filterByName: "Filtrar por nombre",
    multiplier: "Multiplicador",
    resetFields: 'Presione "Escape" para restablecer el formulario',
    loading: "Cargando...",
    colName: "Nombre",
    colHeight: "Altura",
    colMass: "Masa",
    colPower: "Energía",
    unknown: "desconocido"
  },
}

export const fallbackDefaults: LocalizedStrings = {
  titleVanilla: "Vanilla TS",
  titleFC: "React Functional Component",
  titleCC: "React Class Component",
  filter: "Filter",
  filterByName: "Filter by name",
  multiplier: "Multiplier",
  resetFields: 'Press "Escape" to reset fields',
  loading: "Loading...",
  colName: "Name",
  colHeight: "Height",
  colMass: "Mass",
  colPower: "Power",
  unknown: "unknown",
  incalculable: "-"
}
