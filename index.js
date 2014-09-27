//http://dev.w3.org/csswg/css-color/

var color = require('stylecow-color');

module.exports = function (stylecow) {

	stylecow.addTask({

		//Convert hex + alpha values to rgba values
		Keyword: function (keyword) {
			if (keyword.name[0] === '#' && (keyword.name.length === 5 || keyword.name.length === 9) && keyword.ancestor('Declaration')) {
				var rgba = color.toRGBA(keyword.name);

				if (rgba[3] === 1) {
					keyword.name = '#' + color.RGBA_HEX(rgba);
				} else {
					keyword.replaceWith('rgba(' + color.toRGBA(keyword.name).join(',') + ')');
				}
			}
		},

		"Function": {

			//Convert gray() function to rgba/hex values
			gray: function (fn) {
				var rgba = color.toRGBA(fn.content, 'gray');

				if (rgba[3] === 1) {
					fn.replaceWith('#' + color.RGBA_HEX(rgba));
				} else {
					fn.content = rgba;
					fn.name = 'rgba';
				}
			},

			//Convert color() function to rgba/hex values
			color: function (fn) {
				var args = fn[0];
				var rgba;

				if (args.type === 'Value') {
					rgba = color.toRGBA(args[0]);
					args[0].remove();
				} else {
					rgba = color.toRGBA(args);
					args.remove();
					args = [];
				}

				args.forEach(function (adjust) {
					switch (adjust.name) {
						case 'alpha':
						case 'a':
							rgba[3] = modify(rgba[3], adjust[0].name, 1);
							break;

						case 'red':
							rgba[0] = modify(rgba[0], adjust[0].name, 255);
							break;

						case 'green':
							rgba[1] = modify(rgba[1], adjust[0].name, 255);
							break;

						case 'blue':
							rgba[2] = modify(rgba[2], adjust[0].name, 255);
							break;

						case 'rgb':
							rgba[0] = modify(rgba[0], adjust[0].name, 255);
							rgba[1] = modify(rgba[1], adjust[1].name, 255);
							rgba[2] = modify(rgba[2], adjust[2].name, 255);
							break;

						case 'saturation':
						case 's':
							var hsla = color.RGBA_HSLA(rgba);
							hsla[1] = modify(hsla[1], adjust[0].name, 100);
							rgba = color.HSLA_RGBA(hsla);
							break;

						case 'lightness':
						case 'l':
							var hsla = color.RGBA_HSLA(rgba);
							hsla[2] = modify(hsla[2], adjust[0].name, 100);
							rgba = color.HSLA_RGBA(hsla);
							break;

						case 'whiteness':
						case 'w':
							var hwba = color.RGBA_HWBA(rgba);
							hwba[1] = modify(hwba[1], adjust[0].name, 100);
							rgba = color.HWBA_RGBA(hwba);
							break;

						case 'blackness':
						case 'b':
							var hwba = color.RGBA_HWBA(rgba);
							hwba[2] = modify(hwba[2], adjust[0].name, 100);
							rgba = color.HWBA_RGBA(hwba);
							break;

						case 'blend':
							var c = color.toRGBA(adjust[0][0]);

							rgba[0] = blend(rgba[0], c[0], adjust[0][1].name, 255);
							rgba[1] = blend(rgba[1], c[1], adjust[0][1].name, 255);
							rgba[2] = blend(rgba[2], c[2], adjust[0][1].name, 255);
							break;

						case 'blenda':
							var c = color.toRGBA(adjust[0][0]);

							rgba[0] = blend(rgba[0], c[0], adjust[0][1].name, 255);
							rgba[1] = blend(rgba[1], c[1], adjust[0][1].name, 255);
							rgba[2] = blend(rgba[2], c[2], adjust[0][1].name, 255);
							rgba[3] = blend(rgba[3], c[3], adjust[0][1].name, 1);
							break;

						case 'tint':
							rgba[0] = blend(rgba[0], 255, adjust[0].name, 255);
							rgba[1] = blend(rgba[1], 255, adjust[0].name, 255);
							rgba[2] = blend(rgba[2], 255, adjust[0].name, 255);
							break;

						case 'shade':
							rgba[0] = blend(rgba[0], 0, adjust[0].name, 255);
							rgba[1] = blend(rgba[1], 0, adjust[0].name, 255);
							rgba[2] = blend(rgba[2], 0, adjust[0].name, 255);
							break;

						case 'contrast':
							var hsla = color.RGBA_HSLA(rgba);
							var hwba = color.RGBA_HWBA(rgba);

							if (hsla[2] < 50) { //is dark +50%
								hwba[1] = modify(hwba[1], adjust[0].name, 100);
							} else {
								hwba[2] = modify(hwba[2], adjust[0].name, 100);
							}
							rgba = color.HWBA_RGBA(hwba);
					}
				});

				if (rgba[3] === 1) {
					fn.replaceWith('#' + color.RGBA_HEX(rgba));
				} else {
					fn.content = rgba;
					fn.name = 'rgba';
				}
			}
		}
	});
};


function modify (base, value, max) {
	var mode;

	if (value[0] === '+' || value[0] === '-') {
		mode = value[0];
		value = value.substr(1);
	}

	if (value.indexOf('%') !== -1) {
		value = ((max / 100) * parseFloat(value, 10));
	} else {
		value = parseFloat(value, 10);
	}

	if (max === 1) {
		value = parseFloat(value.toFixed(2));
	} else {
		value = Math.round(value);
	}

	if (mode === '+') {
		base += value;
	} else if (mode === '-') {
		base -= value;
	} else {
		base = value;
	}

	if (base > max) {
		return max;
	}

	if (base < 0) {
		return 0;
	}

	return base;
}

function blend (base, value, percentage, max) {
	percentage = parseFloat(percentage);

	base = (base / 100) * percentage;
	value = (value / 100) * (100 - percentage);
	
	base += value;

	if (max === 1) {
		base = parseFloat(base.toFixed(2));
	} else {
		base = Math.round(base);
	}

	if (base > max) {
		return max;
	}

	if (base < 0) {
		return 0;
	}

	return base;
}
