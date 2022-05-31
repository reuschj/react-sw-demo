import { convertToNumber, splitCommaSeparatedList as split } from "../utility";
import { StarWarsPersonResponse } from "../services/rest/swapi/model/responses";

/**
 * An object containing demographic information about a single Star Wars character.
 * The data in this has been slightly transformed from the swapi API response.
 */
type StarWarsPerson = Omit<StarWarsPersonResponse, "height" | "mass" | "hair_color" | "skin_color" | "eye_color" | "birth_year"> & {
  height?: number;
  mass?: number;
  hairColor: string[];
  skinColor: string[];
  eyeColor: string[];
  birthYear: string;
}

/**
 * @param response - The raw swapi API response
 * @returns A slightly transformed version of that response
 */
export const transformPersonResponse = (response: StarWarsPersonResponse): StarWarsPerson => {
  const {
    height,
    mass,
    hair_color,
    skin_color,
    eye_color,
    birth_year,
    ...rest
  } = response;
  return {
    height: convertToNumber(height),
    mass: convertToNumber(mass),
    hairColor: split(hair_color),
    skinColor: split(skin_color),
    eyeColor: split(eye_color),
    birthYear: birth_year,
    ...rest
  };
};

export default StarWarsPerson;


// TODO: Map enums for hair color, eye color, skin color and gender when required by a story. For now, this is not necessary.
// export enum HairColor {
//   Auburn = "auburn",
//   Black = "black",
//   Blond = "blond",
//   Brown = "brown",
//   Grey = "grey",
//   None = "none",
//   NotApplicable = "n/a",
// }

// export enum SkinColor {
//   Black = "black",
//   Blue = "blue",
//   Fair = "fair",
//   Gold = "gold",
//   Green = "green",
//   Light = "light",
//   Red = "red",
//   White = "white",
// }

// export enum EyeColor {
//   Black = "black",
//   Blue = "blue",
//   BlueGray = "blue-gray",
//   Brown = "brown",
//   Red = "red",
//   Yellow = "yellow",
// }

// export enum Gender {
//   Female = "female",
//   Male = "male",
//   NotApplicable = "n/a",
// }