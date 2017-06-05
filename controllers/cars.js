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

    },
    getCar: async (req, res, next) => {
        const car = await Car.findById(req.value.params.carId);
        res.status(200).json(car);
    },
    replaceCar: async(req, res, next) => {
        const { carId } = req.value.params;
        const newCar = req.value.body;
        const result = await Car.findByIdAndUpdate(carId, newCar);
        res.status(200).json({ success: true});
    },
    updateCar: async (req, res, next) => {
        const { carId } = req.value.params;
        const newCar = req.value.body;
        const result = await Car.findByIdAndUpdate(carId, newCar);
        res.status(200).json({ success: true});
    },
    deleteCar: async(req, res, next) => {
        const { carId } = req.value.params;
        const car = await Car.findById(carId);
        if(!car) {
            return res.status(404).json({ error: 'Car does not exist'});
        }
        //get seller from the car
        const sellerId = car.seller;
        const seller = await User.findById(sellerId);
        //remove car
        await car.remove();
        //remove car from the seller
        seller.cars.pull(car);
        await seller.save();

        res.status(200).json({ success: true});
    }
}