export const itemAvailable = (array: any[], value: any) => {
  let item = array.find((element) => {
    return element === value;
  });

  if (item) {
    return true;
  } else {
    return false;
  }
};
