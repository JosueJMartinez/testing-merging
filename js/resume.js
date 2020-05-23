(function($) {
	'use strict'; // Start of use strict

	// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
	var i = 0,
		a = 0,
		isBackspacing = false,
		isParagraph = false;

	// Typerwrite text content. Use a pipe to indicate the start of the second line "|".
	var textArray = [
		"Stack Developer:|console.log('Hello World!');",
		'Web Developer:|<p>Hello World!</p>',
		'Freelancer:|System.out.println("Hello World!");'
	];

	// Speed (in milliseconds) of typing.
	var speedForward = 50, //Typing Speed
		speedWait = 1000, // Wait between typing and backspacing
		speedBetweenLines = 100, //Wait between first and second lines
		speedBackspace = 10; //Backspace Speed

	// Smooth scrolling using jQuery easing
	$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
		if (
			location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
			location.hostname == this.hostname
		) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate(
					{
						scrollTop: target.offset().top
					},
					1000,
					'easeInOutExpo'
				);
				return false;
			}
		}
	});

	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll-trigger').click(function() {
		$('.navbar-collapse').collapse('hide');
	});

	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#sideNav'
	});

	$(document).ready(function(){
    $('[data-toggle="popover"]').popover({
		placement : 'top',
        trigger: 'hover',
		template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header border-bottom-0"></h3><div class="popover-body"></div></div>'
    });
});
	
	//Run the loop
	typeWriter('output', textArray);

	function typeWriter(id, ar) {
		var element = $('#' + id),
			aString = ar[a],
			eHeader = element.children('h3'), //Header element
			eParagraph = element.children('p'); //Subheader element

		// Determine if animation should be typing or backspacing
		if (!isBackspacing) {
			// If full string hasn't yet been typed out, continue typing
			if (i < aString.length) {
				// If character about to be typed is a pipe, switch to second line and continue.
				if (aString.charAt(i) == '|') {
					isParagraph = true;
					eHeader.removeClass('cursor');
					eParagraph.addClass('cursor');
					i++;
					setTimeout(function() {
						typeWriter(id, ar);
					}, speedBetweenLines);

					// If character isn't a pipe, continue typing.
				} else {
					// Type header or subheader depending on whether pipe has been detected
					if (!isParagraph) {
						eHeader.text(eHeader.text() + aString.charAt(i));
					} else {
						eParagraph.text(eParagraph.text() + aString.charAt(i));
					}
					i++;
					setTimeout(function() {
						typeWriter(id, ar);
					}, speedForward);
				}

				// If full string has been typed, switch to backspace mode.
			} else if (i == aString.length) {
				isBackspacing = true;
				setTimeout(function() {
					typeWriter(id, ar);
				}, speedWait);
			}

			// If backspacing is enabled
		} else {
			// If either the header or the paragraph still has text, continue backspacing
			if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
				// If paragraph still has text, continue erasing, otherwise switch to the header.
				if (eParagraph.text().length > 0) {
					eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
				} else if (eHeader.text().length > 0) {
					eParagraph.removeClass('cursor');
					eHeader.addClass('cursor');
					eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
				}
				setTimeout(function() {
					typeWriter(id, ar);
				}, speedBackspace);

				// If neither head or paragraph still has text, switch to next quote in array and start typing.
			} else {
				isBackspacing = false;
				i = 0;
				isParagraph = false;
				a = (a + 1) % ar.length; //Moves to next position in array, always looping back to 0
				setTimeout(function() {
					typeWriter(id, ar);
				}, 50);
			}
		}
	};
	
	AOS.init({
    	duration: 1000,
    	easing: "ease-in-out-back"
    });
})(jQuery); // End of use strict