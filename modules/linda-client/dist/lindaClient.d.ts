/// <reference types="socket.io-client" />
import { Tuple, ConnectCallback, LindaCallback } from "./interfaces/index";
export default class LindaClient {
    socket: SocketIOClient.Socket;
    tupleSpaceName: string;
    constructor();
    connect(url: string, tsName: string): Promise<void>;
    read(tuple: Tuple): Promise<void>;
    write(tuple: Tuple): Promise<void>;
    take(tuple: Tuple): Promise<void>;
    watch(tuple: Tuple, callback: LindaCallback): void;
    onDisconnected(callback: ConnectCallback): void;
}
