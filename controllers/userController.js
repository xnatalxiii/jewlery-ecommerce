const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { promisify } = require("util");

const User = require("./../models/userModel");

/*-------------------------------------------------- 
	- Filter header params - 
--------------------------------------------------*/
const filterObject = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

/*-------------------------------------------------- 
	- Get all users - 
--------------------------------------------------*/
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find().populate("orders");
	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		results: users.length,
		data: {
			users
		}
	});
});

/*-------------------------------------------------- 
	- Get user - 
--------------------------------------------------*/
exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	// console.log(user.cart);
	if (!user) {
		return next(new AppError("No user found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			user
		}
	});
});

/*-------------------------------------------------- 
	- Delete user - 
--------------------------------------------------*/
exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) {
		return next(new AppError("No User found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: null
	});
});

/*-------------------------------------------------- 
	- Update user - 
--------------------------------------------------*/
exports.updateUser = catchAsync(async (req, res, next) => {
	// console.log(req.body);
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!user) {
		return next(new AppError("No user found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			user
		}
	});
});

/*-------------------------------------------------- 
	- Update Data (not password) - 
--------------------------------------------------*/
exports.updateData = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError("This route is not for passwords update", 401));
	}
	const filteredBody = filterObject(req.body, "name", "email");

	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser
		}
	});
});

/*-------------------------------------------------- 
	- Add Cart Product - 
--------------------------------------------------*/
exports.addCartProd = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError("This route is not for passwords update", 401));
	}
	// const user = await User.findById(req.user._id);

	let cart = req.user.cart;

	let flag = true;
	cart.forEach(el => {
		if (el.product.id == req.body.prodId) {
			el.quantity = +el.quantity + +req.body.quantity;
			flag = false;
		}
	});

	if (flag) {
		cart.push({ product: req.body.prodId, quantity: req.body.quantity });
	}

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{ cart },
		{
			new: true,
			runValidators: true
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser
		}
	});
});

/*-------------------------------------------------- 
	- Delete Cart Product - 
--------------------------------------------------*/
exports.updateCartProd = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError("This route is not for passwords update", 401));
	}

	let cart = req.user.cart;

	if (req.body.quantity < 1) {
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].product.id == req.body.prodId) {
				cart.splice(i, 1);
			}
		}
	} else {
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].product.id == req.body.prodId) {
				cart[i].quantity = req.body.quantity;
			}
		}
	}

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{ cart },
		{
			new: true,
			runValidators: true
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser
		}
	});
});

/*-------------------------------------------------- 
	- Empty Cart Products - 
--------------------------------------------------*/
exports.emptyCartProd = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError("This route is not for passwords update", 401));
	}

	let cart = req.user.cart;

	cart = [];

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{ cart },
		{
			new: true,
			runValidators: true
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser
		}
	});
});
