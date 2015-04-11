/**
    QuickTicker
    ============ 
    Simple plugin for displaying and scrolling messages and html contents across an element.

    (c) 2015 J. "Eric" Wu
    Released under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

;(function ($, window, document, undefined) {
    "use strict";

    var pluginName = "quickTicker";
    var defaults = {
        duration: 5000,
        spacing: 30,
        allowDuplicates: true,
    };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this.items = [];

        this.init();
    }

    Plugin.prototype = {
        init: function() { 
            this.$element.css({
                "position": "relative",
                "overflow": "hidden"
            });
        },
        add: function(content) {
            if (!this.allowDuplicates && this.items.indexOf(content) > -1)
                return;

            this.items.push(content);
            var self = this;
            var tickerWidth = this.$element.innerWidth();
            var prevItem = this.$element.find('> span:last'); // see if a previous item already exists
            var prevItemRightBoundPosition = 0;
            
            if (prevItem.length > 0) // if previous item exists, get it's rightmost position plus spacing
                prevItemRightBoundPosition = prevItem.position().left + prevItem.outerWidth() + this.options.spacing;

            var newItem = $('<span>').html(content).css({ // create the new item
                "display": "inline-block",
                "position": "absolute",
                "white-space": "nowrap",
                "text-overflow": "clip",
            });

            this.$element.append(newItem);
            var newItemWidth = newItem.outerWidth(); // add item and get its width
            var startPosition = Math.max(tickerWidth, prevItemRightBoundPosition);            
            var messageTravelDistance = startPosition - (-1 * newItemWidth); // slow the animation by a factor based on the distance it travels in relation to the ticker width
            var speedFactor = messageTravelDistance / tickerWidth; 

            newItem.css({ "left": startPosition })
                .animate({ "left": (-1 * newItemWidth) }, 
                    speedFactor * this.options.duration, 
                    'linear', 
                    function() { 
                        $(this).remove();
                        self.items.shift();
                    });
        }
    };

    $.fn[pluginName] = function(option) {
        var args = arguments;

        return this.each(function () {
            var $this = $(this);
            var data = $.data(this, pluginName);
            var options = typeof option === 'object' && option;

            if (!data)
                $this.data(pluginName, (data = new Plugin(this, options)));

            if (typeof option === "string")
                data[option].apply(data, Array.prototype.slice.call(args, 1));
        });
    };

})(jQuery, window, document);