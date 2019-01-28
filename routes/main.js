const 
    router = require('express').Router(),
    Product = require('../models/Product'),
    Cart = require('../models/Cart');
    let stream = Product.synchronize(),
    count = 0;

    // Mapping Elastic Search

    Product.createMapping((err, mapping) => {
        if (err) {
          console.log("error creating mapping");
        } else {
          console.log('mapping error :' + err);
          console.log("Mapping created");
          console.log(mapping);
        }
      });
      
      
      
      stream.on('data', () => {
        count++;
      });
      
      stream.on('close', () => {
        console.log("Indexed " + count + " documents");
      });
      
      stream.on('error', (err) => {
        console.log(err);
      });
    // End of creation

    // Search Route
    router.post('/search', (req, res, next) => {
      res.redirect('/search?query=' + req.body.query);
    });

    router.get('/search', (req, res, next) => {
      if(req.query.query) {
        Product.search({
          query_string: { query: req.query.query}
        }, (err, results) => {
          if(err) return next(err);
          let data = results.hits.hits.map( hit => {
            return hit;
          });
          res.render('main/search-result', {
            query: req.query.query,
            data
          });
        });
      }
    });

    // End of Search route

router.get('/', (req, res, next) => {
    res.render('main/home');
});
router.get('/about', (req, res, next) => {
    res.render('main/about');
});

    //   Category Routes :)
router.get('/products/:id', (req, res, next) => {
        Product
          .find({ category: req.params.id })
          .populate('category')
          .exec((err, products) => {
            if (err) return next(err);
            res.render('main/category', {
              products
            });
          });
      });
      
      // Specefic Page for each product
router.get('/product/:id', (req, res, next) => {
        Product.findById({ _id: req.params.id }, (err, product) => {
          if (err) return next(err);
          res.render('main/product', {
            product
          });
        });
      });
      // End of product Routes

      // Push to the Cart every product add to the cart section
  router.post('/product/:product_id', (req, res, next) => {
    Cart.findOne({ owner: req.user._id }, (err, cart) => {
      if(err) return next(err);
      cart.items.push({
        item: req.body.product_id,
        price: parseFloat(req.body.priceValue),
        quantity: parseInt(req.body.quantity)
      });
      cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
      cart.save((err) => {
        if(err) return next(err);
        return res.redirect('/cart');
      });
    });
  });
     // End of pushing :)

     // Cart Routes
router.get('/cart', (req, res, next) => {
  if(!req.user) {
    return res.redirect('/login');
  } else {
    Cart 
    .findOne({ owner: req.user._id })
    .populate('items.item')
    .exec((err, foundCart)=> {
      if(err) return next(err);
      res.render('main/cart', {
        cart: foundCart,
        message: req.flash('remove')
      });
    });   
  }
});

router.post('/remove', (req, res, next) => {
  if(!req.user) return res.redirect('/login');
  Cart.findOne({ owner: req.user._id}, (err,foundcart) => {
    foundcart.items.pull(String(req.body.item));
    foundCart.total = (foundcart.total - parseFloat(req.body.price)).toFixed(2);
    foundcart.save((err, found) => {
      if(err) return next(err);
      req.flash('remove', 'با موفقیت حذف شد');
      res.redirect('/cart');
    });
  });
});
   // End of Cart :)

module.exports = router;



