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
        duration: 5000, // duration in ms
        spacing: 30, // pixel
        pauseOnHover: true,
        allowDuplicates: true
    };

    /**
     * quickTicker plugin object
     * @param {HTMLElement} element The element the plugin is initialized on
     * @param {object} options quickTicker configuration options
     */
    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);

        var self = this;

        var tickerWidth = this.$element.innerWidth();

        var currentlyPaused = false;
        var pausedByUser = false;

        // {Array[function]} functions of jQuery.animate calls (used when new items are added while ticker is paused)
        var animationFunctionQueue = [];

        // {Array[jQuery object]} ticker items being animated
        var tickerItems = [];

        // {Array[string]} ticker items' contents (used for checking for duplicates)
        var tickerItemContents = []; 

        function initialize() {
            self.$element.css({
                "position": "relative",
                "overflow": "hidden"
            });

            if (self.options.pauseOnHover) {
                self.$element.hover(function(e) {
                    pauseQuickTicker();
                }, function(e) {
                    resumeQuickTicker();
                });
            }
        }

        function handleItemAnimation(item) {
            var itemWidth = item.outerWidth();

            var prevItem = tickerItems[tickerItems.length - 1]; // see if a previous item already exists
            var prevItemRightBoundPosition = 0;
            
            if (prevItem) // if previous item exists, get it's rightmost position plus spacing
                prevItemRightBoundPosition = prevItem.position().left + prevItem.outerWidth() + self.options.spacing;

            var startPosition = Math.max(tickerWidth, prevItemRightBoundPosition);            
            var messageTravelDistance = startPosition - (-1 * itemWidth); // slow the animation by a factor based on the distance it travels in relation to the ticker width
            var speedFactor = messageTravelDistance / tickerWidth; 

            item.css({ "left": startPosition });

            animationFunctionQueue.push(function() {
                item.animate({ "left": (-1 * itemWidth) }, 
                    speedFactor * self.options.duration, 
                    'linear', 
                    function() { 
                        $(this).remove();
                        tickerItemContents.shift();
                        tickerItems.shift();
                    });
            });

            if (!currentlyPaused && !pausedByUser) {
                animationFunctionQueue.pop()();
            }
        }

        function resumeAnimation(item) {
            var itemWidth = item.outerWidth();
            var currentPosition = parseInt(item.css('left'));
            var messageTravelDistance = currentPosition - (-1 * itemWidth);
            var speedFactor = messageTravelDistance / tickerWidth;

            item.animate({ "left": (-1 * itemWidth) }, 
                speedFactor * self.options.duration, 
                'linear', 
                function() { 
                    $(this).remove();
                    tickerItemContents.shift();
                    tickerItems.shift();
                });
        }

        function pauseQuickTicker(calledByUser) {
            if (currentlyPaused) return;

            currentlyPaused = true;
            if (calledByUser) pausedByUser = true;

            $.each(tickerItems, function(index, item) {
                $(item).stop(true); // clear animation queue to prevent multiple animations
            });
        }

        function resumeQuickTicker(calledByUser) {
            if (!currentlyPaused || 
                (pausedByUser && !calledByUser)) return; // if a user explicitly called quickTicker.pause(), don't resume. Unless the resume call is made by user.

            currentlyPaused = false;
            if (calledByUser) pausedByUser = false;

            $.each(tickerItems, function(index, item) {
                resumeAnimation($(item));
            });

            while (animationFunctionQueue.length) {
                animationFunctionQueue.pop()();
            }
        }

        /**
         * Adds a new item to be displayed and scrolled in quickTicker
         * @param {string} content The html content to be displayed and scrolled
         */
        Plugin.prototype.add = function(content) {
            if (!this.options.allowDuplicates && tickerItemContents.indexOf(content) > -1)
                return;

            var newItem = $('<span>').html(content).css({ // create the new item
                "display": "inline-block",
                "position": "absolute",
                "white-space": "nowrap",
                "text-overflow": "clip",
            });

            this.$element.append(newItem);
            handleItemAnimation(newItem);

            tickerItemContents.push(content);
            tickerItems.push(newItem);
        };

        /**
         * Pauses the quickTicker marquee
         */
        Plugin.prototype.pause = function() {
            pauseQuickTicker(true);
        };

        /**
         * Resumes the quickTicker marquee
         */
        Plugin.prototype.resume = function() {
            resumeQuickTicker(true);
        };

        // Starting point
        initialize();
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