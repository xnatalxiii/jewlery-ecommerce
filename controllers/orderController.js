const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const Order = require("./../models/orderModel");

/*-------------------------------------------------- 
	- Create order - 
--------------------------------------------------*/
exports.createOrder = catchAsync(async (req, res, next) => {
	const lastOrder = await Order.findOne().sort({ orderDate: -1 });
	let newFolio = 110001;
	if (lastOrder) {
		newFolio = +lastOrder.folio + 1;
	}

	const newOrder = await Order.create({
		user: req.user.id,
		folio: newFolio,
		cart: req.user.cart,
		address: req.body.address,
		contact: req.body.contact,
		recipient: req.body.recipient,
		total: req.body.total
	});

	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		data: {
			newOrder
		}
	});

	// console.log(newProd);
});

/*-------------------------------------------------- 
	- Get all orders - 
--------------------------------------------------*/
exports.getAllOrders = catchAsync(async (req, res, next) => {
	const orders = await Order.find();
	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		results: orders.length,
		data: {
			orders
		}
	});
});

/*-------------------------------------------------- 
	- Get order - 
--------------------------------------------------*/
exports.getOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new AppError("No order found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			order
		}
	});
});

/*-------------------------------------------------- 
	- Get my orders - 
--------------------------------------------------*/
exports.myOrders = catchAsync(async (req, res, next) => {
	const order = await Order.find({ user: req.user.id });

	if (!order) {
		return next(new AppError("No order found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			order
		}
	});
});

/*-------------------------------------------------- 
	- Delete order - 
--------------------------------------------------*/
exports.deleteOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndDelete(req.params.id);
	if (!order) {
		return next(new AppError("No order found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: null
	});
});

/*-------------------------------------------------- 
	- Update order - 
--------------------------------------------------*/
exports.updateOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!order) {
		return next(new AppError("No product found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			order
		}
	});
});

/*-------------------------------------------------- 
	- Update MY order - 
--------------------------------------------------*/
exports.updateMyOrder = catchAsync(async (req, res, next) => {
	const flag = await Order.findOne({ _id: req.params.id, user: req.user.id });

	if (!flag) {
		return next(new AppError("No product found with that ID", 404));
	}
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{ status: "Cancelado" },
		{
			new: true,
			runValidators: true
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			order
		}
	});
});
