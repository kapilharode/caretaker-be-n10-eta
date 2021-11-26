require('dotenv').config()

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var admin = require("firebase-admin");
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'n10eta', 
    api_key: '153456775719431', 
    api_secret: 'YM_yp58wr59ojC76EL4uLn3omtA',
    secure: true
  });

var models = require('../models/models')



exports.addReqDisease = async function (req, res){
    if (req.body.reqDisease){
        MongoClient.connect(process.env.MONGO_URL,async function (err, db){
            if (!err) {
                console.log('Connected to DB',err);
            }
            var _db = db.db('care_tracker')
            var searchNumber =await _db.collection("disease").findOne({'disease' :req.body.reqDisease}, async function(err, result) {
            if (err) throw err;
            console.log(result);
            if(result){ 
                var response = {'status': false, message : "Disease Arealdy Exists"}
                res.json(response);
            }else{
                await _db.collection('reqDisease').insertOne({
                    reqDisease :req.body.reqDisease,
                    userName : req.body.userName
                })
                var response = {'status': true, message : "Add Disease successfully"}
                res.json(response);
             }
             })
            
        })
        
    }else{                   
        var response = {
            status : false,
            message : "Invalid data"
        }
        res.json(response);
    }

}

exports.getReqDisease= async function (req, res){
    MongoClient.connect(process.env.MONGO_URL, async function(err, db) {
       if (err) throw err;                
       var dbData = db.db('care_tracker')
       const insert = await dbData.collection("reqDisease").find({})
           .toArray(function (err, result) {
               if (err) throw err;
               var resp = {
                   status : true, 
                   data : result
               }
               res.status(200);
               res.json(resp);
               // res.json(result);
           });
      
   });
}

