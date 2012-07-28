var Iodine = {};

Iodine.Pixels = function(img) {
		var _c = document.createElement("canvas");
		this.width = _c.width = img.width;
		this.height = _c.height = img.height;
		var ctx = _c.getContext('2d');
		ctx.drawImage(img, 0, 0);
		this.pixels = ctx.getImageData(0,0,_c.width,_c.height);
		this.result = _c; 
		this.g = ctx;
}

Iodine.Pixels.prototype.desaturate = function() {
	var d = this.pixels.data;
	for(i = 0; i < d.length; i+= 4) {
		var r=d[i];
		var g=d[i+1];
		var b=d[i+2];
		var a=d[i+3];
		// http://en.wikipedia.org/wiki/Luminance_(relative)
		// Y = 0.2126 R + 0.7152 G + 0.0722 B
		var y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		d[i] = y;
		d[i+1] = y;
		d[i+2] = y;
	}
	this.g.putImageData(this.pixels, 0, 0);
};

Iodine.Pixels.prototype.brighten = function(_r, _g, _b) {
	var d = this.pixels.data;
	for(i = 0; i < d.length; i+= 4) {
		var r=d[i];
		var g=d[i+1];
		var b=d[i+2];
		var a=d[i+3];
		d[i] = _r+r;
		d[i+1] = _g+g;
		d[i+2] = _b+b;
	}
	this.g.putImageData(this.pixels, 0, 0);
};


Iodine.Pixels.prototype.applycurve = function(c) {
	var d = this.pixels.data;
	var c_v=c.curves[0];
	var c_r=c.curves[1];
	var c_g=c.curves[2];
	var c_b=c.curves[3];
	var c_a=c.curves[4];

	for(i = 0; i < d.length; i+= 4) {
		var r=d[i];
		var g=d[i+1];
		var b=d[i+2];
		var a=d[i+3];
		var r2 = (c_r.length > r) ? c_r[r][1] : r;
		var g2 = (c_g.length > g) ? c_g[g][1] : g;
		var b2 = (c_b.length > b) ? c_b[b][1] : b;
		var a2 = (c_a.length > a) ? c_a[a][1] : a;
		d[i] = r2;
		d[i+1] = g2;
		d[i+2] = b2;
	}
	this.g.putImageData(this.pixels, 0, 0);
};

Iodine.Pixels.prototype.image = function() {
	return this.result.toDataURL("image/png");
}
