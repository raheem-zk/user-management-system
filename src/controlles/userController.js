const user = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.massegee);
    }
}

let massegee;
const userInsert = async (req, res) => {
    try {
        const sPassword = await securePassword(req.body.password)
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: sPassword
        }
        if (!data.name || !data.email || !data.password) {
            // res.send('Please fill in all required fields.')
            massegee = 2;
            res.render('users/signup', { massegee });
        } else {
            let result = await user.insertMany([data]);
            if (result) {
                console.log(result);
                massegee = 1;
                res.render('users/signup', { massegee });
                massegee = null;
            }
        }
    } catch (error) {
        massegee = 0;
        res.render('users/signup', { massegee });
        massegee = null;
    }
}

const signUpPage = async (req, res) => {
    try {
        massegee = null;
        res.render('users/signup', { massegee })
    } catch (error) {
        console.log(error.message);
    }
}

const loginPage = (req, res) => {
    try {
        let massege = '';
        res.render('users/login', { massege });
    } catch (error) {
        console.log(error.message);
    }
}

const verfyLogin = async (req, res) => {
    try {
        if (!req.body.email && !req.body.password) {
            res.render('users/login', { massege: 'please fill the feild' });
        } else {
            let email = req.body.email;
            let password = req.body.password;
            let userData = await user.findOne({ email: email });
            console.log(userData);
            if (!userData) {
                res.render('users/login', { massege: 'cannot find user' })
            } else {
                let passwordMatch = await bcrypt.compare(password, userData.password);
                if (!passwordMatch) {
                    res.render('users/login', { massege: 'password is not correct' })
                } else {
                    // req.session.user_id[0] = userData._id;
                    req.session.user_id = userData._id;
                    res.redirect('/');
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.render('users/login', { massegee: 'please  fill the feild' });
    }
}

const homePage = async (req, res) => {
    try {
        let userId =req.session.user_id;
        let userInfo = await user.findOne({_id:userId});
        res.render('users/home',{massege:userInfo});
    } catch (error) {
        console.log(error);
    }
}

const userLogout = async (req,res)=>{
    try {
        req.session.user_id = null;
        res.redirect('/');
    } catch (error) {
        console.log(error.massegee);
    }
}



module.exports = { userInsert, signUpPage, loginPage, verfyLogin, homePage , userLogout };