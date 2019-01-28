const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, trim: true, unique: true, lowercase: true, index: true},

}, {timestamps: true});

module.exports = mongoose.model('Category', CategorySchema);