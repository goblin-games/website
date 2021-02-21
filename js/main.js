var slider1 = tns({
    controls: false,
    container: ".slider1",
    mouseDrag: true,
    autoplay: true,
    autoplayButtonOutput: false,
    responsive: {
        "350": {
            items: 2
        },
        "500": {
            items: 3
        },
        "800": {
            items: 4
        }
    },
    swipeAngle: false,
    speed: 400
});

var slider2 = tns({
    controls: false,
    container: ".slider2",
    mouseDrag: true,
    autoplay: true,
    autoplayButtonOutput: false,
    responsive: {
        "350": {
            items: 1
        },
        "500": {
            items: 1
        },
        "800": {
            items: 2
        }
    },
    swipeAngle: false,
    speed: 400
});

var slider3 = tns({
    controls: false,
    container: ".slider3",
    mouseDrag: true,
    autoplay: true,
    autoplayButtonOutput: false,
    responsive: {
        "450": {
            items: 2
        },
        "500": {
            items: 3
        },
        "800": {
            items: 4
        }
    },
    swipeAngle: false,
    speed: 400
});

var slider4 = tns({
    controls: false,
    container: ".slider4",
    mouseDrag: true,
    autoplay: true,
    autoplayButtonOutput: false,
    responsive: {
        "350": {
            items: 1
        },
        "500": {
            items: 1
        },
        "800": {
            items: 2
        }
    },
    swipeAngle: false,
    speed: 400
});


(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top - 48)
                }, 500, "easeOutExpo");
                return false;
            }
        }
    });
})(jQuery); // End of use strict
