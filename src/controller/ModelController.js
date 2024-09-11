const { default: mongoose, ObjectId } = require('mongoose');
const Model = require('../models/ModelSchema');
const { BSON, EJSON } = require('bson')

async function getUserModels(req, res) {
    const username = req.body.username;

    try {
      // Find all models associated with the user
      const models = await Model.find({ creatorUsername: username });
  
      res.json(models);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCertainModel(req, res) {
    try {
        const model = await Model.findById(req.body.modelID);

        res.json(model.meshData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllModels(req, res) {
    try {
        const page = 1;
        const pageSize = 10;
        
        const skip = (page - 1) * pageSize;
        // Find all models associated with the user
        const startTime = performance.now();

        const models = await Model.find({})
        .skip(skip)
        .limit(Number(pageSize));

        const endTime = performance.now();

        const elapsedTime = endTime - startTime;

        console.log(`The database request took ${elapsedTime} milliseconds.`);
    
        res.json(models);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function saveModel(req, res) {

    const { modelTitle, meshData, creatorUsername } = req.body;

    const newModel = new Model({
        modelTitle: modelTitle,
        meshData: meshData,
        creatorUsername: creatorUsername,
        type: 'OBJ',
    });

    newModel.save((err, newModel) => {
        if (err) {
            console.log(err);
            res.status(400).send("Error registering new model, please try again.");
        }
        else {
            console.log("Model Saved");
            res.status(200).send("Model Saved!");
        }
      })
}

async function saveSTLModel(req, res) {

    const { modelTitle, meshData, creatorUsername } = req.body;

    const newModel = new Model({
        modelTitle: modelTitle,
        meshData: meshData,
        creatorUsername: creatorUsername,
        type: 'STL',
    });

    newModel.save((err, newModel) => {
        if (err) {
            console.log(err);
            res.status(400).send("Error registering new model, please try again.");
        }
        else {
            console.log("Model Saved");
            res.status(200).send("Model Saved!");
        }
      })
}

async function getUserSTLModels(req, res) {
    const { username } = req.body;

    try {
        const data = await Model.find({ creatorUsername: username, type: 'STL' });

        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUserOBJModels(req, res) {
    const { username } = req.body;

    try {
        const data = await Model.find({ creatorUsername: username, type: 'OBJ' });
        
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllSTLModels(req, res) {
    try {
        // const { page = 1, pageSize = 9 } = req.query;
        const page = 1;
        const pageSize = 9;
        
        const skip = (page - 1) * pageSize;
        
        const data = await Model.find({ type: 'STL' })
        .skip(skip)
        .limit(Number(pageSize));
        
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllOBJModels(req, res) {
    try {
        // const { page = 1, pageSize = 9 } = req.query;
        const page = 1;
        const pageSize = 9;
        
        const skip = (page - 1) * pageSize;    
        
        const data = await Model.find({ type: 'OBJ' })
        .skip(skip)
        .limit(Number(pageSize));
        
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getModelNamesForSearch(req, res) {
    const { keyword } = req.body;

    try{
        const regex = new RegExp(keyword, 'i');

        const modelNames = await Model.find({ modelTitle: { $regex: regex } }).select('modelTitle');
    
        res.send(modelNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getModelByNameAndID(req, res) {
    const { _id, modelTitle } = req.body.name;
    try{
        const modelNames = await Model.findById({ _id });
    
        res.send(modelNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { 
    getUserModels, getCertainModel, getAllModels, 
    saveModel, saveSTLModel, 
    getUserSTLModels, getUserOBJModels, 
    getAllSTLModels, getAllOBJModels,
    getModelNamesForSearch, getModelByNameAndID
};