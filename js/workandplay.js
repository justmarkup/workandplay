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
		currentstatus = $('currentstatus'),
		time = {
			active: 0,
			work: localStorage.getItem("worktime") || 3000,
			play: localStorage.getItem("playtime") ||900
		},
		active = (timecount.classList.contains('work_active')) || false,
		notification = {
			icon: 'worknplay.ico',
			title: '',
			body: '',
			tag: 'worknplay'
		},
		settings = {
			notification: localStorage.getItem("notification") === "true" ? true : false,
			sound: localStorage.getItem("sound") === "true" ? true : false
		},
		counter,
		count_sec,
		count_min;


		time.active = active ? time.work : time.play;
		slider.work.value = time.work / 60;
		slider.play.value = time.play / 60;

		value.work.innerHTML = ((time.work / 60) > 1) ? Math.floor(time.work / 60) + ' min'  : time.work + ' sec';
		value.play.innerHTML = ((time.play / 60) > 1) ? Math.floor(time.play / 60) + ' min'  : time.play + ' sec';

		timecount.innerHTML = active ? value.work.innerHTML : value.play.innerHTML;

		$('settingNotification').checked = settings.notification;
		$('settingSound').checked = settings.sound;

	console.log(time.work);

	function timer() {

		if (timecount.classList.contains('work_active')) {
			currentstatus.innerHTML = 'Working...';
		}

		if (time.active <= 0) {
			if (timecount.classList.contains('work_active')) {
				timecount.classList.remove('work_active');		
				timecount.classList.add('play_active');
				document.documentElement.classList.add('isplaying');
				time.active = time.play;
				currentstatus.innerHTML = 'Playing...';
				notification.title = 'Time to play';
				notification.body = 'Stand up and relax';
			} else {
				timecount.classList.remove('play_active');
				timecount.classList.add('work_active');
				document.documentElement.classList.remove('isplaying');
				time.active = time.work;
				currentstatus.innerHTML = 'Working...';
				notification.title = 'Back to work';
				notification.body = 'Time to focus';
			}
			if (notify.isSupported && (notify.PERMISSION_GRANTED === notify.permissionLevel()) && settings.notification) {
				notify.createNotification(notification.title, {
					body: notification.body, 
					icon: notification.icon,
					tag: notification.tag
				});
			}
			if (settings.sound) {
				$('audio').play();
			}
			clearInterval(counter);
			counter = setInterval(timer, 1000);
		}

		time.active = time.active-1;


		count_min = Math.floor(time.active / 60);
		count_sec = time.active - (count_min * 60);

		if (count_min > 0) {
			timecount.innerHTML = count_min + "min <br><span>" + count_sec + " sec</span>";
			document.title = count_min + "min " + count_sec + " sec || Work n' Play";
		} else {
			timecount.innerHTML = count_sec + " sec</span>";
			document.title = count_sec + " sec || Work n' Play";
		}

	}

	button.play.addEventListener('click', function () {
		clearInterval(counter);
		counter = setInterval(timer, 1000);
		cycles.className = 'cycles_active';
		if (notify.isSupported && (notify.PERMISSION_DEFAULT === notify.permissionLevel())) {
			notify.requestPermission();
		}
	});

	button.pause.addEventListener('click', function () {
		clearInterval(counter);
		cycles.className = '';	
	});

	slider.work.addEventListener('change', function () {
		value.work.innerHTML = this.value + ' min';
		time.work = this.value * 60;
		localStorage.setItem("worktime", time.work);
		if (timecount.classList.contains('work_active')) {
			time.active = this.value * 60;
		}
	});

	slider.play.addEventListener('change', function () {
		value.play.innerHTML = this.value + ' min';
		time.play = this.value * 60;
		localStorage.setItem("playtime", time.play);
		if (timecount.classList.contains('play_active')) {
			time.active = this.value * 60;
		}
	});

	$('settingNotification').addEventListener('change', function () {
		localStorage.setItem("notification", $('settingNotification').checked);
	});

	$('settingSound').addEventListener('change', function () {
		localStorage.setItem("sound", $('settingSound').checked);
	});

})(document);