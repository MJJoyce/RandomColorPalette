function ColorPaletteGenerator() {
	// Initialize to some sane defaults.
	//
	// We want the colors in HSV. Visit [1] for more information. We start with a random hue value
	// so the user doesn't get duplicate generations (unless they want it). Setting the value and
	// saturation to 0.99 gives us defaults that are vibrant by default.
	//
	// [1] https://en.wikipedia.org/wiki/HSL_and_HSV
	this.hue = Math.random();
	this.value = 0.99;
	this.saturation = 0.99;

	// Constant for the Golden Angle. Check out [1] and [2] for why we're using this value.
	//
	// [1] https://en.wikipedia.org/wiki/Golden_angle
	// [2] https://en.wikipedia.org/wiki/Golden_ratio#Mathematics
	this.GOLDEN_RATIO_CONJUGATE = 0.61803398875;
	
	// Let's get some chaining action on
	return this;
}

ColorPaletteGenerator.prototype.setHue = function(newHue) {
	this.hue = newHue;

	return this
}

ColorPaletteGenerator.prototype.getHue = function() {
	return this.hue;
}

ColorPaletteGenerator.prototype.resetHue = function() {
	this.hue = Math.random();

	return this;
}

ColorPaletteGenerator.prototype.setValue = function(newValue) {
	this.value = newValue;

	return this;
}

ColorPaletteGenerator.prototype.getValue = function() {
	return this.value;
}

ColorPaletteGenerator.prototype.resetValue = function() {
	this.value = Math.random();

	return this;
}

ColorPaletteGenerator.prototype.setSaturation = function(newSaturation) {
	this.saturation = newSaturation;

	return this;
}

ColorPaletteGenerator.prototype.getSaturation = function() {
	return this.saturation;
}

ColorPaletteGenerator.prototype.resetSaturation = function() {
	this.saturation = Math.random();

	return this;
}

// Generate the next semi-random color and return a dictionary of the current HSV values
ColorPaletteGenerator.prototype.getNextColor = function() {
	this.hue = (this.hue + this.GOLDEN_RATIO_CONJUGATE) % 1

	return {
		"hue": this.hue,
		"saturation": this.saturation,
		"value": this.value,
	};
}

// Generate the next semi-random color and return it as an RGB value
ColorPaletteGenerator.prototype.getNextRGBColor = function() {
	this.getNextColor();

	// For additional information on how to convert from HSV to RGB please look at [1]. The
	// only possible "gotcha" is that we're maintaining our hue value as a float from [0, 1] 
	// instead of in degrees or radians. This really only changes the initial H` calculation
	// mentioned in [1].
	//
	// [1] https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
	
    // This is H / 60 for us when H is [0, 360]
	var huePrime = this.hue * 6

	var chroma = this.saturation * this.value;
	var intermediate = chroma * (1 - Math.abs(huePrime % 2 - 1));

	// With this chroma and intermediate value we can we can find a point along the bottom
	// of the RGB cube with the same chroma and hue as our HSV value.
	var partialRGB;
	if (0 <= huePrime && huePrime < 1)      partialRGB = [chroma, intermediate, 0];
	else if (1 <= huePrime && huePrime < 2) partialRGB = [intermediate, chroma, 0];
	else if (2 <= huePrime && huePrime < 3) partialRGB = [0, chroma, intermediate];
	else if (3 <= huePrime && huePrime < 4) partialRGB = [0, intermediate, chroma];
	else if (4 <= huePrime && huePrime < 5) partialRGB = [intermediate, 0, chroma];
	else if (5 <= huePrime && huePrime < 6) partialRGB = [chroma, 0, intermediate];
	else                                    partialRGB = [0, 0, 0];

	// Finally we'll get the actual RGB value by adding a constant offset to the calculated values.
	var offset = this.value - chroma;
	return [partialRGB[0] + offset, partialRGB[1] + offset, partialRGB[2] + offset];
}

// Generate the next semi-random color and return it as a RGB Hex string
ColorPaletteGenerator.prototype.getNextRGBHexColor = function() {
	var rgb = this.getNextRGBColor();

	// Convert the [0, 1] range float
	var r = Math.floor(rgb[0] * 256);
	var g = Math.floor(rgb[1] * 256);
	var b = Math.floor(rgb[2] * 256);

	// Convert these to hex
	r = ("00" + r.toString(16)).substr(-2);
	g = ("00" + g.toString(16)).substr(-2);
	b = ("00" + b.toString(16)).substr(-2);

	// Concatenate and return our new string
	return (r + g + b);
}
