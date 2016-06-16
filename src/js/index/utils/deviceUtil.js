export default {
	getPixelRatio() {
		if (window.devicePixelRatio !== undefined) {
			// TODO: Detect whether the device is poor or not,
			//       and return devicePixelRatio to draw.
			return window.devicePixelRatio;
		} else {
			return 1;
		}
	}
};
