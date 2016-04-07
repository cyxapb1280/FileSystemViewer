/**
 * Created by Ruslan on 07-Apr-16.
 */
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/FileSystem');
mongoose.set('debug', true);

module.exports = mongoose;