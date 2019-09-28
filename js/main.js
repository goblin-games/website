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


const slider = tns({
    container: '.my-slider',
    loop: true,
    items: 1,
    slideBy: 'page',
    nav: false,
    autoplay: true,
    speed: 400,
    autoplayButtonOutput: false,
    mouseDrag: true,
    lazyload: true,
    controlsContainer: "#customize-controls",
    responsive: {
        640: {
            items: 2
        },


        768: {
            items: 3
        }
    }
});

const slider2 = tns({
    container: '.my-slider2',
    loop: true,
    items: 1,
    slideBy: 'page',
    nav: false,
    autoplay: true,
    speed: 400,
    autoplayButtonOutput: false,
    mouseDrag: true,
    lazyload: true,
    controlsContainer: "#customize-controls",
    responsive: {
        640: {
            items: 2
        },


        768: {
            items: 3
        }
    }
});
const slider3 = tns({
    container: '.my-slider3',
    loop: true,
    items: 1,
    slideBy: 'page',
    nav: false,
    autoplay: true,
    speed: 400,
    autoplayButtonOutput: false,
    mouseDrag: true,
    lazyload: true,
    controlsContainer: "#customize-controls",
    responsive: {
        640: {
            items: 2
        },


        768: {
            items: 3
        }
    }
});