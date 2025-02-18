//on 24th video

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});        //Essentially a user created the Product
User.hasMany(Product);      //Better to define both direction for better deployment
//User to Product have One to Many relation

User.hasOne(Cart);
Cart.belongsTo(User);       //Cart-User has One to One Relation

Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});    //Cart-Product have Many to Many relation

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem} );


sequelize
    //.sync( {force:true} )     //will forcibly drop all the table then recreate them with association as stated
    .sync() 
    .then(result => {           //Used to check if there is any user or not, if no user will create a dummy user, only for development will be removed in production
    //console.log(result);
        return User.findByPk(1)     //findById does not seem to work or is discontinued, hence from now on use findByPk
    })
    .then(user => {
        if(!user)   {
            return User.create({name: 'Ayush', email: 'testuser@gmail.com'})
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

// currently on video 18. in Understanding Sequelize
