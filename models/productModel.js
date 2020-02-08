const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required."],
		unique: true
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
		type: [String],
		enum: [
			"Accesorios",
			"Anillos",
			"Aretes",
			"Collares",
			"Conjuntos",
			"Dijes",
			"Pulseras",
			"Tobilleras"
		],
		default: "Accesorios"
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
	},
	creationDate: Date
});

// {
// 	"name": "Collar 1 xd",
//  "description"
//  "description": "lorem",
// 	"category": "",
// 	"price": "",
// 	"discount": ""
// }

/*-------------------------------------------------- 
	- Pre Middleware to generate slug -
--------------------------------------------------*/
productSchema.pre("save", function(next) {
	console.log("middleware save");
	this.creationDate = Date.now();

	this.slug = slugify(this.name, { lower: true });
	this.finalPrice = +(this.price - (this.price * this.discount) / 100).toFixed(2);
	next();
});

/*-------------------------------------------------- 
	- Model export -
--------------------------------------------------*/
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
