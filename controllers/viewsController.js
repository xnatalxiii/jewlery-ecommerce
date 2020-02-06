const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("./../models/productModel");
const User = require("./../models/userModel");

const Order = require("./../models/orderModel");
const crypto = require("crypto");

/*-------------------------------------------------- 
	- Render principal view - 
	- returns products
--------------------------------------------------*/
exports.getPrincipalView = catchAsync(async (req, res, next) => {
	let query = Product.find({ discount: { $gt: 0 } });
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 4;
	const skip = (page - 1) * limit;
	query = query.skip(skip).limit(limit);
	query = query.sort({ discount: "desc" });

	const productsDisc = await query;

	let queryNew = Product.find();
	queryNew = queryNew.skip(skip).limit(limit);
	queryNew = queryNew.sort({ creationDate: -1 });

	const productsNew = await queryNew;

	const currentPage = "principal";
	res.status(200).render("principal", {
		productsDisc,
		productsNew,
		currentPage
	});
});

exports.getCartView = catchAsync(async (req, res, next) => {
	const currentPage = "cart";
	res.status(200).render("user/cart", {
		currentPage
	});
});

exports.getCheckoutView = catchAsync(async (req, res, next) => {
	const currentPage = "cart";
	res.status(200).render("user/checkout", {
		currentPage
	});
});

exports.getContactView = catchAsync(async (req, res, next) => {
	const currentPage = "contact";
	res.status(200).render("contact", {
		currentPage
	});
});

exports.getProductsView = catchAsync(async (req, res, next) => {
	let query;
	const category = req.query.cat;
	if (category) {
		query = Product.find({ category: category });
	} else {
		query = Product.find();
	}

	if (req.query.search && req.query.search !== "") {
		query = query.find({ name: { $regex: `.*${req.query.search}.*`, $options: "i" } });
	}

	if (req.query.sort) {
		if (req.query.sort == "discount") {
			query = query.sort({ discount: -1 });
		}
		if (req.query.sort == "dec") {
			query = query.sort({ finalPrice: -1 });
		}
		if (req.query.sort == "asc") {
			query = query.sort({ finalPrice: 1 });
		}
		if (req.query.sort == "rel") {
			query = query.sort({ creationDate: -1 });
		}
	} else {
		query = query.sort({ creationDate: -1 });
	}

	const total = await query;
	const maxpage = Math.ceil(total.length / 9);
	const categories = Product.schema.path("category").caster.enumValues;

	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 9;
	const skip = (page - 1) * limit;
	query = query.skip(skip).limit(limit);

	const products = await query;

	const currentPage = "products";

	res.status(200).render("products", {
		products,
		categories,
		maxpage,
		category,
		currentPage
	});
});

exports.getProductView = catchAsync(async (req, res, next) => {
	if (req.params.slug === "undefined") {
		return next(new AppError("No product found with that ID", 404));
	} else {
		const product = await Product.findOne({ slug: req.params.slug });
		const currentPage = "products";

		let query = Product.find({ category: product.category });
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 4;
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);
		query = query.sort({ creationDate: -1 });

		const relatedProducts = await query;

		res.status(200).render("product/product", {
			product,
			currentPage,
			relatedProducts
		});
	}
});

exports.getLoginView = catchAsync(async (req, res, next) => {
	if (res.locals.user) {
		res.redirect("/account");
	} else {
		const currentPage = "login";

		res.status(200).render("user/login", {
			data: "data from the views controller",
			currentPage
		});
	}
});

exports.getSignupView = catchAsync(async (req, res, next) => {
	if (res.locals.user) {
		res.redirect("/account");
	} else {
		const currentPage = "login";

		res.status(200).render("user/signup", {
			data: "data from the views controller",
			currentPage
		});
	}
});

exports.getAccountView = catchAsync(async (req, res, next) => {
	const currentPage = "account";

	res.status(200).render("user/account", {
		currentPage
	});
});

exports.getOrdersView = catchAsync(async (req, res, next) => {
	if (false) {
		return next(new AppError("No product found with that ID", 404));
	} else {
		const currentPage = "orders";

		let query = Order.find({ user: req.user.id });
		query.sort({ orderDate: -1 });
		const orders = await query;
		res.status(200).render("orders", {
			orders,
			currentPage
		});
	}
});

exports.getForgotPassView = catchAsync(async (req, res, next) => {
	if (res.locals.user) {
		res.redirect("/account");
	} else {
		const currentPage = "login";

		res.status(200).render("user/forgotPass", {
			currentPage
		});
	}
});

exports.getResetPassView = catchAsync(async (req, res, next) => {
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const tempUser = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() }
	});

	res.locals.tempUser = tempUser;

	//2 if token no t expired, and user exisst, set new password
	if (!tempUser) {
		return next(new AppError("Token invalid", 400));
	}

	if (res.locals.user) {
		res.redirect("/account");
	} else {
		const currentPage = "login";

		res.status(200).render("user/resetPass", {
			currentPage
		});
	}
});
