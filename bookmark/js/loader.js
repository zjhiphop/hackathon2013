(function(root){
	"use strict";

	var domain = "http://schooluxuat.englishtown.com/hackathon2013/",
		LIB = "libs/",
		NOTI = "notification",
		QR,
		unitId,
		actId,
		filesadded = "", //list of files already added
		externalRes = [LIB + "qr.js/qr.js"];

	window.noti_domain = domain + NOTI;

    function log(){
    	console && console.log && console.log(arguments);
    };

	function loadjscssfile(filename, filetype){

		if (filetype=="js"){ //if filename is a external JavaScript file
			var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", filename);
		}
		else if (filetype=="css"){ //if filename is an external CSS file
			var fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}        

		if (typeof fileref!="undefined"){
			document.getElementsByTagName("head")[0].appendChild(fileref);
			fileref.onload = function(){
				onReady();
				log(filename + " is loaded!")	
			}

			fileref.onerror = function(){
				log(filename + " failed to load!!!")	
			}
		}
	};

	function checkloadjscssfile(filename, filetype){
		if (filesadded.indexOf("["+filename+"]")==-1){
			loadjscssfile(filename, filetype);
			filesadded+="["+filename+"]" //List of files added in the form "[filename1],[filename2],etc"
		}
	};

	function adjustStyle(img){
		if(!img) return;

		img.setAttribute("style", "position:fixed; cursor:move; top:60px; right:20px; z-index:10000;");
		jQuery && jQuery(img).draggable();
	};

    function generateQRCode(type){
    	if(!unitId && !actId) return;

    	var info = [unitId, actId].join(","),
    		type = type || "img";

    	log(unitId, actId);
    	try{
    		switch(type){
    			case "img": 
					var image = QR.image({
						  level: 'H'
						, size: 5
						, value: info
					}),
						imgId = "qr-img",
						oldImg;

					
					// Check image was returned (may not have been if browser doesn't support the
					// HTML5 canvas element)
					if (image) {
						if(oldImg = document.getElementById(imgId)){
							oldImg.src = image.src;
						} else {
							image.setAttribute("id", imgId);
							adjustStyle(image);
							// Add image to page
							document.body.appendChild(image);
						}
					}

    				log("generateQRCode, type: img" , image);
    				break;
    			case "canvas": 
    				log("generateQRCode, type: canvas");
    				break;
    			case "dataURL": 
    				log("generateQRCode, type: dataURL");
    				break;
    			default: break;
    		}

    	} catch(e){
    		log(e);
    	}
    	
    };

    function loadUnit(topic, unit){

    	log(unit);
     	unitId = unit && unit.id;
		generateQRCode();
    };

	function loadActivity(topic, act){

		log(act);
		actId = act && act.id;
		generateQRCode();

    };

    function onReady(){
    	var len = externalRes.length-1;

    	while(len >= 0){
            if(filesadded.indexOf(externalRes[len]) === -1) {
            	return;
			}
			len--;
    	}

    	if(typeof require === "function"){
    		require(["qr"], function(qr){
    			QR = qr;
    			start();
    		});
    	} else {
    		QR = qr;
    	}
    };

    function showFancy(url, sets){
        var Fancybox = $.fancybox; // headerfooter project will overwrite the shim config of fancybox, it export $.fancybox

        Fancybox.init();

        setTimeout(function(){
            Fancybox(
                {
                    type: "iframe",
                    href: url,
                    width: sets.width,//780,
                    height: sets.height,//"95%", //this height is the same as unit(4 lessons) view's height
                    padding: 0,
                    margin: 0,
                    speedIn: 600,
                    speedOut: 200,
                    hideOnOverlayClick: false,
                    onComplete: function(currentArray, currentIndex, currentOpts) {

                    }
                });
        });
    };

    function start(){
	    if(typeof require === "function"){
			require(["troopjs-core/pubsub/hub", "school-ui-study/util/progress-state"], 
                function(hub, ProState){
                   var TOPIC_UPDATE_PROS = "ef/update/progress";

    			   hub.subscribe("load/unit", hub, true, loadUnit);
    			   hub.subscribe("load/activity", hub, true, loadActivity);

                   hub.subscribe("party/unit/passed", hub, true, function(){
                        showFancy((domain + "party/unit/index.html"), {width: 500, height: 500});                      
                   });
                   
                   hub.subscribe("party/level/passed", hub, true, function(){
                        showFancy((domain + "party/level/index.html"), {width: 780, height: "95%"});                      
                   });

                   function update(topic, progress){
                        if(!progress) return;
                        var levelHasPassed = ProState.hasPassed(progress.levelProgress.state || 0),
                            unitHasPassed = ProState.hasPassed(progress.unitProgress.state || 0);

                        if(levelHasPassed){
                            showFancy((domain + "party/level/index.html"), {width: 780, height: "95%"});
                        }

                        if(unitHasPassed){
                            showFancy((domain + "party/unit/index.html") , {width: 500, height: 500});   
                        }
                    };

                    hub.subscribe(TOPIC_UPDATE_PROS, hub, false, update);

                    var show_party = "<button style='float: right;  margin: 0 5px;' class='ets-btn ets-btn-shadowed ets-btn-purple'><span>Show Party</span></button>";
                    var show_party_feedback = "<button style='float: right; margin: 0 5px;' class='ets-btn ets-btn-shadowed ets-btn-purple'><span>Show Party Feedback</span></button>";
                    $(show_party).click(function(){
                        hub.publish("party/unit/passed");
                    }).appendTo(".ets-ui-unit-hd").draggable();

                    $(show_party_feedback).click(function(){
                        hub.publish("party/level/passed");
                    }).appendTo(".ets-ui-unit-hd").draggable();

    			});


			//require((domain + NOTI + "main.js"));
	    } else {
	    	window.onhashchange = function(){
	    		log("HasChanged: " + arguments);
	    	};
	    }

    };

    for(var len = externalRes.length;len--;){
       var type = externalRes[len].indexOf(".css") > -1 ? "css" : "js";
       checkloadjscssfile(domain + externalRes[len], type);
    }
})(window);