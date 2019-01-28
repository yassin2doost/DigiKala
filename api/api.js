const
router = require('express').Router(),
 async = require('async'),
 faker = require('faker'),
 Category = require('../models/Category'),
 Product = require('../models/Product');



// router.post('/search', function(req, res, next) {
//   console.log(req.body.search_term);
//   Product.search({
//     query_string: { query: req.body.search_term }
//   }, function(err, results) {
//     if (err) return next(err);
//     res.json(results);
//   });
// });


router.get('/:name', (req, res, next) => {
    async.waterfall([
      cb => {
        Category.findOne({ name: req.params.name }, (err, category) => {
          if (err) return next(err);
          cb(null, category);
        });
      },

      (category, cb) => {
        for (var i = 0; i < 30; i++) {
          var product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = faker.image.image();

          product.save();
        }
      }
    ]);
    res.json({ message: 'با موفقیت اضافه شد' });
});

module.exports = router;
