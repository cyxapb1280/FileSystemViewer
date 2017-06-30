/**
 * Created by Ruslan on 06-Apr-16.
 */
var fs = require('fs'),
  path = require('path');

module.exports.build = function dirTree(filename, depth, currDepth) {
  currDepth = currDepth || 0;

  var stats = fs.lstatSync(filename),
    info = {
      path: filename,
      name: path.basename(filename)
    };

  if (stats.isDirectory()) {
    info.type = "folder";

    if (currDepth === depth) {
      info.children = fs.readdirSync(filename).length;
    } else {
      info.children = fs.readdirSync(filename).map(function (child) {
        return dirTree(filename + '/' + child, depth, currDepth + 1);
      });
    }
  } else {
    // Assuming it's a file. In real life it could be a symlink or
    // something else!
    info.type = "file";
  }

  return info;
};