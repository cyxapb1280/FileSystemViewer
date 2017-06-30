/**
 * Created by Ruslan on 14-Apr-16.
 */
var database = require('./database');

exports.save = function (comment, callback) {
  database.saveComment(comment, function () {
    callback();
  });
};

exports.addToTree = function (tree, callback) {
  database.findAll(function (comments) {
    tree.children = tree.children.map(function (file) {
      var fileComments = comments.filter(function (comment) {
        return comment.filePath === file.path;
      });

      file.comments = fileComments;
      return file;
    });

    callback(tree);
  });
};