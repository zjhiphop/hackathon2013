(function(root){
	"use strict";
	var domain = "//schooluxuat.englishtown.com/hackathon2013/libs/",
		QR,
		unitId,
		actId,
		filesadded = "", //list of files already added
		externalJS = ["qr.js/qr.js"];

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
    	var len = externalJS.length-1;

    	while(len >= 0){
            if(filesadded.indexOf(externalJS[len]) === -1) {
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
    
    function start(){
	    if(typeof require === "function"){
			require(["troopjs-core/pubsub/hub"], function(hub){
			   hub.subscribe("load/unit", hub, true, loadUnit);
			   hub.subscribe("load/activity", hub, true, loadActivity);
			});
	    } else {
	    	window.onhashchange = function(){
	    		log("HasChanged: " + arguments);
	    	};
	    }
    };

    for(var len = externalJS.length;len--;){
       checkloadjscssfile(domain + externalJS[len], "js");
    }
})(window);