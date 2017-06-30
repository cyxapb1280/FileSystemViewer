/**
 * Created by Ruslan on 07-Apr-16.
 */
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var counter = 0,
  database = null,
  commentCollection = null,
  url = 'mongodb://127.0.0.1:27017/FileSystem';

module.exports = Database;

MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);

  database = db;
  commentCollection = database.collection('comments');

  console.log("DATABASE connected correctly to MongoDB server.");
});

function Database() {
  console.warn('DATABASE Closing connection');
  database.close();
}

Database.saveComment = function (comment, callback) {
  if (!isCommentValid(comment)) {
    console.warn(counter, 'Not valid comment', comment);
  } else {
    console.info(counter, 'TODO: saving comment to mongo', comment);
    saveComment(comment);
    callback();
  }
};

Database.findCommentsByPath = function(path, callback) {
  commentCollection.find().filter({filePath: path}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

Database.findAll = function (callback) {
  commentCollection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

function saveComment(data) {
  commentCollection.insertOne(data, function (err, result) {
    assert.equal(err, null);
  });
}

function isCommentValid(data) {
  return data.filePath && data.comment;
}