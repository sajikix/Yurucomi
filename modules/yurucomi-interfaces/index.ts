export type Tuple = {
  _from: string;
  _time: number;
  _to?: string;
  _with?: Array<string>;
  _which?: Tuple;
  [key: string]: any;
};
