import { Tuple } from "yurucomi-interfaces";

export const filter = (ysName: string, tuple: Tuple) => {
  const localData = JSON.parse(localStorage.getItem(ysName) || "[]");
  let returnData = false;
  localData.forEach(ele => {
    if (tuple.hasOwnProperty(ele.key)) {
      ele.values.forEach(e => {
        const isMatched = e.checked && e.value === tuple[ele.key];
        if (isMatched) {
          returnData = true;
        }
      });
    }
  });
  return returnData;
};
