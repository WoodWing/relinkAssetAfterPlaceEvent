#targetengine "session"

//
// test script to relink asset placed directly (by drag and drop) from Elvis/Assets
// to a locally placed image, so CenShare can pick it up
//
// copy the script file either in the general InDesign Scripts Panel folder
// or in the User Scripts Panel folder
//
// easiest way to localise one of the Script Panel folders:
// - open the scripts panel from the main menu (Window/Utilities/Scripts)
// - right click either the Application row or User row in the Scripts panel 
// - choose Reveal in Finder (or the Windows equivalent)
//
// there's no need to restart InDesign, the script will appear in the 
// Scripts Panel automatically
// 
// you can run the script (only when a document is open) by double clicking it
// in the scripts panel




//
// prevent stacking event handlers
//
try {
	app.eventListeners.itemByName('_relinkAssets').remove();
} catch (err) {
	//
}

app.eventListeners.add(
	"afterPlace", 

	function shape_event(myEvent) {

		var idletask = app.idleTasks.add({name:"afterplace_idle_task", sleep:1});
		idletask.addEventListener(IdleEvent.ON_IDLE, 
			function() {
			
				//
				//	remove the idle task so it will not run a second time
				//
				var myIdleTask = app.idleTasks.itemByName("afterplace_idle_task"); 
				if (myIdleTask != null)
					  myIdleTask.remove();
	
				try {
					(function _relinkAssets() {
						// script applies to the active document
						var doc = app.activeDocument;

						// we just scan all the links in this document
						for (var i=0; i<doc.links.length; i++) {
							with (doc.links[i]){
								// for each link, we check if it is an elvis/assets link
								// (elvisId is empty string when it's not an elvis link)
								if (elvisId !== "") {
									// and if it is an elvis link
									// alert(elvisFilePath);
									// we make sure the local copy is up to date
									downloadElvisLink();
									// before we relink to the local copy
									relink(File(elvisFilePath));
								}
							}
						}
					})();



				} catch (err) {
					alert(err);
				}
			}
		);
    },
    false,
	{ name: "_relinkAssets"} 
);






