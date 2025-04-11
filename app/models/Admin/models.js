const Ads = require('./Ads');
const Classess = require('./Classess');
const Content = require('./Content');
const Membership = require('./Membership');
const Notification = require('./Notification');
const Order = require('./Order');
const Packages = require('./Packages');
const Review = require('./Review');
const RolesPermissions = require('./RolesPermissions');
const Trainer = require('./Trainer');
const User = require('./User');

const UserModel = {
    Ads,
    Classess,
    Content,
    Membership,
    Notification,
    Order,
    Packages,
    Review,
    RolesPermissions,
    Trainer,
    User
};

module.exports = UserModel;