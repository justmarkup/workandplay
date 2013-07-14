(function (doc) {
	"use strict";

	var $ = function (val) { return doc.getElementById(val);};

	var button = {
			play: $('play'),
			pause: $('pause')
		},
		value = {
			work: $('valuework'),
			play: $('valueplay')
		},
		slider = {
			work: $('slidework'),
			play: $('slideplay')
		},
		timecount = $('timer'),
		cycles = $('cycles'),
		time = {
			active: 1800,
			work: 1800,
			play: 1800
		},
		active = (timecount.className === 'timer work_active') || false,
		notification = {
			icon: 'workandplay.ico',
			title: '',
			body: '',
			tag: 'workandplay'
		},
		counter,
		count_sec,
		count_min;

		time.active = active ? time.work : time.play;
		slider.work.value = time.work / 60;
		slider.play.value = time.play / 60;


	function timer() {
		
		if (time.active <= 0) {
			if (timecount.className === 'timer work_active') {
				timecount.className = 'timer play_active';
				time.active = time.play;
				notification.title = 'play';
				notification.body = 'play text';
				clearInterval(counter);
				counter = setInterval(timer, 1000);
			} else {
				timecount.className = 'timer work_active';
				time.active = time.work;
				notification.title = 'work';
				notification.body = 'work text';
				clearInterval(counter);
				counter = setInterval(timer, 1000);
			}
			if (notify.isSupported && (notify.PERMISSION_GRANTED == notify.permissionLevel())) {
				notify.createNotification(notification.title, {
					body: notification.body, 
					icon: notification.icon,
					tag: notification.tag
				});
			}
	
		}

		time.active = time.active-1;

		count_min = Math.floor(time.active / 60);
		count_sec = time.active - (count_min * 60);

		timecount.innerHTML = count_min + "min <br><span>" + count_sec + " sec</span>";
		document.title = count_min + "min " + count_sec + " sec || Work an Play";
	}

	button.play.addEventListener('click', function () {
		counter = setInterval(timer, 1000);
		cycles.className = 'cycles_active';
		if (notify.isSupported && (notify.PERMISSION_DEFAULT == notify.permissionLevel())) {
			notify.requestPermission();
		}
	});

	button.pause.addEventListener('click', function () {
		clearInterval(counter);
		cycles.className = '';	
	});

	slider.work.addEventListener('change', function () {
		value.work.innerHTML = this.value + 'min';
		time.work = this.value * 60;
		if (active) {
			time.active = this.value * 60;
		}
	});

	slider.play.addEventListener('change', function () {
		value.play.innerHTML = this.value + 'min';
		time.play = this.value * 60;
		if (!active) {
			time.active = this.value * 60;
		}
	});

})(document);