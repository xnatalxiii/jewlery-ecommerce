import axios from "axios";

/*-------------------------------------------------
    - Update Banner img -
-------------------------------------------------*/
export const updateBanner = async data => {
	// console.log(data);
	try {
		const res = await axios({
			method: "PATCH",
			url: `/admin/updateBanner`,
			data
		});
		location.assign("/");

		// console.log(res);
	} catch (err) {
		console.log(err);
	}
};
