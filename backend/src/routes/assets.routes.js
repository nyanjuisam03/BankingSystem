const express = require('express');
const router = express.Router();
const assetController=require("../controllers/assets.controller")

router.get('/all-assets', assetController.getAssets)
router.get('/all-consuambles', assetController.getConsumables)
router.get('/consumable/:id',assetController.getConsumableDetails)
router.get('/assets/:id',assetController.getAssetDetails)
router.post('/add-assets',assetController.addAsset)
router.post('/add-consumable',assetController.addConsumable)

module.exports =router