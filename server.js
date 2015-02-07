var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');


app.use(morgan('dev')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; 

var mongoose = require('mongoose');
var db = mongoose.connect('localhost/wowdata');
var Schema = mongoose.Schema;
var Product = mongoose.model('Product', new Schema({name: String, level: Number, class: String, gender: String, race: String, fiction: String}));

var router = express.Router();              


router.use(function(req, res, next) {

    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/products')
    
    .post(function(req, res) {
        
        var product = new Product();      
        product.name = req.body.name;  
		product.level = req.body.level;
		product.class = req.body.class;
		product.gender = req.body.gender;
		product.race = req.body.race;
		product.fiction = req.body.fiction;

        product.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product created!' });
        });
        
    })
	
    .get(function(req, res) {
        Product.find(function(err, wowdata) {
            if (err)
                res.send(err);
            res.json(wowdata);
		});
	});

router.route('/products/:wowdata')


	.get(function(req, res) {
		Product.findById(req.params.wowdata, function(err, product) {
			if (err)
				res.send(err);
			res.json(product);
		});
	})

	.put(function(req, res) {
		Product.findById(req.params.wowdata, function(err, product) {

			if (err)
				res.send(err);

			product.name = req.body.name;
			product.level = req.body.level;
			product.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Product updated!' });
			});

		});
	})

	.delete(function(req, res) {
		Product.remove({
			_id: req.params.wowdata
		}, function(err, product) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});	
	
app.use('/api', router);

app.use(express.static(__dirname + '/webapp'));

app.listen(port);
console.log('Magic happens on port ' + port);
