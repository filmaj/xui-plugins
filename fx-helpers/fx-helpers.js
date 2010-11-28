xui.extend({
   fade:function(to, callback) {
       var target = 0;
       if (typeof to == 'string') {
           if (to == 'in') target = 1;
       } else if (to) target = 1;
       this.tween({opacity:to,duration:.2}, callback);
   } 
});