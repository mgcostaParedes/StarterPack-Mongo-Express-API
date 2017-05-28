const User = require('../models/user');
const Car = require('../models/car');

module.exports = {
    index: async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json(users);
    },
    newUser: async (req, res, next) => {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(201).json(user);
    },
    getUser: async (req, res, next) => {
        //const userId = req.params.userId;
        const { userId } = req.value.params;
        const user = await User.findById(userId);
        rest.status(200).json(user);
    },
    replaceUser: async (req, res, next) => {
        //enforce that req.body must contain all the fields
        const { userId } = req.params;
        const newUser = req.body;

        const result = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({ success: true});
    },
    updateUser: async (req, res, next) => {
        //enforce that req.body can contain any number of field
        const { userId } = req.params;
        const newUser = req.body;

        const result = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({ success: true});
    },
    getUsersCars: async (req, res, next) => {
        const { userId } = req.params;
        const user = await User.findById(userId)-populate('cars');
        res.status(200).json(user.cars);
    },
    newUserCar: async (req, res, next) => {
        const { userId } = req.params;
        //create new car
        const newCar = new Car(req.body);
        //get user
        const user = await User.findById(userId);
        //assign user as a car seller
        newCar.seller = user;
        //save the car
        await newCar.save();
        //add car to the users selling array
        user.cars.push(newCar);
        //save the user
        await user.save();
        //response
        res.status(201).json(newCar);
    }

};

/*

We can intereact with mongoose in a 3 different ways:
1) Callbacks
2) Promises
3) |X| Async/Await

*/