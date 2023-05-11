const express = require('express');
const router = express();

const userControler = require('../controlles/userController');
const auth = require('../middleware/auth');

router.get('/signup', auth.isLogout, userControler.signUpPage);  // if session olredy exsist then going to the home page
router.post('/signup', userControler.userInsert);

router.get('/login', auth.isLogout, userControler.loginPage);
router.post('/login', userControler.verfyLogin);
router.get('/',auth.isLogin, userControler.homePage);
router.get('/logout', auth.isLogin, userControler.userLogout);

// router.get('*',userControler.wrongPage);

module.exports = router;