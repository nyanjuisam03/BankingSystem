const express = require('express');
const router = express.Router();

const cardController=require("../controllers/card.controller")

router.post('/card-creation', cardController.createCard)
router.get('/get-user-card/:userId' ,cardController.getUserCards)

module.exports = router;