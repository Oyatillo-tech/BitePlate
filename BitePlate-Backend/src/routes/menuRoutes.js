const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getAllMenu);
router.get('/type/:type', menuController.getMenuByType);
router.get('/:id', menuController.getMenuItem);
router.post('/', menuController.createMenuItem);

module.exports = router;