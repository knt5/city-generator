export default {
	getPixelRatio() {
		if (window.devicePixelRatio !== undefined) {
			return window.devicePixelRatio;
		} else {
			return 1;
		}
	}
};
