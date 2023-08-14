const MongoClient = require("mongodb").MongoClient;
const { atlas, appdb } = require('./config');
const request = require("request");
let db;

const loadDB = async () => {
if (db) {
console.log("using established connection");
return db;
}
try {
console.log("establishing new connection to Atlas");
const client = await MongoClient.connect(atlas,
{ useNewUrlParser: true, useUnifiedTopology: true }
);
db = client.db(appdb);
} catch (err) {
console.log(err);
}
return db;
};
const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);
const deleteAll = (db, coll) => db.collection(coll).deleteMany({});
const findOne = (db, coll, criteria) => db.collection(coll).findOne(criteria);
const findAll = (db, coll, criteria, projection) =>
db
.collection(coll)
.find(criteria)
.project(projection)
.toArray();

const getJSONFromWWWPromise = src_url => {
    return new Promise((resolve, reject) => {
      request(
        {
          url: src_url,
          json: true
        },
        (error, response, body) => {
          if (error) {
            reject("unable to connect to GitHub servers");
          } else if (response.statusCode === 200) {
            resolve(body);
          }
        }
      );
    });
};

const updateOne = (db, coll, criteria, projection) =>
db.collection(coll).findOneAndUpdate(criteria, { $set: projection}, {rawResult: true} );
const deleteOne = (db, coll, criteria) => db.collection(coll).deleteOne(criteria);

module.exports = { loadDB,addOne, deleteAll, findOne, findAll, getJSONFromWWWPromise, updateOne, deleteOne };
