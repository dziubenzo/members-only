const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

// GET new message
router.get('/new-message', messageController.new_message_get);

// POST new message
router.post('/new-message', messageController.new_message_post);

// POST delete message
router.post('/delete-message/:id', messageController.delete_message);

module.exports = router;
