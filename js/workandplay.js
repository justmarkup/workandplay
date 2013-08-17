(function (doc) {
	"use strict";

	// TODO show message for old browser
	if (!!'querySelector' in document && !!'localStorage' in window && !!'addEventListener' in window && !!'Audio' in window) {
		return;
		// TODO show message for old browser
	}

	var $ = function (val) { return doc.getElementById(val);};

	var button = {
			play: $('play'),
			reset: $('reset')
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
		audio = new Audio(),
		audio_ogg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') != "",
		cycle_height = parseInt(window.getComputedStyle(document.querySelector('.cycle_one'),null).getPropertyValue("height"), 10),
		cycle_before = $('cycle_one_inner'),
		currentstatus = $('currentstatus'),
		time = {
			current: 0,
			active: 0,
			work: localStorage.getItem("worktime") || 3000,
			play: localStorage.getItem("playtime") || 900
		},
		active = (timecount.classList.contains('work_active')) || false,
		notification = {
			icon: 'info.png',
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
		time.current =  active ? Math.floor(time.work) : Math.floor(time.play);
		slider.work.value = time.work / 60;
		slider.play.value = time.play / 60;

		value.work.innerHTML = ((time.work / 60) > 1) ? Math.floor(time.work / 60) + ' min'  : time.work + ' sec';
		value.play.innerHTML = ((time.play / 60) > 1) ? Math.floor(time.play / 60) + ' min'  : time.play + ' sec';

		timecount.innerHTML = active ? value.work.innerHTML : value.play.innerHTML;

		$('settingNotification').checked = settings.notification;
		$('settingSound').checked = settings.sound;

		if (audio_ogg) {
			audio.setAttribute("src","sounds/waves.ogg");
		} else {
			audio.setAttribute("src","sounds/waves.mp3");
		}

	function timer() {

		if (timecount.classList.contains('work_active')) {
			currentstatus.innerHTML = 'Working...';
		}

		cycle_before.style.height = parseFloat(window.getComputedStyle(document.querySelector('.cycle_one_inner'),null).getPropertyValue("height")) - (180 / time.current) + "px";

		if (time.active <= 0) {

			if (timecount.classList.contains('work_active')) {
				timecount.classList.remove('work_active');		
				timecount.classList.add('play_active');
				document.documentElement.classList.add('isplaying');
				time.active = time.play;
				time.current = time.play;
				currentstatus.innerHTML = 'Playing...';
				notification.title = 'Time to play';
				notification.body = 'Stand up and relax';
			} else {
				timecount.classList.remove('play_active');
				timecount.classList.add('work_active');
				document.documentElement.classList.remove('isplaying');
				time.active = time.work;
				time.current = time.work;
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
				audio.play();
				setTimeout(function () {
					audio.pause();
				}, 4000);
			}
			cycle_before.style.height = '180px';
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
		if (this.classList.contains('button-start')) {
			this.className = 'button-pause';
			this.innerHTML = 'Pause';
			clearInterval(counter);
			counter = setInterval(timer, 1000);
			cycles.className = 'cycles_active';
			if (notify.isSupported && (notify.PERMISSION_DEFAULT === notify.permissionLevel())) {
				notify.requestPermission();
			}
		} else {
			this.className = 'button-start';
			this.innerHTML = 'Start';
			clearInterval(counter);
			cycles.className = '';
		}	
	});

	button.reset.addEventListener('click', function () {
		clearInterval(counter);
		timecount.innerHTML = timecount.classList.contains('work_active') ? value.work.innerHTML : value.play.innerHTML;
		time.active = time.current;
		button.play.className = 'button-start';
		button.play.innerHTML = 'Start';
		clearInterval(counter);
		cycles.className = '';
	});

	slider.work.addEventListener('change', function () {
		value.work.innerHTML = this.value + ' min';
		time.work = this.value * 60;
		localStorage.setItem("worktime", time.work);
		if (timecount.classList.contains('work_active')) {
			time.active = this.value * 60;
			time.current = this.value * 60;
			cycle_before.style.height = '180px';
		}
	});

	slider.play.addEventListener('change', function () {
		value.play.innerHTML = this.value + ' min';
		time.play = this.value * 60;
		localStorage.setItem("playtime", time.play);
		if (timecount.classList.contains('play_active')) {
			time.active = this.value * 60;
			time.current = this.value * 60;
			cycle_before.style.height = '180px';
		}
	});

	$('settingNotification').addEventListener('change', function () {
		localStorage.setItem("notification", $('settingNotification').checked);
	});

	$('settingSound').addEventListener('change', function () {
		localStorage.setItem("sound", $('settingSound').checked);
	});

})(document);