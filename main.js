var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;
let address="mongodb://localhost:27017";
let dbName='test'

MongoClient.connect(address, function(err, database) {
    if(err) throw err;
    console.log('Connected to: ', address);
    db = database.db(dbName);
    let collection = db.collection('cartelliniTris');
    
    let collectionName='cartelliniTris';
    let query1 = { $match: { numLinea : '3354323423', "date": {$gte: '20181001', $lte: '20181103'} }};
    let query2 = { $match: {"cdrList.macroFamiglia" : "DATI", "cdrList.dataChiamata": { $gte: "20181001000000", $lt: "20181031999999"}}};
    let query3 = [
        {$match :{"numLinea":"3354323423", "data":{$gte: "20180101", $lte: "20181231"}}},
        { $unwind: "$cdrList" },
        {$match: {"cdrList.macroFamiglia" : "DATI", "cdrList.dataChiamata": { $gte: "20180101000000", $lt: "20181231999999"}}},
        {$count: "risultatiTrovati"}
    ];
    
    Promise.all([
        queryPromise(collectionName, query1),
        queryPromise(collectionName, query2),
        queryPromise(collectionName, query3),
    ]).then(function(result) {
        console.log('QUERIES completed, results:', result)
    }).catch(function(err) {
        console.log(err);
    });

    function queryPromise(collection, query) {
        return new Promise(function(resolve, reject) {
            // it was find(query) originally -> changed it to aggregate
            db.collection(collection).aggregate(query).toArray(function(err, resp) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        })
    }

});