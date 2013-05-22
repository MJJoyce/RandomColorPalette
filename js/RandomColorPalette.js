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
}

ColorPaletteGenerator.prototype.setHue = function(newHue) {
}

ColorPaletteGenerator.prototype.getHue = function() {
}

ColorPaletteGenerator.prototype.resetHue = function() {
}

ColorPaletteGenerator.prototype.setValue = function(newValue) {
}

ColorPaletteGenerator.prototype.getValue = function() {
}

ColorPaletteGenerator.prototype.resetValue = function() {
}

ColorPaletteGenerator.prototype.setSaturation = function(newSaturation) {
}

ColorPaletteGenerator.prototype.getSaturation = function() {
}

ColorPaletteGenerator.prototype.resetSaturation = function() {
}

ColorPaletteGenerator.prototype.getNextColor = function() {
}

ColorPaletteGenerator.prototype.getNextRGBColor = function() {
}
