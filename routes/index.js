var express = require('express');
var router = express.Router();
var treeBuilder = require('../lib/treeBuilder');
var database = require('../lib/database');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'File System Viewer'});
});

router.get('/catalogue/', function (req, res, next) {
  var tree = treeBuilder.build('.');
  console.log(tree);
  res.json(tree);
});


router.get('/comments/:filePath', function (req, res, next) {
  database.findCommentsByPath(req.params.filePath, function (comments) {
    res.json(comments);
  });
});

router.post('/comment', function (req, res) {
  database.saveComment(req.body, function () {
    res.sendStatus(200);
  });
});


module.exports = router;
