const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { PORT} = require('./utils/constants')

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoute = require('./routes/productRoute');
const categoryRoute = require('./routes/categoryRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const orderRoute = require('./routes/orderRoute');
const notificationRoute = require('./routes/notificationRoute');
const subscriptionPlanRoute = require('./routes/subscriptionPlanRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const wholeSellerRoutes = require('./routes/wholeSellerRoutes');



const db = require('./config/database');
const path = require('path');


const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/product'); // Upload files to the 'uploads' directory
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });


db.connectDB();

dotenv.config();
const app = express();

app.use(express.json());
app.use(upload.any());


app.use(cors());


app.use('/images/product', express.static(path.join(__dirname, 'public/images/product')));


// Use the authentication routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productRoute);
app.use('/categories', categoryRoute);
app.use('/favorite',favoriteRoute);
app.use('/orders',orderRoute);
app.use('/notification',notificationRoute);
app.use('/subscription-plan',subscriptionPlanRoute);
app.use('/subscription', subscriptionRoute)
app.use('/whole-seller', wholeSellerRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
