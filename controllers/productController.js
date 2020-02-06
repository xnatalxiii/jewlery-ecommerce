const multer = require("multer");
const sharp = require("sharp");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Product = require("./../models/productModel");
const User = require("./../models/userModel");

const slugify = require("slugify");

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/resources/img/products");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `prod-${Date.now()}.${ext}`);
	}
});

// asi lo guardaen el buffer en req.file.buffer
// const multerStorage = multer.memoryStorage();

const multerFilet = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Not an image! please upload only images.", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilet
});

exports.uploadProductImg = upload.single("img");

// exports.resizeProductImg = catchAsync(async (req, res, next) => {
// 	if (!req.file) return next();

// 	req.file.filename = `prod-${Date.now()}.jpeg`;

// 	await sharp(req.file.buffer)
// 		.resize(500, 500)
// 		.toFormat("jpeg")
// 		.jpeg({ quality: 90 })
// 		.toFile(`public/resources/img/products/${req.file.filename}`);

// 	next();
// }) ;

/*-------------------------------------------------- 
	- Create product - 
--------------------------------------------------*/
exports.createProduct = catchAsync(async (req, res, next) => {
	const prod = await Product.findOne({ name: req.body.name });
	if (prod) {
		// console.log(`-------------------- El producto ya esta registrado ~`.red);
		return next(new AppError("El Producto esta registrado", 400));
	}
	// console.log(`-------------------- vamos a crear ~`.red);

	if (req.file) req.body.img = req.file.filename;

	const newProd = await Product.create({
		name: req.body.name,
		description: req.body.description,
		img: req.body.img,
		category: req.body.category,
		price: req.body.price,
		discount: req.body.discount
	});

	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		data: {
			newProd
		}
	});

	// console.log(`-------------------- Producto registrado ~`.yellow);
	// console.log(newProd);
});

/*-------------------------------------------------- 
	- Get all products - 
--------------------------------------------------*/
exports.getAllProducts = catchAsync(async (req, res, next) => {
	const products = await Product.find();

	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		results: products.length,
		data: {
			products
		}
	});
});

/*-------------------------------------------------- 
	- Get product - 
--------------------------------------------------*/
exports.getProduct = catchAsync(async (req, res, next) => {
	const prod = await Product.findById(req.params.id);
	if (!prod) {
		return next(new AppError("No Product found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			prod
		}
	});
});

/*-------------------------------------------------- 
	- Update product - 
--------------------------------------------------*/
exports.updateProduct = catchAsync(async (req, res, next) => {
	// console.log(req.body);
	if (req.body.name) {
		req.body.slug = slugify(req.body.name, { lower: true });
	}
	if (req.body.price && req.body.discount) {
		req.body.finalPrice = +(req.body.price - (req.body.price * req.body.discount) / 100).toFixed(2);
	}

	if (req.file) req.body.img = req.file.filename;

	const prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!prod) {
		return next(new AppError("No product found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			prod
		}
	});
});

/*-------------------------------------------------- 
	- Delete product - 
--------------------------------------------------*/
exports.deleteProduct = catchAsync(async (req, res, next) => {
	const users = await User.find();

	for (var j = 0; j < users.length; j++) {
		let cart = users[j].cart;
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].product.id == req.params.id) {
				cart.splice(i, 1);
				// console.log(users[j].name);
				let newUser = await User.findByIdAndUpdate(
					users[j].id,
					{ cart },
					{
						new: true,
						runValidators: true
					}
				);
			}
		}
	}

	const prod = await Product.findByIdAndDelete(req.params.id);

	if (!prod) {
		return next(new AppError("No Product found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: null
	});
});
