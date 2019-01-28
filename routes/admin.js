const
    router =require('express').Router(),
    User = require('../models/User'),
    Category = require('../models/Category'),
    Product = require('../models/Product');


    // Add Category Route 
router.get('/add-category', (req, res, next) => {
    res.render('admin/add-category', {
        message: req.flash('success')
    });
});

router.post('/add-category', (req, res, next) => {
    let category = new Category();
    category.name = req.body.name;

    category.save(err => {  
        if(err) return next(err);
        req.flash('success', 'دسته جدید با موفقیت اضافه شد');
        return  res.redirect('/add-category');
    });
});
    // End of Add Category Routes :)


    // Start of Edit Category Routes :)
router.get('/edit-category', (req, res, next) => {
  res.render('admin/edit-category', {
  message: req.flash('success')
    });
});

router.post('/edit-category', (req, res, next) => {
  category.findOne({ _id: req.category._id}, (err, category) => {
  if(err) return next(err);

  if(req.body.name) category.name = req.body.name;
  
  category.save( err => {
      if(err) return next(err);
      req.flash('sucess', ' تغیرات با موفقیت ذخیره شد');
      res.redirect('/add-category');  
        });
    });
});
    // End of Edit Category Routes :)

    // Ading Product Routes
router.get('/add-product', (req, res, next) => {
    res.render('admin/add-product', {
        message: req.flash('success')
    });
});

router.post('/add-product', (req, res, next) => {
    let product = new Product();
    product.category = reg.body.category();
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;

    product.save( err => {
        if(err) return next(err);
        req.flash('success', 'محصول با موفقیت اضافه شد');
        return res.redirect('/add-product');
    });
});
    // End of Product Routes

module.exports = router;