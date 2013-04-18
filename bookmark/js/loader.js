(function(root){
	"use strict";
	var JS_LIB_PRE = "../lib/",
		unitId,
		actId,
		loaded = [],
		filesadded = "", //list of files already added
		externalJS = ["qr.js/qr.min.js"];

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
				console.log(filename + " is loaded!")	
			}

			fileref.onerror = function(){
				console.log(filename + " failed to load!!!")	
			}
		}
	};

	function checkloadjscssfile(filename, filetype){
		if (filesadded.indexOf("["+filename+"]")==-1){
			loadjscssfile(filename, filetype)
			filesadded+="["+filename+"]" //List of files added in the form "[filename1],[filename2],etc"
		}
	};

    function generateQRCode(type){
    	var info = [unitId, actId].join(","),
    		type = type || "img";
    	
    	try{
    		switch(type){
    			"img": break;
    			"canvas": break;
    			"dataURL": break;
    			default: break;
    		}
    	} catch(e){
    		console.log(e);
    	}
    	
    };

    function loadUnit(unit){
    	if(!unit) return;

     	unitId = unitId.id;
		generateQRCode();
    };

	function loadActivity(act){
		if(!act) return;

		actId = act.id;
		generateQRCode();
    };

    function onReady(){
    	var len = externalJS.length;

    	while(--len){
            if(loaded[externalJS[len]]) {
            	return;
			}
    	}

    	start();
    };

    for(var len = externalJS.length-1;len--;){
       loadjscssfile(externalJS[len], "js");
    }
    
    function start(){
	    if(typeof require === "function"){
			require(["troopjs-core/pubsub/hub"], function(){
			   hub.subscribe("load/unit", hub, true, loadUnit);
			   hub.subscribe("load/activity", hub, true, loadActivity);
			});
	    } else {
	    	window.onhashchange = function(){
	    		console.log("HasChanged: " + arguments);
	    	};
	    }
    };

})(window);