# QuickTicker

Simple plugin for displaying and scrolling messages and html across an element.

## Installation

Simply place quickerticker.js on your page.

    <script src="path/to/quickticker.js" type="text/javascript"></script>

QuickTicker requires jQuery v1.9 or above.

## Usage

QuickTicker scrolls messages and html elements across the span of an element. It can be initialized on any element:

    $('#myTicker').quickTicker();

Configuration options can be passed on initialization:

    $('#myTicker').quickTicker({
	    duration: 10000, // time (ms) it takes for item to scroll
	    spacing: 50 // spacing (px) between each item
    });

See Configuration section for more details.

QuickTicker instance can be assigned to a variable, where it can then call quickTicker methods:

    var ticker = $('#myTicker').quickTicker({
	    duration: 10000,
	    spacing: 50
    }).data('quickTicker');
    
    ticker.add('<strong>My new message!</strong>');
See Methods section for more details.

## Configuration

 - duration - [default: 5000] The time (in milliseconds) it takes for each item to scroll across the quickTicker instance element. QuickTicker internally adjusts duration based on the item width (i.e. very short vs very long texts).
 - spacing - [default: 30] The spacing (in pixels) between each item.
 - allowDuplicate - [default: true] When set to false, new items will not be added if a copy of it is currently in queue in quickTicker

## Methods

 - add(content) - Add 'content' to the queue in the quickTicker instance. 'content' may be plain text or html string.

## License

Licensed under the MIT License: [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
