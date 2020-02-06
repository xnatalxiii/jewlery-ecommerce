import axios from "axios";

/*-------------------------------------------------
    - Create order request -
-------------------------------------------------*/
export const createOrder = async data => {
	// console.log(data);
	try {
		const res = await axios({
			method: "POST",
			url: `/api/orders`,
			data
		});

		const res2 = await axios({
			method: "PATCH",
			url: `/api/users/emptyCartProd`
		});

		location.assign("/orders");
	} catch (err) {
		console.log(err);
	}
};

/*-------------------------------------------------
    - Update order request -
-------------------------------------------------*/
export const updateOrder = async (data, id) => {
	try {
		const res = await axios({
			method: "PATCH",
			url: `/api/orders/${id}`,
			data
		});

		location.assign("");

		// console.log(res);
	} catch (err) {
		console.log(err);
	}
};

/*-------------------------------------------------
    - Delete order request -
-------------------------------------------------*/
export const deleteOrder = async id => {
	try {
		const res = await axios({
			method: "DELETE",
			url: `/api/orders/${id}`
		});
		if (res.data.status === "success") {
			location.assign("/admin/orders");
		}
	} catch (err) {}
};

/*-------------------------------------------------
    - cancel my order request -
-------------------------------------------------*/
export const cancelMyOrder = async id => {
	try {
		const res = await axios({
			method: "PATCH",
			url: `/api/orders/cancel/${id}`
		});
		if (res.data.status === "success") {
			location.assign("/orders");
		}
	} catch (err) {}
};
