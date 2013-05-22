function ColorPaletteGenerator() {
	// Initialize to some sane defaults.
	//
	// We want the colors in HSV. Visit [1] for more information. We start with a random hue value
	// so the user doesn't get duplicate generations (unless they want it). Setting the value and
	// saturation to 1.0 gives us defaults that are vibrant by default.
	//
	// [1] https://en.wikipedia.org/wiki/HSL_and_HSV
	this.hue = Math.floor(Math.random());
	this.value = 1.0;
	this.saturation = 1.0;

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
	this.hue = Math.floor(Math.random());

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
	this.value = Math.floor(Math.random());

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
	this.saturation = Math.floor(Math.random());

	return this;
}

ColorPaletteGenerator.prototype.getNextColor = function() {
}

ColorPaletteGenerator.prototype.getNextRGBColor = function() {
}
