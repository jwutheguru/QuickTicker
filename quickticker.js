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
        pauseOnHover: false,
        allowDuplicates: true
    };

    function Plugin(element, options) {
        var self = this;
        var currentlyPaused = false;
        var animationQueue = [];
        var itemContents = [];
        var items = [];

        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);

        function initialize() {
            self.$element.css({
                "position": "relative",
                "overflow": "hidden"
            });

            if (self.options.pauseOnHover) {
                self.$element.hover(function(e) {
                    currentlyPaused = true;

                    $.each(items, function(index, item) {
                        $(item).stop();
                    });
                }, function(e) {
                    currentlyPaused = false;

                    $.each(items, function(index, item) {
                        resumeAnimation($(item));
                    });

                    while (animFunc = animationQueue.pop()) {
                        animFunc();
                    }
                });
            }
        }

        function handleItemAnimation(item) {
            var itemWidth = item.outerWidth();            
            var tickerWidth = self.$element.innerWidth();

            var prevItem = self.$element.find('> span:last'); // see if a previous item already exists
            var prevItemRightBoundPosition = 0;
            
            if (prevItem.length > 0) // if previous item exists, get it's rightmost position plus spacing
                prevItemRightBoundPosition = prevItem.position().left + prevItem.outerWidth() + self.options.spacing;

            var startPosition = Math.max(tickerWidth, prevItemRightBoundPosition);            
            var messageTravelDistance = startPosition - (-1 * itemWidth); // slow the animation by a factor based on the distance it travels in relation to the ticker width
            var speedFactor = messageTravelDistance / tickerWidth; 

            item.css({ "left": startPosition });

            animationQueue.push(function() {
                item.animate({ "left": (-1 * itemWidth) }, 
                    speedFactor * self.options.duration, 
                    'linear', 
                    function() { 
                        $(this).remove();
                        itemContents.shift();
                        items.shift();
                    });
            });

            if (!currentlyPaused) {
                animationQueue.pop()();
            }
        }

        initialize();

        Plugin.prototype.add = function(content) {
            if (!this.options.allowDuplicates && itemContents.indexOf(content) > -1)
                return;

            var newItem = $('<span>').html(content).css({ // create the new item
                "display": "inline-block",
                "position": "absolute",
                "white-space": "nowrap",
                "text-overflow": "clip",
            });

            handleItemAnimation(newItem);
            this.$element.append(newItem);

            itemContents.push(content);
            items.push(newItem);
        };
    }

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