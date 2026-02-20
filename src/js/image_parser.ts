export interface ParsedPokemon {
  image: string;
  id: string;
  number: string;
  special: boolean;
  regular: boolean;
  gen: number | undefined;
  additional_gender: boolean;
  shiny: boolean;
}

const imageParser = (image_name: string): ParsedPokemon => {

  const splitFileName = image_name.split("_");

  let number: string;
  if (splitFileName[2].includes("pm")){
    number = splitFileName[2].split("pm")[1].substr(1);
  } else {
    number = splitFileName[2];
  }

  const shiny = image_name.includes("shiny");

  let special = false;
  if ((splitFileName.length === 6 && shiny) || (splitFileName.length === 5 && !shiny) || splitFileName[2].includes("pm")){
    special = true;
  }

  let gender_exception: boolean | undefined;
  if (splitFileName[3].includes("11")){
    if (
      number === "421"
      ||
      number === "422"
      ||
      number === "423"
      ||
      number === "453"
    ){
      gender_exception = true;
    }
  }

  let additional_gender = false;
  if (shiny || special){
    if (splitFileName[3] == "01"){
      if (number !== "453"){
        additional_gender = true;
      }
    }
  } else {
    if (splitFileName[3].includes("01") || gender_exception){
      if (number !== "453"){
        additional_gender = true;
      }
    }
  }

  const regular = (!special && !shiny);

  let gen: number | undefined;
  if (parseInt(number) <= 151){
    gen = 1;
  } else if (parseInt(number) <= 251){
    gen = 2;
  } else if (parseInt(number) <= 386){
    gen = 3;
  } else if (parseInt(number) <= 493){
    gen = 4;
  } else if (parseInt(number) <= 649){
    gen = 5;
  } else if (parseInt(number) <= 721){
    gen = 6;
  } else if (parseInt(number) <= 809){
    gen = 7;
  }

  const id = splitFileName.map((fragment, key) => {
    if (key === (splitFileName.length - 1)){
      return fragment.split('.')[0];
    } else if (key !== 0 && key !== 1){
      return fragment;
    }
    return undefined;
  }).filter((f): f is string => f !== undefined).join("_");

  return {
    image: image_name,
    id,
    number,
    special,
    regular,
    gen,
    additional_gender,
    shiny
  };

};

export default imageParser;
