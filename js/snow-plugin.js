// JavaScript Document

(function($){
	var $window = window,
		$timeout = setTimeout;
		
	window.Snow = function(element, settings) {
		this.settings = settings, 
		this.flakes = [], 
		this.flakeCount = settings.count, 
		this.mx = -100, 
		this.my = -100,
		function() {
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				$timeout(callback, 1e3 / 60)
			};
			$window.requestAnimationFrame = requestAnimationFrame
		}(), 
		this.init(element)
	};
	Snow.prototype.init = function(element) {
		this.canvas = element.get(0), this.ctx = this.canvas.getContext("2d"), this.canvas.width = $window.innerWidth, this.canvas.height = $window.innerHeight, this.flakes = [];
		for (var i = 0; i < this.flakeCount; i++) {
			var x = Math.floor(Math.random() * this.canvas.width),
				y = Math.floor(Math.random() * this.canvas.height),
				size = Math.floor(100 * Math.random()) % this.settings.size + 2,
				speed = Math.floor(100 * Math.random()) % this.settings.speed + Math.random() * size / 10 + .5,
				opacity = .5 * Math.random() + this.settings.opacity;
			this.flakes.push({
				speed: speed,
				velY: speed,
				velX: 0,
				x: x,
				y: y,
				size: size,
				stepSize: Math.random() / 30,
				step: 0,
				angle: 180,
				opacity: opacity
			})
		}
		1 == this.settings.interaction && this.canvas.addEventListener("mousemove", function(e) {
			this.mx = e.clientX, this.my = e.client
		});
		var thiz = this;
		$($window).resize(function() {
			thiz.ctx.clearRect(0, 0, thiz.canvas.width, thiz.canvas.height), thiz.canvas.width = $window.innerWidth, thiz.canvas.height = $window.innerHeight
		});
		if(typeof this.settings.image === "string") {
			this.image = $("<img src='imgs/" + this.settings.image + "' style='display: none'>");
		};
		
		this.snow();
	}, Snow.prototype.snow = function() {
		var thiz = this,
			render = function() {
				thiz.ctx.clearRect(0, 0, thiz.canvas.width, thiz.canvas.height);
				for (var i = 0; i < thiz.flakeCount; i++) {
					var flake = thiz.flakes[i],
						x = thiz.mx,
						y = thiz.my,
						minDist = 100,
						x2 = flake.x,
						y2 = flake.y,
						dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
					if (minDist > dist) {
						var force = minDist / (dist * dist),
							xcomp = (x - x2) / dist,
							ycomp = (y - y2) / dist,
							deltaV = force / 2;
						flake.velX -= deltaV * xcomp, flake.velY -= deltaV * ycomp
					} else
						switch (flake.velX *= .98, flake.velY <= flake.speed && (flake.velY = flake.speed), thiz.settings.windPower) {
							case !1:
								flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
								break;
							case 0:
								flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
								break;
							default:
								flake.velX += .01 + thiz.settings.windPower / 100
						}
					if (flake.y += flake.velY, flake.x += flake.velX, (flake.y >= thiz.canvas.height || flake.y <= 0) && thiz.resetFlake(flake), (flake.x >= thiz.canvas.width || flake.x <= 0) && thiz.resetFlake(flake), 0 == thiz.settings.image) {
						var grd = thiz.ctx.createRadialGradient(flake.x, flake.y, 0, flake.x, flake.y, flake.size - 1);
						grd.addColorStop(0, thiz.settings.startColor), grd.addColorStop(1, thiz.settings.endColor), thiz.ctx.fillStyle = grd, thiz.ctx.beginPath(), thiz.ctx.arc(flake.x, flake.y, flake.size, 0, 2 * Math.PI), thiz.ctx.fill()
					} else
						thiz.ctx.drawImage(thiz.image.get(0), flake.x, flake.y, 2 * flake.size, 2 * flake.size)
				}
				$window.cancelAnimationFrame(render), $window.requestAnimationFrame(render)
			};
		render()
	}, Snow.prototype.resetFlake = function(flake) {
		if (0 == this.settings.windPower || 0 == this.settings.windPower)
			flake.x = Math.floor(Math.random() * this.canvas.width), flake.y = 0;
		else if (this.settings.windPower > 0) {
			var xarray = Array(Math.floor(Math.random() * this.canvas.width), 0),
				yarray = Array(0, Math.floor(Math.random() * this.canvas.height)),
				allarray = Array(xarray, yarray),
				selected_array = allarray[Math.floor(Math.random() * allarray.length)];
			flake.x = selected_array[0], flake.y = selected_array[1]
		} else {
			var xarray = Array(Math.floor(Math.random() * this.canvas.width), 0),
				yarray = Array(this.canvas.width, Math.floor(Math.random() * this.canvas.height)),
				allarray = Array(xarray, yarray),
				selected_array = allarray[Math.floor(Math.random() * allarray.length)];
			flake.x = selected_array[0], flake.y = selected_array[1]
		}
		flake.size = Math.floor(100 * Math.random()) % this.settings.size + 2, flake.speed = Math.floor(100 * Math.random()) % this.settings.speed + Math.random() * flake.size / 10 + .5, flake.velY = flake.speed, flake.velX = 0, flake.opacity = .5 * Math.random() + this.settings.opacity
	};
	
	$.fn.snow = function(){
		$(this).each(function(i, e) {
			var scope = {};
			$.each(e.attributes,function(index, key) {
				scope[ $.camelCase(key.name) ] = Number.isFinite( Number(key.value) ) ? Number(key.value) : key.value
			});
			if ( typeof scope.image === "string" && scope.image === "false" ) {scope.image = false};
			
			new Snow($(e), {
				speed: 1||0,
				interaction: scope.interaction||!0,
				size: scope.size||2,
				count: scope.count||200,
				opacity: scope.opacity||1,
				startColor: scope.startColor||"rgba(255,255,255,1)",
				endColor: scope.endColor||"rgba(255,255,255,0)",
				windPower: scope.windPower||0,
				image: scope.image||!1
			});
		});
	}
})(jQuery);