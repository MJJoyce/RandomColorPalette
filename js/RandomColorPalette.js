////////////////////////////////////////////////////////////////////////////////
//
//	  Copyright 2013 Michael Joyce
//	  
//	  Licensed under the Apache License, Version 2.0 (the "License");
//	  you may not use this file except in compliance with the License.
//	  You may obtain a copy of the License at
//	  
//	  http://www.apache.org/licenses/LICENSE-2.0
//	  
//	  Unless required by applicable law or agreed to in writing, software
//	  distributed under the License is distributed on an "AS IS" BASIS,
//	  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	  See the License for the specific language governing permissions and
//	  limitations under the License.
//	  
////////////////////////////////////////////////////////////////////////////////

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
	// Bound the hue value to [0, 1)
	if (newHue >= 1) newHue = 0.9999;
	else if (newHue < 0) newHue = 0;

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
	// Bound the value value to [0, 1)
	if (newValue >= 1) newValue = 0.9999;
	else if (newValue < 0) newValue = 0;

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
	// Bound the saturation value to [0, 1)
	if (newSaturation >= 1) newSaturation = 0.9999;
	else if (newSaturation < 0) newSaturation = 0;

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
	var currentColor = {
		"hue": this.hue,
		"saturation": this.saturation,
		"value": this.value,
	};

	this.hue = (this.hue + this.GOLDEN_RATIO_CONJUGATE) % 1
	return currentColor;
}

// Generate the next semi-random color and return it as an RGB value
ColorPaletteGenerator.prototype.getNextRGBColor = function() {
	var nextColor = this.getNextColor();

	// For additional information on how to convert from HSV to RGB please look at [1]. The
	// only possible "gotcha" is that we're maintaining our hue value as a float from [0, 1] 
	// instead of in degrees or radians. This really only changes the initial H` calculation
	// mentioned in [1].
	//
	// [1] https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
	
    // This is H / 60 for us when H is [0, 360]
	var huePrime = nextColor.hue * 6

	var chroma = nextColor.saturation * nextColor.value;
	var intermediate = chroma * (1 - Math.abs(huePrime % 2 - 1));

	// With nextColor chroma and intermediate value we can we can find a point along the bottom
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
	var offset = nextColor.value - chroma;
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

// Seed the color generator with an RGB color
//
// Input:
//	An RGB color value of the form:
//		#<6 digit hex value> or
//		rgb(<0-255>, <0-255>, <0-255>)
//
//	Returns:
//		true if the color was processed successfully, false otherwise
ColorPaletteGenerator.prototype.seedWithColor = function(colorString) {
	var floatingColor; // The rgb color components as float from 0 to 1

	if (colorString[0] === "#" && colorString.length == 7)
		floatingColor = this.convertHexRGBColorToFloats(colorString);
	else if (colorString.substring(0, 4) === "rgb(")
		floatingColor = this.convertRGBColorToFloats(colorString);
	else
		return false;

	hsvColor = this.convertRGBtoHSV(floatingColor);
	this.setHue(hsvColor.hue);
	this.setSaturation(hsvColor.saturation);
	this.setValue(hsvColor.value);

	return true;
}

// Helper for converting RGB colors of the form #FFFFFF to floats
//
// Input: 
//	 An RGB value of the form #<6 digit hex value>
//
// Returns
//   An array containing the red, green, and blue values (in that order) as
//   floats in the range [0, 1].
ColorPaletteGenerator.prototype.convertHexRGBColorToFloats = function(colorString) {
	if (!(/^#[0-9A-Fa-f]{6}$/.test(colorString))) {
		console.log("Badly formed colorString in convertHexRGBColorToFloats");
		return;
	}

	red = parseInt(colorString.slice(1,3), 16);
	green = parseInt(colorString.slice(3,5), 16);
	blue = parseInt(colorString.slice(5,7), 16);

	return [red/255.0, green/255.0, blue/255.0];
}

// Helper for converting RGB colors of the form rgb(#, #, #) to floats
// 
// Input:
//   A RGB value of the form rgb([0-255], [0-255], [0-255])
//
// REturns:
//   An array containing the red, green, and blue values (in that order) as 
//   floats in the range [0, 1].
ColorPaletteGenerator.prototype.convertRGBColorToFloats = function(colorString) {
	if (!(/^rgb\([0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}\)$/.test(colorString))) {
		console.log("Incorrect colorString format in convertRGBColorToFloats");
		console.log("Expected rbg([0-255], [0-255], [0-255]) but got: " + colorString);
		return;
	}

	// Grab the values inside of the parentheses. This will be the color values plus commas
	// We grab the 1st index since it returns an array with two elements in it as a results. 
	// The 1st element is the result of the capture (which is what we care about)
	var commaSeperatedValues = /^rgb\((.*)\)$/.exec(colorString)[1];

	// Split the color values out so we can convert them
	var colorValues = commaSeperatedValues.split(',');

	// Convert all the color values to ints (instead of strings) and make sure the user
	// didn't enter a value that's too big. We only worry about values > 255 since the 
	// regex test above would reject negative numbers (since it won't accept a -)
	colorValues = colorValues.map(function(element) {
		var intVal = parseInt(element, 10);
		if (intVal > 255) {intVal = 255;}	
		return intVal;
	});

	return [colorValues[0]/255.0, colorValues[1]/255.0, colorValues[2]/255.0];
}

// Convert floating point RGB color of the form ([0-1], [0-1], [0-1]) to HSV
//
// Input:
//	RGB color of the form ([0-1], [0-1], [0-1]) 
//
// Return:
//	Object containing hue, saturation, and value 
ColorPaletteGenerator.prototype.convertRGBtoHSV = function(floatingColor) {
	var hsv = {hue: 0, saturation: 0, value: 0};

	var red = floatingColor[0];
	var green = floatingColor[1];
	var blue = floatingColor[2];

	var rgbMin = Math.min(red, green, blue);
	var rgbMax = Math.max(red, green, blue);
	var maxMinDelta = rgbMax - rgbMin;

	// Get the Value
	hsv.value = rgbMax;

	// Get the Saturation
	if (maxMinDelta == 0) {
		// Need to avoid division by 0 for the future calculations!!
		hsv.saturation = 0;
		hsv.hue = 0;
		return;
	} else {
		hsv.saturation = maxMinDelta / rgbMax;
	}

	// Get the Hue
	if (rgbMax == red) {
		hsv.hue = 60 * (((green - blue) / maxMinDelta) % 6);
	} else if (rgbMax == green) {
		hsv.hue = 60 * (((blue - red) / maxMinDelta) + 2);
	} else { // rgbMax == blue
		hsv.hue = 60 * (((red - green) / maxMinDelta) + 4);
	}

	// We get a hue value in the range [0, 360]
	hsv.hue /= 360.0;

	return hsv;
}
