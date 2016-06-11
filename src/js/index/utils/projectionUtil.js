// Equatorial radius
let a = 6378137;

// Eccentricity
let e = 0.0818191910428;

export default {
	getMeterFromDeltaLat(deltaLat, phiLat) {
		let phi = phiLat * Math.PI / 180;
		return (
			(a * (1 - (e**2))) /
			((1 - ((e**2) * (Math.sin(phi)**2))) ** (1.5))
		) * (deltaLat * Math.PI / 180);
	},
	
	getMeterFromDeltaLng(deltaLng, phiLat) {
		let phi = phiLat * Math.PI / 180;
		return (
			(a * Math.cos(phi)) /
			(Math.sqrt(1 - ((e**2) * (Math.sin(phi)**2))))
		) * (deltaLng * Math.PI / 180);
	},
};
