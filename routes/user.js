const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET sign up */
router.get('/signup', userController.sign_up_get);

/* POST sign up */
router.post('/signup', userController.sign_up_post);

/* GET log in */
router.get('/login', userController.log_in_get);

/* POST log in */
router.post('/login', userController.log_in_post);

/* GET become member */
router.get('/become-member', userController.become_member_get);

/* POST become member */
router.post('/become-member', userController.become_member_post);

/* GET become admin */
router.get('/become-admin', userController.become_admin_get);

/* POST become admin */
router.post('/become-admin', userController.become_admin_post);

module.exports = router;
