const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Application')
  .then(() => {
    console.log('db connection success');
  })
  .catch((err) => {
    console.log('db connection error');
  });
// ......................

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
const views = path.join(__dirname, 'views/users');

app.set('view engine', 'ejs');
app.set('views', views);

app.use((req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

const router = require('./routers/userRoute');

const adminPath = path.join(__dirname, 'views/admin');
app.set('views', adminPath);
const adminRouter = require('./routers/adminRoute');

const session = require('express-session');
const config = require('./config/config');



app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

// Clear cache headers
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
  next();
});



app.use('/admin', adminRouter);
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res ,next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  let errorPath = path.join(__dirname,'/views/users/error');
  res.render(errorPath);
  // console.log(error);
});


app.listen(3000, () => console.log('server running 3000 .....'));

