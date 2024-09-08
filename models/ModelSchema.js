const mongoose = require('mongoose');
const connection = require('../config/database');

const ModelSchema = new mongoose.Schema({
  modelTitle: {
    type: String,
  },
  meshData: {
    type: String,
  },
  creatorUsername: {
    type: String,
  },
  type: String,
  enum: ['STL', 'OBJ'],
});

const Model = connection.model('Model', ModelSchema);

module.exports = Model;