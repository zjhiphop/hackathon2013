define([
	"underscore",
	"troopjs-core/pubsub/hub",
	window.noti_domain + "/level-mock-data.js",
	window.noti_domain + "/level-pass.html"	],
	 function(_, Hub, Data, tLevelPass){

	var TOPIC_SHOW_NOTIFICATION = "show/notification",
		TOPIC_LEVEL_PASS_NOTIFY = "show/level/pass/notify",
		TOPIC_LOAD_LEVEL = "load/level";

	function levelPassHandler(topic){
		Hub.publish(TOPIC_SHOW_NOTIFICATION, Data);
	};

	function loadLevel(topic, level){
		if(!level) return;
		//Build template html
		
	};

	Hub.subscribe(TOPIC_LOAD_LEVEL, Hub, false, loadUnit);
	Hub.subscribe(TOPIC_LEVEL_PASS_NOTIFY, Hub, false, levelPassHandler);
});