require([
	"jquery",
	"troopjs-core/pubsub/hub",
	window.noti_domain + "/notification.html",
	window.noti_domain + "/pass/progress-notification.js"
	], function($, Hub, tNotification){
 	
 	var CLS_HD = "notify-hd",
 		CLS_BD = "notify-bd",
 		CLS_BT = "notify-bt";

 	var $title ,
 		$intro ,
 		$bottom ;


 	function updateHTML(data){
 		this.$title.text(data.title);
 		this.$intro.html(data.intro);
 		this.$bottom.html(data.bottom);
 	};

 	function show(data){
 		updateHTML.call(this, data);
 		//show
 	};

 	function hide(){

 	};

 	function init(){
 		
 		var $el = $('<div class="party-notify"></div>').html(tNotification).appendTo('body');
		$title = $el.find(CLS_HD);
		$intro = $el.find(CLS_BD);
		$bottom = $el.find(CLS_BT)
		
		Hub.subscribe("show/notification", Hub, false, loadUnit);
 		Hub.subscribe("hide/notification", Hub, false, loadUnit);
 	};
});