const user = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash
  } catch (error) {
    console.log(error);
  }
}

const adminLoginPage = async (req, res) => {
  try {
    let Message = '';
    res.render('admin/login', { Message });
  } catch (error) {
    console.log(error.massage);
  }
}

const VerifyAdmin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.render('admin/login', { Message: 'fill all fields' });
    } else {
      const adminEmail = req.body.email;
      const adminPassword = req.body.password;
      const adminData = await user.findOne({ email: adminEmail, admin: 1 });

      if (adminData) {
        const passwordMatch = await bcrypt.compare(
          adminPassword,
          adminData.password
        );

        if (passwordMatch) {
          req.session.admin_id = adminData._id;
          res.redirect('/admin/');
        } else {
          res.render('admin/login', { Message: 'wrong password' });
        }
      } else {
        // console.log(adminData);
        res.render('admin/login', { Message: 'wrong details' });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const adminHomePage = async (req, res) => {
  try {
    const userData = await user.findOne({ admin: 1 });
    // console.log(userData);
    res.render('admin/home', { userData });
  } catch (error) {
    console.log(error);
  }
}

const logout = async (req, res) => {
  try {
    req.session.admin_id = null;
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
}

const newUser = async (req, res) => {
  try {
    res.render('admin/add-newUser', { Message: '' });
  } catch (error) {
    console.log(error);
  }
}

const VerfyNewUser = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      res.render('admin/add-newUser', { Message: 'somthing is missing' });
    } else {
      let email = req.body.email;
      let userData = await user.findOne({ email: req.body.email });
      if (userData) {
        res.render('admin/add-newUser', { Message: 'email is already existed' });
      } else {
        let passwordHash = await securePassword(req.body.password);
        const newData = {
          name: req.body.name,
          email: req.body.email,
          password: passwordHash
        }
        let result = await user.insertMany([newData]);
        if (result) {
          console.log(result);
          return res.render('admin/add-newUser', { Message: 'user Created' });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const dashboard = async (req, res) => {
  try {
    let search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 2;

    const userData = await user.find({
      admin: { $ne: 1 },
      $or: [
        { name: { $regex: `.*${search}.*`, $options: 'i' } },
        { email: { $regex: `.*${search}.*`, $options: 'i' } }
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await user.find({
      admin: { $ne: 1 },
      $or: [
        { name: { $regex: `.*${search}.*`, $options: 'i' } },
        { email: { $regex: `.*${search}.*`, $options: 'i' } }
      ]
    }).countDocuments()

    res.render('admin/dashboard', {
        data: userData, 
        totalPages: Math.ceil(count / limit),
        curentPage: page
      });
  } catch (error) {
    console.log(error);
  }
}

const editUser = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    let objId = id;
    const userData = await user.findOne({ email: objId });
    if (userData) {
      let message = {
        message: '',
        userId: id,
      };
      res.render('admin/edit-user', { message });
    } else {
      res.redirect('/admin/dashboard');
    }
  } catch (error) {
    console.log(error);
  }
};


const updateUser = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      let message = { Message: 'something is missing' };
      return res.render('admin/edit-user', { message });
    }
    const emailVerfy = await user.findOne({ email: req.body.email });
    if (emailVerfy) {
      let message = { Message: 'email is already existed!' };
      return res.render('admin/edit-user', { message });
    }
    const result = await user.updateOne({ email: req.body.oldEmail }, { $set: { name: req.body.name, email: req.body.email } });
    // console.log(result);
    if (result) {
      let message = { Message: 'successfully updated' };
      return res.render('admin/edit-user', { message });
    }
    res.send('something went wrong   qqq');
  } catch (error) {
    console.log(error.message);
    res.send('something went wrong');
  }
}

const deleteUser = async (req, res) => {
  try {
    let userEmail = req.query.id;
    console.log(userEmail);
    let result = await user.deleteOne({ email: userEmail });
    if (result) {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin/dashboard');
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  adminLoginPage,
  VerifyAdmin,
  adminHomePage,
  logout,
  newUser,
  VerfyNewUser,
  dashboard,
  editUser,
  updateUser,
  deleteUser
}