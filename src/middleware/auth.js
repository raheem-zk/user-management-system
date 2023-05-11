const isLogin = async ( req, res, next)=>{
    try {
        if (!req.session.user_id){
            res.redirect('/login');  // loginpage
        }
        next();
    } catch (error) {
        console.log(error.masseage);
    }
}

const isLogout = async ( req, res, next)=>{
    try {
        if (req.session.user_id){
            res.redirect('/');  // home page
        }
        next();
    } catch (error) {
        console.log(error.masseage);
    }
}

module.exports = {
    isLogin,
    isLogout
}