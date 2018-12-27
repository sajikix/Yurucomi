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
    console.log(this.tupleSpaces);
    return this.tupleSpaces[tupleSpaceName];
  }
}

const linda = new Linda();

export { linda };
