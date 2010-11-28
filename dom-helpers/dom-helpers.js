xui.extend({
   remove:function() {
        this.each(function(el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
   }
});