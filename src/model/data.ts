/**
 * Describes any object containing a `data` attribute
 */
export interface DataContainer<DataType> {
  data: DataType;
}

/**
 * Describes any object containing a `filter` attribute
 */
export interface Filtered {
  filter: string;
}

/**
 * Describes any object containing a `multiplier` attribute
 */
export interface Multiplied {
  multiplier: number;
}
