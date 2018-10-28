import _collection from "./mongodb";
import { Tuple } from "yurucomi-interfaces";
import _debug from "debug";

const debug = _debug("server:writeTuple");

const writeTuples = async (
  tupleSpaceName: string,
  tupleArray: Array<Tuple>
) => {
  const collection = _collection(tupleSpaceName);
  await collection.insertMany(tupleArray, mes => {
    debug(`inserted:${JSON.stringify(tupleArray)}`);
  });
};

export default writeTuples;
