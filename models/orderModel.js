const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Order must belong to a user."]
		},
		recipient: {
			type: String,
			required: [true, "Destinatario requerido."]
		},
		folio: {
			type: String,
			required: [true, "Folio requerido."],
			unique: true
		},
		cart: [
			{
				product: {
					name: {
						type: String,
						required: [true, "Name is required."]
					},
					description: {
						type: String,
						required: [true, "Product description is required."]
					},
					img: {
						type: String,
						default: "prod-3.png"
					},
					imgData: Buffer,
					category: {
						type: [String]
					},
					price: {
						type: Number,
						required: [true, "Price is required."]
					},
					finalPrice: {
						type: Number
					},
					discount: {
						type: Number,
						default: 0
					},
					slug: {
						type: String
					}
				},
				quantity: {
					type: Number,
					required: [true, "Product must have quantity"]
				}
			}
		],
		total: {
			type: Number,
			required: [true, "Order must have a total"]
		},
		status: {
			type: String,
			enum: ["Pago pendiente", "Envío pendiente", "Enviado", "Cancelado"],
			default: "Pago pendiente"
		},
		address: {
			type: String
		},
		contact: {
			type: String
		},
		orderDate: Date,
		formatedDate: String
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

orderSchema.pre("save", function(next) {
	this.orderDate = Date.now();

	let d = new Date(Date.now());
	let month = "" + (d.getMonth() + 1);
	let day = "" + d.getDate();
	let year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	this.formatedDate = [day, month, year].join("-");

	next();
});

/*-------------------------------------------------- 
	- Model export -
--------------------------------------------------*/
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
