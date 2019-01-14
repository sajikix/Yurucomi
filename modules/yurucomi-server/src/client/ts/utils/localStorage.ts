import { YurucomiEvent, TmpDataArray } from "yurucomi-interfaces";
import { json } from "body-parser";

export const setEventToLocalData = (event: YurucomiEvent) => {
  const oldEvents: Array<YurucomiEvent> =
    JSON.parse(localStorage.getItem(`${event._where}TmpData`)) || [];
  const newEvents = [event, ...oldEvents];
  localStorage.setItem(`${event._where}TmpData`, JSON.stringify(newEvents));
  localStorage.setItem(`${event._where}LastUpdate`, String(event._time));
};

export const setTmpToLocalData = (
  ysName: string,
  tmpData: Array<YurucomiEvent>
) => {
  const lastUpdate = JSON.parse(localStorage.getItem(`${ysName}LastUpdate`));
  const newEvents = filterTmpData(tmpData, lastUpdate);
  const oldEvents: Array<YurucomiEvent> =
    JSON.parse(localStorage.getItem(`${ysName}TmpData`)) || [];
  localStorage.setItem(
    `${ysName}TmpData`,
    JSON.stringify([...newEvents, ...oldEvents])
  );
  if (newEvents.length > 0) {
    localStorage.setItem(`${ysName}LastUpdate`, String(newEvents[0]._time));
  }
  return [...newEvents, ...oldEvents];
};

const filterTmpData = (data: Array<YurucomiEvent>, lastUpdate: number) => {
  const filtered = data
    .filter(ele => {
      return ele._time > lastUpdate;
    })
    .sort((a, b) => {
      return b._time - a._time;
    });
  return filtered;
};

export const getEvetsFromLocalData = (ysName: string): Array<YurucomiEvent> => {
  return JSON.parse(localStorage.getItem(`${ysName}TmpData`)) || [];
};

export const setWatchingtoLocalData = (ysName: string, watchingData: any) => {
  console.log(watchingData);
  const dataArray = [];
  for (let d in watchingData.settings) {
    dataArray.push({
      key: d,
      values: watchingData.settings[d].map(ele => {
        return { value: ele.value, checked: true };
      }),
      checked: true,
    });
  }
  localStorage.setItem(ysName, JSON.stringify(dataArray));
};

export const getWatchingFromLocalData = (ysName: string) => {
  const data = JSON.parse(localStorage.getItem(ysName)) || {};
  return data;
};
