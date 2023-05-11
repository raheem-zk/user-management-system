const express = require('express');
const adminRouter = express();
const adminControler = require('../controlles/adminController');

const auth = require('../middleware/adminAuth');

adminRouter.get('/',auth.isLogin,adminControler.adminHomePage);
adminRouter.get('/adminLogin',auth.isLogout,adminControler.adminLoginPage);
adminRouter.post('/adminLogin',adminControler.VerifyAdmin);
adminRouter.get('/logout',auth.isLogin,adminControler.logout);
adminRouter.get('/new-user',auth.isLogin,adminControler.newUser);
adminRouter.post('/new-user',adminControler.VerfyNewUser);
adminRouter.get('/dashboard',auth.isLogin,adminControler.dashboard);
adminRouter.get('/dashboard/edit-user',auth.isLogin,adminControler.editUser);
adminRouter.post('/dashboard/edit-user',adminControler.updateUser);
adminRouter.get('/dashboard/delete-user',auth.isLogin,adminControler.deleteUser);

module.exports = adminRouter;