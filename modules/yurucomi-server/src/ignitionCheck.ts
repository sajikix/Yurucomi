import _collection from "./mongodb";
import { Tuple } from "yurucomi-interfaces";
import writeTuples from "./writeTuples";
import _debug from "debug";
import emitter from "./eventEmitter";

const debug = _debug("server:ignitionCheck");

// FIXME:any
const ignitionCheck = async (tupleSpaceName: string, tuple: Tuple) => {
  const collection = _collection(tupleSpaceName);
  const originalTuple = Object.assign({}, tuple);
  delete tuple._from;
  const searchQuery = Object.entries(tuple).map(([key, value]) => ({
    [key]: value,
  }));
  const searchedResult = await collection.find({
    $and: [
      { $or: searchQuery },
      {
        _from: { $nin: [originalTuple._from, "event"] },
      },
    ],
  });
  let additionalTupleArray: Array<Tuple> = [];
  let persons: Array<string> = [];
  if (searchedResult !== null) {
    let personData: Array<string> = [];
    await searchedResult.forEach((doc: Tuple) => {
      personData.push(doc._from);
    });
    persons = [...new Set(personData)];
    if (persons.length > 0) {
      additionalTupleArray.push({
        _from: "event",
        _to: originalTuple._from,
        _time: Date.now(),
        _with: [originalTuple._from, ...persons],
        _which: originalTuple,
      });
      await emitter.emit("event", {
        tupleSpace: tupleSpaceName,
        to: [originalTuple._from, ...persons],
        tuple: originalTuple,
      });
    }
    for (const person of persons) {
      additionalTupleArray.push({
        _from: "event",
        _to: person,
        _time: Date.now(),
        _with: [originalTuple._from, ...persons],
        _which: originalTuple,
      });
    }
  }
  await writeTuples(tupleSpaceName, [originalTuple, ...additionalTupleArray]);
  persons.length > 0
    ? debug(`This tuple matched with ${[...persons]}`)
    : debug("No tuple matched with this Tuple");
};

export default ignitionCheck;
