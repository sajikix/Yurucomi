export type Tuples = [Tuple];

export type TupleSpace = {
  tuples: Tuples;
};

export type Memory = {
  [key: string]: Tuples;
};

export type Tuple = {
  [key: string]: number | string | boolean | Object;
} & {};
export type InsertData = {
  _time: number;
  _from: string;
  _payload: Tuple;
  _id?: number;
  _where: string;
};

//FIXME: MemoryClientの時の型
export type SavedData = {
  _time: number;
  _from: string;
  _id: number;
  _payload: Object;
};

export type ResponseTuple = {
  _isMuched: boolean;
  _time: number | null;
  _from: string;
  _id: number | null;
  _payload: Object | null;
};

export type WatchResponseTuple = {
  _where: string;
  _time: number;
  _from: string;
  _payload: Tuple;
};

export type IsMuchResponse = {
  isMuched: boolean;
  res: Tuple | null;
};

export type LindaOperation = {
  tsName: string;
  payload: Tuple;
  from?: string;
};
export type LindaWatchOperation = {
  tsName: string;
  payload: Tuple;
  from: string;
};

export type LindaWriteOperation = {
  tsName: string;
  payload: Tuple;
  from: string;
};

export type LindaReadOperation = {
  tsName: string;
  payload: Tuple;
  from?: string;
};

export type InsertOperation = {
  payload: Tuple;
  from: string;
};

export interface WatchCallback {
  (resData: WatchResponseTuple): Promise<void>;
}

export interface WriteCallback {
  (resData: InsertData): void;
}

export interface ReadTakeCallback {
  (resData: ResponseTuple): void;
}

export interface ConnectCallback {
  (): void;
}

export interface Callback {
  (resData: ResponseTuple): void;
}
