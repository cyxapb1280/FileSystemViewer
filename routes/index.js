var express = require('express');
var router = express.Router();
var treeBuilder = require('../lib/treeBuilder');
var comments = require('../lib/comments');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'File System Viewer'});
});

router.get('/catalogue/:path', function (req, res, next) {
  var tree = treeBuilder.build(req.params.path, 1);
  
  comments.addToTree(tree, function (treeWithComments) {
    res.json(treeWithComments);
  });

});

router.post('/comment', function (req, res) {
  comments.save(req.body, function (comments) {
    res.sendStatus(200);
  });
});


module.exports = router;
