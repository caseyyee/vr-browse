
var SceneManager = (function() {
	var scenes = [];
	var currentScene = null;
	var newScene = null;
	var sceneIdx = 0;
	var transitioning = false;

	function switchScenes() {
		if (currentScene) {
			transitioning = true;
			$.when( Transition.in(newScene.background)).then(function() {
				currentScene.el.hide();	
				currentScene = newScene;
				currentScene.el.show();			
				$.when( Transition.out() ).then(function() {
					transitioning = false;
				});
			})
		} else { // first run
			currentScene = newScene;
			currentScene.el.show();		
		}
	}
	
	return {
		add: function(scene) {
			scenes.push(scene);
		},
		show: function(name) {
			for (i in scenes) {
				if (scenes[i].name === name) {
					sceneIdx = i;
					newScene = scenes[i];
					switchScenes();
				}
			}
		},
		next: function() {
			if (transitioning)
				return false;

			newScene = scenes[++sceneIdx];
			if (newScene == undefined) {
				sceneIdx = 0;
				newScene = scenes[sceneIdx];
				switchScenes();
			} else {
				switchScenes();
			}
		},
		prev: function() {
			if (transitioning)
				return false;
			
			newScene = scenes[--sceneIdx];
			if (scenes[sceneIdx] == undefined) {
				sceneIdx = scenes.length;
				SceneManager.prev();
			} else {
				switchScenes();
			}
		}
	}

})();

// TRANSITION
var Transition = (function() {
	var panels = 20,
		rounds = 10,
		width = 250,
		container = $('#transition'),
		animDuration = 800,
		animStagger = 100,
		rotPerPanel = 360/panels, 
		rotPerRond = 360/2/rounds,
		zTrans = (width/2) / Math.tan(rotPerPanel * Math.PI/180),
		yRot, xRot,
		visible = false;

	var deg = [90,72,108,54,126,36,144,18,162,0,180,342,198,324,216,306,234,288,252,270];	// transition order

	var globe = document.createElement('div');
	globe.classList.add('transition', 'threed');

	var shapes = [];
	
	for (var i = 0; i < rounds; i++) {
		xRot = rotPerRond * i;
		for (var j = 0; j < panels; j++) {
			yRot = rotPerPanel * j;

     	var div = document.createElement('div');
   
      div.style.transform = 'rotateY('+xRot+'deg) rotateX('+yRot+'deg) translateZ('+zTrans+'px)';
      div.style.width = 0;
      div.style.height = 0;
      div.classList.add('pane','threed', 'pane'+yRot);
      shapes.push(div);
      globe.appendChild(div);
 		}
	}
	container.append(globe)

	return {
		in: function(background) {
			var def = new $.Deferred();
			var time = animDuration+(deg.length*animStagger);

			if (visible)
				def.resolve();

			setTimeout(function() { // should switchout resolving promise by detecting last animation.
				def.resolve();
				visible = true;
			}, time)

			for (var i = 0; i < deg.length; i++) {
				var panes = $('.pane'+deg[i]);
				panes.css('background', background);
				$.Velocity.animate(panes, { 
					width: 200,	// set to same as .pane in css.
					height: 200
				}, {
				 duration: animDuration,
				 delay: animStagger*i
				}); 
			}

			return def.promise();
		},
		out: function() {
			var def = new $.Deferred();
			var time = animDuration+(deg.length*animStagger);

			if (!visible)
				def.resolve();

			setTimeout(function() {
				def.resolve();
				visible = false;
			}, time)


			for (var i = 0; i < deg.length; i++) {
				var panes = $('.pane'+deg[i]);
				
				$.Velocity.animate(panes, { 
					width: 0,	// set to same as .pane in css.
					height: 0
				}, {
				 duration: animDuration,
				 delay: animStagger*i
				}); 
			}

			return def.promise();
		}
	}
})();

// INTRO
$('#intro').on('show', function() {
});

// MUSEUM
$('#museum').on('show', function() {
	// $('#louvre').velocity({
	// 	scaleX: [0, 1],
	// 	scaleY: [0, 1]
	// },
	// {
	// 	duration: 1500,
	// 	delay: 2000,
	// 	easing: "easeOutExpo"
	// });
});

// MARS
$('#mars').on('show', function() {
	// $('.tag').each(function(i) {
	// 	$(this).velocity({
	// 		opacity: 1
	// 	},
	// 	{
	// 		delay: i*200,
	// 		duration: 500,
	// 		delay: 2000
	// 	})
	// });

	
	// $('.chiron-article').css('opacity',0).velocity({
	// 	opacity: 1
	// },
	// {
	// 	duration: 1500,
	// 	delay: 2000,
	// 	easing: "easeOutExpo"
	// });
});



function initGlobe() {
	var slicesY = 10;
	var height = 100;
	var offsetY = height/2*-1;

	var globe = document.querySelector('.globe');
	for (var i = 0; i < slicesY; i++) {
		var div = document.createElement('div');
		var space = i*(height/slicesY);
		
		div.style.transform = 'translate3d(0px, 0px, '+(offsetY+space)+'px) translate(-50%,-50%)';
		div.classList.add('globe-slice','threed');
		div.id='globe'+i;
		globe.appendChild(div);
	}

	var cone = document.querySelector('.cone');
	for (var i = 0; i < slicesY; i++) {
		var div = document.createElement('div');
		var space = i*(height/slicesY);
		
		div.style.transform = 'translate3d(0px, 0px, '+(offsetY+space)+'px) translate(-50%,-50%)';
		div.classList.add('cone-slice','threed');
		div.id='cone'+i;
		cone.appendChild(div);
	}

	var cube = document.querySelector('.cube');
	for (var i = 0; i < slicesY; i++) {
		var div = document.createElement('div');
		var space = i*(height/slicesY);
		
		div.style.transform = 'translate3d(0px, 0px, '+(offsetY+space)+'px) translate(-50%,-50%)';
		div.classList.add('cube-slice','threed');
		div.id='cube'+i;
		cube.appendChild(div);
	}
}

$(document).ready(function() {
	initGlobe();

	SceneManager.add({
		name: 'intro',
		el: $('#intro'),
		background: 'yellow'
	});
	SceneManager.add({
		name: 'museum',
		el: $('#museum'),
		background: '#2a2c43'
	});

	SceneManager.add({
		name: 'puydesancy',
		el: $('#puydesancy'),
		background: '#aed82c'
	});

	SceneManager.add({
		name: 'mars',
		el: $('#mars'),
		background: '#99360e'
	});
	
	SceneManager.show('intro');

  // bind show & hide
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      return el.apply(this, arguments);
    };
  });
})



