import _collection from "./mongodb";
import { Tuple } from "yurucomi-interfaces";
import writeTuples from "./writeTuples";
import _debug from "debug";
import { json } from "express";

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
  searchedResult.count().then(mes => {
    debug(`searchResult:${mes}`);
  });

  let additionalTupleArray: Array<Tuple> = [];
  let persons: Array<string> = [];
  if (searchedResult !== null) {
    let personData: Array<string> = [];
    await searchedResult.forEach((doc: Tuple) => {
      personData.push(doc._from);
    });
    persons = [...new Set(personData)];
    debug(`${persons.length} persons matched`);
    if (persons.length > 0) {
      additionalTupleArray.push({
        _from: "event",
        _to: originalTuple._from,
        _time: Date.now(),
        _with: [originalTuple._from, ...persons],
        _which: originalTuple,
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
  debug(
    `new tuple:${JSON.stringify([originalTuple, ...additionalTupleArray])}`
  );
};

export default ignitionCheck;
