import { MongoClient, Db, Collection } from "mongodb";
import _debug from "debug";

const debug = _debug("server:mongo");
const url: string = process.env.MONGODB_URI || "mongodb://localhost/linda";
let db: Db;

MongoClient.connect(
  url,
  (err, client) => {
    if (err) {
      console.log(err);
    }
    debug(`connected to DB(${url})`);
    db = client.db();
  }
);

const collection = function(collectionName: string): Collection {
  return db.collection(collectionName);
};

export default collection;
