var __defined_scripts = document.getElementsByTagName('script');
var __current_script = __defined_scripts[ __defined_scripts.length - 1].src;

class GaugeIndicator {
    
    constructor(nodeId) {
	this.nodeId=nodeId;
	this.node=jQuery("#"+nodeId);
	this.indicatorId=this.nodeId+"-indicator";
	this.warningIconId=this.nodeId+"-warning-icon";
	this.currentFolder=__current_script.match(/.*\//)[0];
	this.iconPath=this.currentFolder+"engine_warning_icon.svg";
	this.node.html(this.buildSvg());
    }

    /* v deve essere un float compreso tra 0 e 100 */
    setValue(v) {
	if(!this.isInt(v)) {
	    return;
	}

	v=Math.max(0,v);
	v=Math.min(100,v);

	v=Math.round(v*180/100);
	
	self=this;
	this.node.find("#"+self.indicatorId).animate(
	    {r: v},
	    {
		duration: 400,
		easing: "easeOutBack",
		step: function(currentValue,tween) {
		    jQuery("#"+self.indicatorId).attr("transform","rotate("+currentValue+")");
		    /* 
		       la funzione di easing potrebbe far andare il valore oltre quello
		       definitivo. quindi mostra l'icona di prodotto da sostituire solo
		       se anche il valore finale è maggiore di 180*0.8=144
		    */
		    var showIcon=(v>144 && currentValue>144);
		    jQuery("#"+self.warningIconId).css('visibility', showIcon ? "visible" : "hidden");
		}
	    });
    }

    buildSvg() {
	return `
	   <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="-70 -120 130 150">
             <defs>
               <linearGradient id="${this.nodeId}-green-yellow" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
                   <stop offset="0%" stop-color="#006400"/>   
                   <stop offset="100%" stop-color="#FFD700"/>   
               </linearGradient>
               <linearGradient id="${this.nodeId}-yellow-orange" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stop-color="#FFD700"/>
	           <stop offset="100%" stop-color="#FFA500"/>   
               </linearGradient>
               <linearGradient id="${this.nodeId}-orange-red" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
	         <stop offset="0%" stop-color="#FFA500"/>   
                 <stop offset="20%" stop-color="#FF8C00"/>
	         <stop offset="40%" stop-color="#FF3000"/>   
                 <stop offset="100%" stop-color="#FF0000"/>
               </linearGradient>
	     </defs>

             <path d="
		 M -100 0
		 A 100 100 0 0 1 -49.4 -86.8
		 " stroke="url(#${this.nodeId}-green-yellow)" fill="none" stroke-width="20" />

	    <path d="
		 M -50 -86.602
		 A 100 100 0 0 1 50 -86.602
                 " stroke="url(#${this.nodeId}-yellow-orange)"  fill="none" stroke-width="20" />
	    <path d="
		 M 49.6 -87
		 A 100 100 0 0 1 100 0
                 " stroke="url(#${this.nodeId}-orange-red)"  fill="none" stroke-width="20"  />

	    <image id="${this.warningIconId}" x="-20" y="-70" width="40" height="40" href="${this.iconPath}" style="visibility: hidden" />

	    <g id="${this.indicatorId}">
	      <path d="
		   M 0 4
		   L -100 0
		   L 0 -4
		   Z
		   " fill="red"/>
	     <circle cx="0" cy="0" r="7" fill="black" />
	   </g>
        </svg>
	`;
    }

    isInt(value) {
	return !isNaN(value) && 
            parseInt(Number(value)) == value && 
            !isNaN(parseInt(value, 10));
    }
    
}

