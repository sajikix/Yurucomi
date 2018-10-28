import { EventEmitter2 } from "eventemitter2";

const emitter = new EventEmitter2({
  wildcard: true,
  delimiter: "::",
  newListener: false,
  maxListeners: 20,
  verboseMemoryLeak: false,
});

export default emitter;
