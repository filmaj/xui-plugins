/**
 *
 * original code : http://github.com/kanduvisla/iSwipe
 * and from http://github.com/senchalabs/jQTouch
 * 
 *
 */

 
xui.extend({


    swipe : function(callback, opts) {
        
        var defaults = {
            preventDefaultEvents: true,
            swipeMinDistance: 20,
            swipeMaxDistance: 200,
            swipeMinDelay: 50,
            swipeMaxDelay: 1000,
            doubleTapCapture:false,
            doubleTapMinDelay: 50,
            doubleTapMaxDelay: 1000

        };

        var options = {};

        var o = opts ? opts : {};
 

        for ( var key in defaults ){
            options[key]  = o[key] || defaults[key];
        }
 
        return this.each(function() {

            var startTime = null;
            var lastTap = 0;

            var originalCoord = {
                x: 0,
                y: 0
            };
            var finalCoord = {
                x: 0,
                y: 0
            };


            function touchStart(e) {
                startTime = (new Date).getTime();
                originalCoord.x = e.targetTouches[0].clientX;
                originalCoord.y = e.targetTouches[0].clientY;
                finalCoord.x = 0;
                finalCoord.y = 0;
            }

            function touchMove(e) {

                if (options.preventDefaultEvents)
                {
                    e.preventDefault();
                }
                finalCoord.x = e.targetTouches[0].clientX;
                finalCoord.y = e.targetTouches[0].clientY;
 
            }

            function touchEnd(e) {
 
                var coords = {};
                var now = (new Date).getTime();

                
                
                if (options.doubleTapCapture == true ) {

                    var delay = now - lastTap;
                     
                    lastTap = now;

                    if ( ( delay > options.doubleTapMinDelay ) && ( delay < options.doubleTapMaxDelay)){
                        lastTap = 0;
                        coords.delay = delay;
                        coords.doubleTap = true;
                        return callback(e, coords);
                    }
 
                }

                coords.delay = now - startTime;
                
                coords.deltaX = finalCoord.x - originalCoord.x;
                coords.deltaY = originalCoord.y- finalCoord.y;
    
                absX = Math.abs(coords.deltaX);
                absY = Math.abs(coords.deltaY);

                coords.distance = (absX < absY) ? absY : absX;

                coords.direction = (absX < absY) ? ( (coords.deltaY < 0) ? 'down' : 'up' ) : ( ( (coords.deltaX < 0) ? 'left' : 'right' ) );
                
                if ((finalCoord.x+finalCoord.x) == 0)
                    return false;

                if (coords.distance < options.swipeMinDistance)
                    return false;

                if (coords.distance > options.swipeMaxDistance)
                    return false;

                if (coords.delay < options.swipeMinDelay)
                    return false;

                if (coords.delay > options.swipeMaxDelay)
                    return false;

                lastTap = 0;
                coords.doubleTap = false;
                
                return callback(e, coords);
            }
 
            this.addEventListener("touchstart", touchStart, false);
            this.addEventListener("touchmove", touchMove, false);
            this.addEventListener("touchend", touchEnd, false);

        });
    }
}); 