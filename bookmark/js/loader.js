(function(root){
	"use strict";
	var JS_LIB_PRE = "../lib/",
		filesadded = "", //list of files already added
		externalJS = ["qr.js/qr.min.js"];

	function loadjscssfile(filename, filetype){
		if (filetype=="js"){ //if filename is a external JavaScript file
			var fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", filename)
		}
		else if (filetype=="css"){ //if filename is an external CSS file
			var fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", filename)
		}
		if (typeof fileref!="undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	};

	function checkloadjscssfile(filename, filetype){
		if (filesadded.indexOf("["+filename+"]")==-1){
			loadjscssfile(filename, filetype)
			filesadded+="["+filename+"]" //List of files added in the form "[filename1],[filename2],etc"
		}
	};
    
    function generateQRCode(){

    };

    function loadUnit(unit){

    };

	function loadActivity(act){

    };

    for(var len = externalJS.length-1;len--;){
       loadjscssfile(externalJS[len], "js");
    }
    
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
})(window);