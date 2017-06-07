const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    cars: [{
        type: Schema.Types.ObjectId,
        ref: 'car'
    }]
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

const User = mongoose.model('user', userSchema);
module.exports = User;