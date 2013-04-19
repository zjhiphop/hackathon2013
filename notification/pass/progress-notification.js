define([
	"school-ui-study/util/progress-state",
	"troopjs-core/pubsub/hub",
	window.noti_domain + "/unitpass/unit-notify.js",
	window.noti_domain + "/levelpass/level-notify.js"
	], function(ProState, Hub){
	var TOPIC_UPDATE_PROS = "ef/update/progress",
		TOPIC_SHOW_UNIT_PASS = "show/unit/pass/notify",
		TOPIC_SHOW_LEVEL_PASS = "show/level/pass/notify";

	function update(topic, progress){
		if(!progress) return;
		var levelHasPassed = ProState.hasPassed(progress.levelProgress.state || 0),
			unitHasPassed = ProState.hasPassed(progress.unitProgress.state || 0);
		
		if(levelHasPassed){
			Hub.publish(TOPIC_SHOW_LEVEL_PASS);
		}

		if(unitHasPassed){
			Hub.publish(TOPIC_SHOW_UNIT_PASS);
		}
		
	};

	Hub.subscribe(TOPIC_UPDATE_PROS, Hub, false, update);
});