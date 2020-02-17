export default (image_name)=>{

  const splitFileName = image_name.split("_");

  let number;
  if (splitFileName[2].includes("pm")){
    number = splitFileName[2].split("pm")[1].substr(1);
  } else {
    number = splitFileName[2];
  }
//[2]_[3]_[4]_[5]_[6]
//pm0150_00_pgo_a_shiny
//025_00_03
//[2] = number
//[3] = gender if 01
//[4] = special number
  const shiny = image_name.includes("shiny");

  let special = false;
  if ((splitFileName.length === 6 && shiny) || (splitFileName.length === 5 && !shiny) || splitFileName[2].includes("pm")){
    special = true;
  }

  let gender_exception;
  if (splitFileName[3].includes("11")){
    if (
      number === "421"
      ||
      number === "422"
      ||
      number === "423"
    ){
      gender_exception = true;
    }
  }

  let additional_gender = false;
  if (shiny || special){//gender at 3 = "01"
    if (splitFileName[3] == "01"){
      if (number !== "453"){//fix for stupid Croagunk issue
        additional_gender = true;
      }
    }
  } else {// regular gender at 3 = "01.png"
    if (splitFileName[3].includes("01") || gender_exception){
      if (number !== "453"){//fix for stupid Croagunk issue
        additional_gender = true;
      }
    }
  }

  const regular = (!special && !shiny);

  let gen;
  if (number <= 151){
    gen = 1;
  } else if (number <= 251){
    gen = 2;
  } else if (number <= 386){
    gen = 3;
  } else if (number <= 493){
    gen = 4;
  } else if (number <= 649){
    gen = 5;
  } else if (number <= 721){
    gen = 6;
  } else if (number <= 809){
    gen = 7;
  }

  const id = splitFileName.map((fragment, key)=>{
    if (key === (splitFileName.length - 1)){
      return fragment.split('.')[0];
    } else if (key !== 0 && key !== 1){
      return fragment;
    }
  }).filter((f)=>{return f;}).join("_");

  if (image_name.includes("pm")){
    console.log({
      image: image_name,
      id,
      number,
      special,
      regular,
      gen,
      additional_gender,
      shiny
    })
  }

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

}
