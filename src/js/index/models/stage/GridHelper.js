export default class GridHelper extends THREE.LineSegments {
	constructor(width, height, step) {
		let color = new THREE.Color(0x888888);
		
		let vertices = [];
		let colors = [];
		
		for (let x = -width, j = 0; x <= width; x += step) {
			vertices.push(x, -height, 0, x, height, 0);
			
			color.toArray(colors, j); j += 3;
			color.toArray(colors, j); j += 3;
			
			for (let y = -height; y <= height; y += step) {
				vertices.push(-width, y, 0, width, y, 0);
				
				color.toArray(colors, j); j += 3;
				color.toArray(colors, j); j += 3;
			}
		}
		
		let geometry = new THREE.BufferGeometry();
		geometry.addAttribute('position', new THREE.Float32Attribute(vertices, 3));
		geometry.addAttribute('color', new THREE.Float32Attribute(colors, 3));
		
		let material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
		
		super(geometry, material);
	}
}
