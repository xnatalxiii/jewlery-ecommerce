import axios from "axios";

/*-------------------------------------------------
    - Create item request -
-------------------------------------------------*/
export const createProduct = async data => {
	try {
		const res = await axios({
			method: "POST",
			url: `/api/products`,
			data
		});
		location.assign("/admin/products");
	} catch (err) {
		console.log(err);
	}
};

/*-------------------------------------------------
    - Delete item request -
-------------------------------------------------*/
export const deleteProduct = async id => {
	try {
		const res = await axios({
			method: "DELETE",
			url: `/api/products/${id}`
		});
		if (res.data.status === "success") {
			location.assign("/admin/products");
		}
	} catch (err) {}
};

/*-------------------------------------------------
    - Update item request -
-------------------------------------------------*/
export const updateProduct = async (data, id) => {
	try {
		const res = await axios({
			method: "PATCH",
			url: `/api/products/${id}`,
			data
		});
		location.assign("/admin/products");
		const alert = document.getElementById("user-alert");
		// alert.innerText = "logeado";
		// alert.classList.toggle("user-alert");
		// console.log(res);
	} catch (err) {
		// location.assign("/admin/products");
		console.log(err);
	}
};
