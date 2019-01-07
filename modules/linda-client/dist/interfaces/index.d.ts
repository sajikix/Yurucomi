import { ObjectId } from "bson";
export interface ConnectCallback {
    (): void;
}
export interface Callback {
    (resData: ResponseTuple): void;
}
export declare type ResponseTuple = {
    _isMuched: boolean;
    _time: number;
    _from: string;
    _id: ObjectId;
    _payload: Object;
};
export declare type LindaOperation = {
    _payload: Tuple;
    _where: string;
    _type: "read" | "write" | "watch" | "take";
    _from?: string;
};
export declare type LindaResponse = {
    _payload: Tuple;
    _where: string;
    _time: number;
    _id?: number | any;
    _isMuched?: boolean;
    _from?: string;
};
export interface LindaCallback {
    (res: LindaResponse): void;
}
export declare type MemoryDB = {
    [tsName: string]: Array<TupleInfo>;
};
export declare type TupleInfo = {
    _payload: Tuple;
    _where: string;
    _from?: string;
    _time: number;
    _id: number | any;
};
export declare type Tuple = {
    [key: string]: number | string | boolean | Object;
};
