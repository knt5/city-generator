// Equatorial radius
const a = 6378137;

// Eccentricity
const e = 0.0818191910428;

export default {
	getMeterFromDeltaLat(deltaLat, phiLat) {
		const phi = phiLat * Math.PI / 180;
		return (
			(a * (1 - (e**2))) /
			((1 - ((e**2) * (Math.sin(phi)**2))) ** (1.5))
		) * (deltaLat * Math.PI / 180);
	},
	
	getMeterFromDeltaLng(deltaLng, phiLat) {
		const phi = phiLat * Math.PI / 180;
		return (
			(a * Math.cos(phi)) /
			(Math.sqrt(1 - ((e**2) * (Math.sin(phi)**2))))
		) * (deltaLng * Math.PI / 180);
	},
};
