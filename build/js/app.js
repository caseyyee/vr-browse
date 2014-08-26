
var SceneManager = (function() {
	var scenes = [];
	var currentScene = null;
	var newScene = null;

	function switchScenes() {
		if (currentScene) {
			$.when( Transition.in()).then(function() {
				currentScene.el.hide();	
				currentScene = newScene;
				currentScene.el.show();			
				Transition.out();
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
					newScene = scenes[i];
					switchScenes();
				}
			}
		}
	}

})();

// TRANSITION
var Transition = (function() {
	var panels = 16,
		rounds = 8,
		width = 200,
		container = $('#transition'),
		animDuration = 1000,
		animStagger = 10,
		rotPerPanel = 360/panels, 
		rotPerRond = 360/2/rounds,
		zTrans = (width/2) / Math.tan(rotPerPanel * Math.PI/180),
		yRot, xRot;

	var globe = document.createElement('div');
	globe.classList.add('transition', 'threed');

	var shapes = [];
	
	for (var i = 0; i < rounds; i++) {
		xRot = rotPerRond * i;
		for (var j = 0; j < panels; j++) {
			yRot = rotPerPanel * j;

     	var div = document.createElement('div');
   
      div.style.transform = 'rotateY('+xRot+'deg) rotateX('+yRot+'deg) translateZ('+zTrans+'px)';
      div.classList.add('pane','threed');
      shapes.push(div);
      globe.appendChild(div);
 		}
	}
	container.append(globe)

	return {
		in: function() {
			var def = new $.Deferred();
			var time = animDuration+(animStagger*shapes.length);

			setTimeout(function() { // should switchout resolving promise by detecting last animation.
				def.resolve();
			}, time)

			for (var i = 0; i < shapes.length; i++) {
				var shape = shapes[i];
				$.Velocity.animate(shape, { 
					width: 97,
					height: 97
				}, {
				 duration: animDuration,
				 delay: animStagger*i
				}); 
			}
			return def.promise();
		},
		out: function() {
			var def = new $.Deferred();
			var time = animDuration+(animStagger*shapes.length);

			setTimeout(function() {
				def.resolve();
			}, time)

			for (var i = shapes.length; i > -1; i--) {
				var shape = shapes[i];
				$.Velocity.animate(shape, { 
					width: 0,
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
	$('#logo').css('opacity',0).velocity({
		rotateY: [360, 90],
		translateY: [0, 150],
		opacity: 1
	},
	{
		duration: 1500,
		delay: 2000,
		easing: "easeOutExpo"
	});
});

// MUSEUM
$('#museum').on('show', function() {
	$('.chiron').css('opacity',0).velocity({
		opacity: 1
	},
	{
		duration: 1500,
		delay: 2000,
		easing: "easeOutExpo"
	});
});

// MARS
$('#mars').on('show', function() {
	$('.chiron-article').css('opacity',0).velocity({
		opacity: 1
	},
	{
		duration: 1500,
		delay: 2000,
		easing: "easeOutExpo"
	});
});



function initGlobe() {
	var slicesY = 10;
	var height = 50;
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
}

$(document).ready(function() {
	initGlobe();

	SceneManager.add({
		name: 'intro',
		el: $('#intro')
	});
	SceneManager.add({
		name: 'museum',
		el: $('#museum')
	});
	SceneManager.add({
		name: 'mars',
		el: $('#mars')
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



