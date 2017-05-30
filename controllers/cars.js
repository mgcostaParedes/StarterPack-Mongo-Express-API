const Car = require('../models/car');
const User = require('../models/user');

module.exports = {
    index: async (req, res, next) => {
        //get all the cars
        const cars = await Car.find({});
        res.status(200).json(cars);
    },
    newCar: async (req, res, next) => {
        const seller = await User.findById(req.value.body.seller);
        //create the car
        const newCar = req.value.body;
        delete newCar.seller;

        const car = new Car(newCar);
        car.seller = seller;
        await car.save();

        //link car to the seller
        seller.cars.push(car);
        await seller.save();

        res.status(200).json(car);

    }
}