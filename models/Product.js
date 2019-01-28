const
    mongoose = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: {type: Schema.Types.ObjectId, ref : 'Category'},
    name:{type: String ,lowercase: true, index: true, required: true},
    price: Number,
    image: { type: String, },
}, {timestamps: true});

ProductSchema.plugin(mongoosastic, {
    hosts:[
        'localhost:9200'
    ]
});

module.exports = mongoose.model('Product', ProductSchema);