export default (file)=>{
console.log(file);
  const splitFileName = file.split("_");

  const shiny = file.includes("shiny");

  let special = false;
  if ((splitFileName.length === 6 && shiny) || (splitFileName.length === 5 && !shiny)){
    special = true;
  }

  let additional_gender = false;
  if (shiny || special){//gender at 3 = "01"
    if (splitFileName[3] == "01"){
      if (splitFileName[2] !== "453"){//fix for stupid Croagunk issue
        additional_gender = true;
      }
    }
  } else {// regular gender at 3 = "01.png"
    if (splitFileName[3].includes("01")){
      if (splitFileName[2] !== "453"){//fix for stupid Croagunk issue
        additional_gender = true;
      }
    }
  }

  const regular = (!special && !shiny);

  let gen;
  if (splitFileName[2] <= 151){
    gen = 1;
  } else if (splitFileName[2] <= 251){
    gen = 2;
  } else if (splitFileName[2] <= 386){
    gen = 3;
  } else if (splitFileName[2] <= 493){
    gen = 4;
  } else if (splitFileName[2] <= 649){
    gen = 5;
  } else if (splitFileName[2] <= 721){
    gen = 6;
  } else if (splitFileName[2] <= 809){
    gen = 7;
  }

  const id = splitFileName.map((fragment, key)=>{
    if (key === (splitFileName.length - 1)){
      return fragment.split('.')[0];
    } else if (key !== 0 && key !== 1){
      return fragment;
    }
  }).filter((f)=>{return f;}).join("_");

  return {
    image: file,
    id,
    number: splitFileName[2],
    special,
    regular,
    gen,
    additional_gender,
    shiny
  };

}
