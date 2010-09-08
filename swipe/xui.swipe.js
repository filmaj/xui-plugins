
xui.extend({


    swipe : function(callback, options) {

        var defaults = {
            preventDefaultEvents: true,
            swipeCapture: true,
            swipeMinDistance: 20,
            swipeMaxDistance: 200,
            swipeMinDelay: 50,
            swipeMaxDelay: 1000,
            doubleTapCapture: false,
            doubleTapMinDelay: 50,
            doubleTapMaxDelay: 1000,
            longTapCapture: false,
            longTapDelay:1000,
            simpleTapCapture: false
        };

        for ( var key in defaults ){
            if(typeof options[key] == "undefined") options[key] = defaults[key];
        }

        if (options.simpleTapCapture) options.doubleTapCapture = false;

        return this.each(function() {

            var startTime = null,
            lastTap = 0,
            longTapTimeOut = null,
            asLongTap = false;

            var originalCoord = {
                x: 0,
                y: 0
            };
            var finalCoord = {
                x: 0,
                y: 0
            };

            function touchStart(e) {

                if ( options.longTapCapture ){

                    window.clearTimeout(longTapTimeOut);
                    asLongTap = false;

                    longTapTimeOut = window.setTimeout(
                        function () {
                            longTapEvent(e)
                        }

                        , options.longTapDelay);
                }

                startTime = (new Date).getTime();
                originalCoord.x = e.targetTouches[0].clientX;
                originalCoord.y = e.targetTouches[0].clientY;
                finalCoord.x = 0;
                finalCoord.y = 0;

            }


            function longTapEvent(e) {

                asLongTap = true;
                lastTap = 0;
                var coords = {};

                coords.type = 'longtap';
                return callback(e, coords);

            }


            function clickTap(e) {

                if (options.longTapCapture)
                {
                    window.clearTimeout(longTapTimeOut);
                }
                var coords = {};

                coords.type = 'simpletap';
                return callback(e, coords);

            }



            function touchMove(e) {

                if (options.preventDefaultEvents)
                {
                    e.preventDefault();
                }

                if (options.longTapCapture)
                {
                    window.clearTimeout(longTapTimeOut);
                }


                finalCoord.x = e.targetTouches[0].clientX;
                finalCoord.y = e.targetTouches[0].clientY;


            }

            function touchEnd(e) {

                if (options.preventDefaultEvents)
                {
                    e.preventDefault();
                }

                if (options.longTapCapture)
                {
                    window.clearTimeout(longTapTimeOut);
                    if (asLongTap)
                    {
                        return false;
                    }
                }

                var coords = {};
                var now = (new Date).getTime();

                if ( options.doubleTapCapture ) {

                    var delay = now - lastTap;

                    lastTap = now;

                    if ( ( delay > options.doubleTapMinDelay ) && ( delay < options.doubleTapMaxDelay)){
                        lastTap = 0;
                        coords.delay = delay;
                        coords.type = 'doubletap';
                        return callback(e, coords);
                    }

                }

                if (options.swipeCapture) {

                    coords.delay = now - startTime;

                    coords.deltaX = finalCoord.x - originalCoord.x;
                    coords.deltaY = originalCoord.y- finalCoord.y;

                    absX = Math.abs(coords.deltaX);
                    absY = Math.abs(coords.deltaY);

                    coords.distance = (absX < absY) ? absY : absX;

                    coords.direction = (absX < absY) ? ( (coords.deltaY < 0) ? 'down' : 'up' ) : ( ( (coords.deltaX < 0) ? 'left' : 'right' ) );

                    if (
                        ((finalCoord.x+finalCoord.x) != 0)


                        && (coords.distance > options.swipeMinDistance)


                        && (coords.distance < options.swipeMaxDistance)


                        && (coords.delay > options.swipeMinDelay)


                        && (coords.delay < options.swipeMaxDelay)
                        ) {

                        lastTap = 0;

                        coords.type = 'direction';

                        return callback(e, coords);
                    }
                }

                if (options.simpleTapCapture)
                    clickTap(e)



            }

            this.addEventListener("touchstart", touchStart, false);

            if (options.swipeCapture)
                this.addEventListener("touchmove", touchMove, false);

            this.addEventListener("touchend", touchEnd, false);

        });
    }
});