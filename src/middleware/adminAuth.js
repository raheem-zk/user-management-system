const isLogin = async (req,res,next)=>{
    try {
        if (!req.session.admin_id){
            res.redirect('/admin/adminLogin');
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

const isLogout = async (req,res,next) =>{
    try {
        if (req.session.admin_id){
            res.redirect('/admin');
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    isLogin,
    isLogout
}