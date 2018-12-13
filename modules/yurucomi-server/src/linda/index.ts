import tupleSpace from "./tupleSpace";
import _debug from "debug";
const debug = _debug("server:linda");

export default class Linda {
  tupleSpaces: { [key: string]: tupleSpace };

  constructor() {
    this.tupleSpaces = {};
  }

  tupleSpace(tupleSpaceName: string) {
    if (!this.tupleSpaces[tupleSpaceName]) {
      this.tupleSpaces[tupleSpaceName] = new tupleSpace(tupleSpaceName);
    }
    return this.tupleSpaces[tupleSpaceName];
  }
}
