var slider1 = tns({
  controls: false,
  autoplay: true,
  container: ".slider1",
  mouseDrag: true,
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



