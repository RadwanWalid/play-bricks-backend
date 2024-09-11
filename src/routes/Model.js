const router = require('express').Router();
const connection = require('../config/database');
const { isAuth } = require('./AuthMiddleware');
const ModelsTable = require('../models/ModelSchema');

const { 
  getUserModels, getCertainModel, 
  getAllModels, saveModel, saveSTLModel, 
  getUserSTLModels, getUserOBJModels, 
  getAllSTLModels, getAllOBJModels, 
  getModelNamesForSearch, getModelByNameAndID
} = require('../controller/ModelController');

router.get("/", (req, res) => {
  res.send("Hello Models");
})

router.put('/getUserModels', getUserModels);
router.put('/getCertainModel', getCertainModel);
router.get('/getAllModels', getAllModels);

router.post('/saveModel', saveModel);
router.post('/saveSTLModel', saveSTLModel);

router.put('/getUserSTLModels', getUserSTLModels);
router.put('/getUserOBJModels', getUserOBJModels);

router.get('/getAllSTLModels', getAllSTLModels);
router.get('/getAllOBJModels', getAllOBJModels);

router.put('/getModelNamesForSearch', getModelNamesForSearch);
router.put('/getModelByNameAndID', getModelByNameAndID);

module.exports = router;