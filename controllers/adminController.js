const catchAsync = require("./../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

const AppError = require("../utils/appError");
const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const Order = require("./../models/orderModel");
const Contact = require("./../models/contactModel");

const multerStorage = multer.memoryStorage();

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

exports.uploadBannerImg = upload.single("img");

exports.resizeBannerImg = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	await sharp(req.file.buffer)
		.resize(800, 350)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile("public/resources/img/principal_banner.jpeg");

	next();
});

/*-------------------------------------------------- 
	- Update Banner - 
--------------------------------------------------*/
exports.updateBanner = catchAsync(async (req, res, next) => {
	res.status(200).json({
		status: "success"
	});
});

/*-------------------------------------------------- 
	- Render users - 
--------------------------------------------------*/
exports.getUsersView = catchAsync(async (req, res, next) => {
	let query = User.find().populate("orders");
	if (req.query.search && req.query.search !== "") {
		query = query.find({
			$or: [
				{ name: { $regex: `.*${req.query.search}.*`, $options: "i" } },
				{ email: { $regex: `.*${req.query.search}.*`, $options: "i" } },
				{ type: { $regex: `.*${req.query.search}.*`, $options: "i" } }
			]
		});
	}

	const users = await query;
	res.status(200).render("admin/users", {
		users
	});
});

/*-------------------------------------------------- 
	- Render products - 
--------------------------------------------------*/
exports.getProductsView = catchAsync(async (req, res, next) => {
	let query = Product.find().sort({ creationDate: -1 });
	if (req.query.search && req.query.search !== "") {
		query = query.find({
			$or: [
				{ name: { $regex: `.*${req.query.search}.*`, $options: "i" } },
				{ category: { $regex: `.*${req.query.search}.*`, $options: "i" } }
			]
		});
	}
	// const page = req.query.page * 1 || 1;
	// const limit = req.query.limit * 1 || 4;
	// const skip = (page - 1) * limit;
	// query = query.skip(skip).limit(limit);

	const products = await query;
	const categories = Product.schema.path("category").caster.enumValues;

	res.status(200).render("admin/products", {
		products,
		categories
	});
});

/*-------------------------------------------------- 
	- Render orders - 
--------------------------------------------------*/
exports.getOrdersView = catchAsync(async (req, res, next) => {
	let query = Order.find()
		.populate("user")
		.sort({ orderDate: -1 });
	if (req.query.search && req.query.search !== "") {
		query = query.find({
			$or: [
				{ folio: { $regex: `.*${req.query.search}.*`, $options: "i" } },
				{ formatedDate: { $regex: `.*${req.query.search}.*`, $options: "i" } },
				{ status: { $regex: `.*${req.query.search}.*`, $options: "i" } }
			]
		});
	}
	// const page = req.query.page * 1 || 1;
	// const limit = req.query.limit * 1 || 4;
	// const skip = (page - 1) * limit;
	// query = query.skip(skip).limit(limit);
	const statuses = Order.schema.path("status").enumValues;
	const orders = await query;
	res.status(200).render("admin/orders", {
		orders,
		statuses
	});
});

/*-------------------------------------------------- 
	- Render contacts - 
--------------------------------------------------*/
exports.getContactsView = catchAsync(async (req, res, next) => {
	let query = Contact.find().sort({ contactDate: -1 });
	if (req.query.search && req.query.search !== "") {
		query = query.find({
			$or: [
				{ name: { $regex: `.*${req.query.search}.*`, $options: "i" } },
				{ email: { $regex: `.*${req.query.search}.*`, $options: "i" } }
			]
		});
	}

	const contacts = await query;
	res.status(200).render("admin/contacts", {
		contacts
	});
});
