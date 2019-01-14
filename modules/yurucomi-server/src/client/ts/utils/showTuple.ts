import { Tuple } from "yurucomi-interfaces";

export const shortningTuple = (tuple: Tuple) => {
  const tupleString = JSON.stringify(tuple);
  const maxLength = 50;
  if (tupleString.length > maxLength) {
    const startString = tupleString.slice(0, maxLength - 18);
    const endString = tupleString.slice(-10);
    return `${startString} ...... ${endString}`;
  } else {
    return tupleString;
  }
};

export const showFullTuple = (tuple: Tuple) => {
  const tupleString = JSON.stringify(tuple);
  if (tupleString.length > 50) {
    const returnData: Array<{ value: string; space: number }> = [
      { value: "{", space: 0 },
    ];
    for (let key in tuple) {
      const fullLength = String(key).length + String(tuple[key]).length + 3;
      const forLength = Math.ceil(fullLength / 50);
      console.log(forLength);
      const keyLength = String(key).length + 3;
      for (let i = 0; i < forLength; i++) {
        if (i === 0) {
          const insert = String(tuple[key]).slice(0, 50 - keyLength);
          if (forLength === 1) {
            returnData.push({
              value: `${key} : ${insert},`,
              space: 1,
            });
          } else {
            returnData.push({
              value: `${key} : ${insert}`,
              space: 1,
            });
          }
        } else {
          const insert = String(tuple[key]).substr(i * 50 - keyLength, 50);
          if (i === forLength - 1) {
            returnData.push({
              value: `${insert},`,
              space: 2,
            });
          } else {
            returnData.push({ value: `${insert}`, space: 2 });
          }
        }
      }
    }
    returnData.push({ value: "}", space: 0 });
    return returnData;
  } else {
    return [{ value: tupleString, space: 0 }];
  }
};
