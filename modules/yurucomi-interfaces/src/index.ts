export type ResponseData = {
  _from: string;
  _time: number;
  _to?: string;
  _with?: Array<string>;
  _which?: Tuple;
  [key: string]: any;
};

export type Tuple = {
  [key: string]: number | string | boolean | Object;
};

export type YurucomiWatchOperation = {
  tsName: string;
  from: string;
};

export type Settings = {
  [tsNamw: string]: {
    [userName: string]: Setting;
  };
};

export type Setting = {
  [propName: string]: Array<{ value: any; date: number }>;
};

export type SettingUpdateData = {
  tsName: string;
  userName: string;
  settings: Settings;
};
