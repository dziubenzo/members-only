const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

// GET create message
router.get('/new-message', messageController.create_message_get);

// POST create message
router.post('/new-message', messageController.create_message_post);

module.exports = router;
