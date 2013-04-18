define([
	"troopjs-core/pubsub/hub",
	"./unit-mock-data",
	"qr"
	], function(Hub, Data, QR){

	var TOPIC_SHOW_NOTIFICATION = "show/notification",
		TOPIC_UNIT_PASS_NOTIFY = "show/unit/pass/notify",
		TOPIC_LOAD_UNIT = "load/unit";

	function unitPassHandler(topic){
		Hub.publish(TOPIC_SHOW_NOTIFICATION, Data);
	};

	function loadUnit(topic, unit){
		if(!unit) return;
		var info = Data.partyId + "," + unit.id;
		
		Data.bottom = qr.image({
		      level: 'H'
		    , size: 4
		    , value: info
		});
	};

	Hub.subscribe(TOPIC_LOAD_UNIT, Hub, false, loadUnit);
	Hub.subscribe(TOPIC_UNIT_PASS_NOTIFY, Hub, false, unitPassHandler);
});