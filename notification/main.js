define([
	"jquery",
	"troopjs-core/component/widget",
	"./notification.html"
	], function($, Widget, tNotification){
 	
 	var CLS_HD = "notify-hd",
 		CLS_BD = "notify-bd",
 		CLS_BT = "notify-bt";


 	function updateHTML(data){
 		this.$title.text(data.title);
 		this.$intro.html(data.intro);
 		this.$bottom.html(data.bottom);
 	};

 	return Widget.extend(function(){
 		var me = this;
 		this.html(null, tNotification, $.Deferred().done(function(){
 			var $el = me.$element;
 			me.$title = $el.find(CLS_HD);
 			me.$intro = $el.find(CLS_BD);
 			me.$bottom = $el.find(CLS_BT)
 		}));
 	},{
 		"hub/show/notification": function(topic, data){
 			updateHTML.call(this, data);
 			location.hash = "openModal";
 		}, 
 		"hub/hide/notification": function(){
 			location.hash = "close";
 		}
 	});
});