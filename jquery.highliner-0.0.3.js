/*!
 * jQuery Highliner v0.0.3
 * http://jbaron.gr/
 *
<<<<<<< HEAD
 * Copyright 2010-2011, Ioannis Barounis
=======
 * Copyright 2010-2014, Ioannis Barounis
>>>>>>> 13e00fa11e1247de468950882e0383711826295c
 *
 * Demo at: http://jbaron.gr/programming/jquery-highliner/
 *
 * Creation Date: 27 9 2010
 * First Release Date: 16 10 2010
 * Last Modification Date: 28 12 2013 
 *
 * ChangeLog v0.0.3:
 * 	Added rememberSpaceLine option so highliner can remember space between panels after starting / terminating effect.
 * 	Added defaultSpaceLine option so you can set how big will be the space between panels after starting effect.
 * 	Added cursor actions. When you place the cursor on the left or the right side of your browsers screen then you can make space bigger or smaller.
 * 	Added classes options for top and bottom panel.
 *  Removed selectorid option.
 *	Fixed some bugs causing effect not working on Internet Explorer 7 , 8.
 *	Better code, better performance, quicker.
 *
*/
/*
How to use:

$(function(e){	
	$.highliner(e);
});

$.highliner (e,{showspeed:150,hidespeed:1000,opacity:0.8});
$.highliner (e,{showspeed:150,hidespeed:1000,opacity:0.8,closeOnEsc:false},function(){alert("Hello");});
$.highliner (e,{bgcolor:"red",hidespeed:1000,opacity:0.8},function(){alert("Hello");});
*/
(function ($){
 $.extend({
	highliner :function(e,options,callbackFnk) {
		var defaults={
			showspeed:100,
			hidespeed:1000,
			spacerDisplay:true,
			spacerClass:null, //define your class in your css , ex: .cursorspacer{margin-right:50px} .cursorspacer a{cursor:pointer;color:navy;} .cursorspacer a:hover{color:red;}
			spacerPlace:"left", //left or right
			spacerOpacity:1,

			topPanelClass:null,
			bottomPanelclass:null,

			defaultSpaceLine:20,
			rememberSpaceLine:true, //Remembers space between panels
			bgcolor: "#000", //define a background color for the effect
			opacity: 0.6, //define the opacity of the effect
	
			cursorSideActions:true, // If you place your cursor on the left side of your browsers screen then the space gets bigger, on the right gets smaller.
			cursorSideActionsOffset:5, // Offset for cursorSideActions.
			cursorSideActionsReverse:false, // Reverse side actions.
	
			closeOnEsc: true //stops effect after pressing Esc button
		};  
		var options = $.extend(defaults, options);

		var	selectorid="_highliner003";
		var spaceline = options.rememberSpaceLine ? ( $(window).data('highlinerspaceline') ? $(window).data('highlinerspaceline') : options.defaultSpaceLine ) : options.defaultSpaceLine;
		var sdivtop="top"+selectorid,sdivbottom="bottom"+selectorid,sdivspacer="spacer"+selectorid,sdivclose="close"+selectorid,sdivplus="plus"+selectorid,sdivminus="minus"+selectorid;

		if($(window).data(selectorid)) return;
		$(window).data(selectorid,1);

		$('body').append($("<div id='"+sdivtop+"'></div><div id='"+sdivbottom+"'></div>"));
	
		if(options.spacerDisplay){
			$('body').append($("<div id='"+sdivspacer+"'></div>"));
			$divspacer=$('#'+sdivspacer);
			options.spacerPlace=="left" ? $divspacer.append("<a id='"+sdivclose+"'>x</a> | <a id='"+sdivminus+"'>-</a> <a id='"+sdivplus+"'>+</a>") : $divspacer.append("<a id='"+sdivplus+"'>+</a> <a id='"+sdivminus+"'>-</a> | <a id='"+sdivclose+"'>x</a>");
			$divplus=$('#'+sdivplus);
			$divminus=$('#'+sdivminus);
			$divclose=$('#'+sdivclose);
		}
		$divtop=$('#'+sdivtop);
		$divbottom=$('#'+sdivbottom);

		$default_style={display:"scroll",position:"fixed",left:"0%",width:"100%","background-color":options.bgcolor,opacity:options.opacity,border:"black solid 1px","-moz-box-shadow":"0 0 10px #000","-webkit-box-shadow":"0 0 10px #000","box-shadow":"0 0 10px #000"};
		options.topPanelClass ? $divtop.css({display:"scroll",position:"fixed",left:"0%",top:"0%",width:"100%"}).addClass(options.topPanelClass):$divtop.css({top:"0%"}).css($default_style);
		options.bottomPanelClass ? $divbottom.css({display:"scroll",position:"fixed",left:"0%",bottom:"0%",width:"100%"}).addClass(options.bottomPanelClass):$divbottom.css({bottom:"0%"}).css($default_style);

		if(options.spacerDisplay){
			if(options.spacerClass) $divspacer.css({display:"scroll",position:"fixed",left:"10px"}).addClass(options.spacerClass); else $divspacer.css({display:"scroll",position:"fixed",left:"10px","background-color":"#fff",padding:"0px 5px 0px 5px",opacity:options.spacerOpacity,border:"black solid 1px","-moz-border-radius":"5px","-webkit-border-radius":"5px","border-radius":"5px"});
			$divplus.add($divminus).add($divclose).css({cursor:"pointer"});
			options.spacerPlace=="left" ? $divspacer.css({top: e.clientY-$divspacer.height()+10}) : $divspacer.css({top: e.clientY-$divspacer.height()+10,left:$(window).width()-$divspacer.width()-20});
			$divplus.click(function(e){spaceLineHandler('plus'); dstuff(e);});
			$divminus.click(function(e){spaceLineHandler('minus');dstuff(e);});
			$divclose.click(function(){closeHighliner();});
		}

		$divtop.animate({height: e.clientY-spaceline},options.showspeed);
		$divbottom.animate({height: $(window).height()-e.clientY-spaceline},options.showspeed);
		if(options.spacerDisplay)$divspacer.animate({top: e.clientY-$divspacer.height()+10},options.showspeed);

		$(document).bind('mousemove',function(e){
		if(options.cursorSideActions){
			if(!options.cursorSideActionsReverse){
				if(e.clientX <= options.cursorSideActionsOffset) spaceLineHandler('plus');
				if(e.clientX >= $(window).width()-options.cursorSideActionsOffset) spaceLineHandler('minus');
			} else {
				if(e.clientX <= options.cursorSideActionsOffset) spaceLineHandler('minus');
				if(e.clientX >= $(window).width()-options.cursorSideActionsOffset) spaceLineHandler('plus');
			}
		}
		dstuff(e);
		});

		function spaceLineHandler(value){
			switch(value){
				case 'plus': if(spaceline>200)spaceline=200; else spaceline+=10; break;
				case 'minus': if(spaceline<20)spaceline=20; else spaceline-=10; break;
			}
			$(window).data('highlinerspaceline',spaceline);
		}

		function dstuff(e){
			$divtop.css({height: e.clientY-spaceline});
			$divbottom.css({height: $(window).height()-e.clientY-spaceline});
			if(options.spacerDisplay)$divspacer.css({top: e.clientY-$divspacer.height()+10});
		}

		function closeHighliner(){
			$(document).unbind('mousemove');
			if(options.closeOnEsc){$(document).unbind('keyup');}
			if(options.spacerDisplay) $divspacer.remove();
			$divtop.slideUp(options.hidespeed,function(){$(this).remove();});
			$divbottom.slideUp(options.hidespeed,function(){$(this).remove();});
			$(window).removeData(selectorid);
			if(!options.rememberSpaceLine) $(window).removeData('highlinerspaceline');
		}

		if(options.closeOnEsc){ $(document).keyup(function(e) { if(e.keyCode==27) closeHighliner(); });}

		if($.isFunction(callbackFnk)) callbackFnk.call(this);
	}
});
})(jQuery);
