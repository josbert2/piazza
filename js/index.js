'use strict';
(function($) {

    $.fn.animateCSS = function(effect, delay, callback) {

        // Return this to maintain chainability
        return this.each(function() {

            // Cache $(this) for speed
            var $this = $(this);

            // Check if delay exists or if it's a callback
            if (!delay || typeof delay == 'function') {

                // If it's a callback, move it to callback so we can call it later
                callback = delay;

                // Set the delay to 0 for the setTimeout
                delay = 0;
            }

            // Start a counter so we can delay the animation if required
            var animation = setTimeout(function() {

                // Add the animation effect with classes
                $this.addClass('animated ' + effect);

                // Check if the elemenr has been hidden to start with
                if ($this.css('visibility') == 'hidden') {

                    // If it has, show it (after the class has been added)
                    $this.css({
                        'visibility': 'visible'
                    });

                }

                // If the element is hidden
                if ($this.is(':hidden')) {

                    // Show it
                    $this.show();

                }

                // Event triggered when the animation has finished
                $this.bind('webkitAnimationEnd animationend oAnimationEnd', function() {

                    // Add a callback event
                    if (typeof callback == 'function') {

                        // Execute the callback
                        callback.call(this);

                    }

                });

                // Specify the delay
            }, delay);

        });

    };

})(jQuery);
$("html").easeScroll();
$('.svg-wrapper').click(function(event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: 0
    }, 1000);
});
/*=========================================================================
   Nav
=========================================================================*/
(function() {
    $('.menu--drop').click(function() {

        $(this).find('.main-drop').toggleClass('main-drop-open')
    })
    $('section').click(function() {

        if ($('.main-drop').hasClass('main-drop-open')) {
            $('.main-drop').removeClass('main-drop-open')
        }
    })
    const links_p = document.getElementById('links__porfolio');
    if (links_p == null) {

    } else {
        const link_p = links_p.getElementsByTagName('li');

        for (var i = 0; i < link_p.length; i++) {
            link_p[i].addEventListener('click', function(event) {
                event.preventDefault();

                var current_p = document.getElementsByClassName('p_link');
                current_p[0].className = current_p[0].className.replace(' p_link', '');
                this.className += " p_link";


            })
        }

    }




    /*=========================================================================
       Scroll To Card Footer
    =========================================================================*/
    if ($('.index').length) {
        let w = $(window).height();

        $(window).scroll(function() {
            let windowHeight = Math.trunc($(window).scrollTop());
            let welcome = $('.welcome').offset();
            let header = $('.header-nav');
            welcome = Math.trunc(welcome.top);

            if (windowHeight >= welcome) {
                header.addClass('dark')
            } else {
                header.removeClass('dark')
            }

            if ($(this).scrollTop() > 300) {
                $('.svg-wrapper').addClass('expand');

            } else {
                $('.svg-wrapper').removeClass('expand');

            }

            let cardFooter = $('.footer-card');
            let map = $('.map').offset();
            map = Math.trunc(map.top);
            let cals = windowHeight - map

            if (windowHeight >= map) {
                if (cals > 240) {} else {

                    cardFooter.css('marginTop', "-" + cals + "px")
                }
            } else {
                cardFooter.css('marginTop', '26px');
            }

        })
    } else {

    }
})();

/*=========================================================================
   Function Slider Parallax
=========================================================================*/
const $window = $(window);
const $body = $('body');

class Slideshow {
    constructor(userOptions = {}) {
        const defaultOptions = {
            $el: $('.slideshow'),
            showArrows: false,
            showPagination: true,
            duration: 10000,
            autoplay: true
        }

        let options = Object.assign({}, defaultOptions, userOptions);

        this.$el = options.$el;
        this.maxSlide = this.$el.find($('.js-slider-home-slide')).length;
        this.showArrows = this.maxSlide > 1 ? options.showArrows : false;
        this.showPagination = options.showPagination;
        this.currentSlide = 1;
        this.isAnimating = false;
        this.animationDuration = 1200;
        this.autoplaySpeed = options.duration;
        this.interval;
        this.$controls = this.$el.find('.js-slider-home-button');
        this.autoplay = this.maxSlide > 1 ? options.autoplay : false;

        this.$el.on('click', '.js-slider-home-next', (event) => this.nextSlide());
        this.$el.on('click', '.js-slider-home-prev', (event) => this.prevSlide());
        this.$el.on('click', '.js-pagination-item', event => {
            if (!this.isAnimating) {
                this.preventClick();
                this.goToSlide(event.target.dataset.slide);
            }
        });

        this.init();
    }

    init() {
        this.goToSlide(1);

        /* if (this.showArrows) {
           this.$el.append(`<div class="c-header-home_footer">
             <div class="o-container">
                 <div class="c-header-home_controls -nomobile o-button-group">
                     <div class="js-parallax is-inview" data-speed="1" data-position="top" data-target="#js-header">
                         <button class="o-button -white -square -top js-slider-home-button js-slider-home-prev" type="button">
                             <span class="o-button_label">
                                 <svg class="o-button_icon" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-prev"></use></svg>
                             </span>
                         </button>
                         <button class="o-button -white -square js-slider-home-button js-slider-home-next" type="button">
                             <span class="o-button_label">
                                 <svg class="o-button_icon" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-next"></use></svg>
                             </span>
                         </button>
                     </div>
                 </div>
             </div>
         </div>`);
         }
         */
        if (this.autoplay) {
            this.startAutoplay();
        }

        if (this.showPagination) {
            let paginationNumber = this.maxSlide;
            let pagination = '<div class="pagination"><div class="container d-flex justify-content-end">';

            for (let i = 0; i < this.maxSlide; i++) {
                let item = `<span class="pagination__item js-pagination-item ${ i === 0 ? 'is-current' : ''}" data-slide=${i + 1}>${i + 1}</span>`;
                pagination = pagination + item;
            }

            pagination = pagination + '</div></div>';

            this.$el.append(pagination);
        }
    }

    preventClick() {
        this.isAnimating = true;
        this.$controls.prop('disabled', true);
        clearInterval(this.interval);

        setTimeout(() => {
            this.isAnimating = false;
            this.$controls.prop('disabled', false);
            if (this.autoplay) {
                this.startAutoplay();
            }
        }, this.animationDuration);
    }

    goToSlide(index) {
        this.currentSlide = parseInt(index);

        if (this.currentSlide > this.maxSlide) {
            this.currentSlide = 1;
        }

        if (this.currentSlide === 0) {
            this.currentSlide = this.maxSlide;
        }

        const newCurrent = this.$el.find('.js-slider-home-slide[data-slide="' + this.currentSlide + '"]');
        const newPrev = this.currentSlide === 1 ? this.$el.find('.js-slider-home-slide').last() : newCurrent.prev('.js-slider-home-slide');
        const newNext = this.currentSlide === this.maxSlide ? this.$el.find('.js-slider-home-slide').first() : newCurrent.next('.js-slider-home-slide');

        this.$el.find('.js-slider-home-slide').removeClass('is-prev is-next is-current');
        this.$el.find('.js-pagination-item').removeClass('is-current');

        if (this.maxSlide > 1) {
            newPrev.addClass('is-prev');
            newNext.addClass('is-next');
        }

        newCurrent.addClass('is-current');
        this.$el.find('.js-pagination-item[data-slide="' + this.currentSlide + '"]').addClass('is-current');
    }

    nextSlide() {
        this.preventClick();
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.preventClick();
        this.goToSlide(this.currentSlide - 1);
    }

    startAutoplay() {
        this.interval = setInterval(() => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        }, this.autoplaySpeed);
    }

    destroy() {
        this.$el.off();
    }
}

(function() {

    let loaded = false;
    let maxLoad = 3000;

    function load() {
        const options = {
            showPagination: true
        };

        let slideShow = new Slideshow(options);
    }

    function addLoadClass() {
        $body.addClass('is-loaded');

        setTimeout(function() {
            $body.addClass('is-animated');
        }, 600);
    }

    $window.on('load', function() {
        if (!loaded) {
            loaded = true;
            load();
        }
    });

    setTimeout(function() {
        if (!loaded) {
            loaded = true;
            load();
        }
    }, maxLoad);

    addLoadClass();
})();

/*=========================================================================
   Nav Active
=========================================================================*/
if ($('.index').length) {
    $(document).on('click', '#svg-a', function(event) {
        event.preventDefault();

        $("html, body").animate({
            scrollTop: $('#about').offset().top
        }, 1000);
    });
    $(document).ready(function() {
        $(document).on("scroll", onScroll);

        //smoothscroll
        $('#nav a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            $(document).off("scroll");

            $('#nav li a').each(function() {
                $(this).removeClass('active');
            })
            $(this).addClass('active');

            var target = this.hash,
                menu = target;

            var $target = $(target);
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top + 2
            }, 500, 'swing', function() {
                window.location.hash = target;
                $(document).on("scroll", onScroll);
            });
        });
    });

    function onScroll(event) {
        var scrollPos = $(document).scrollTop();
        $('#nav li a').each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('#nav li a').removeClass("active");
                currLink.addClass("active");
            } else {
                currLink.removeClass("active");
            }
        });
    }
} else {

}
/*=========================================================================
   Btn filter same height
=========================================================================*/
let w = $(window).height();
let maximun = 0;
if (w < 720) {
    $('#links__porfolio li').each(function() {
        var value = parseFloat($(this).height())

        if (value > maximun) {
            maximun = parseFloat(value)
        }


    })
    console.log($('.marketing').offset())
    console.log($('.marketing').lenght);
    console.log(w * Math.trunc(maximun))
    //$('#links__porfolio li').css("height", Math.trunc(maximun) + "px")


}

/*=========================================================================
   Active drop
=========================================================================*/


/*=========================================================================
   Magic line
=========================================================================*/
if ($('.shop').length) {
    $(function() {
        'use strict';
        /*Activate default tab contents*/
        var topPos, newheight, $magicLine;

        $('.tabs').append("<li id='magic-line'></li>");
        $magicLine = $('#magic-line');
        $magicLine.height($('.active').height())
            .css('top', $('.active a').position().top)
            .data('origtop', $magicLine.position().top)
            .data('origheight', $magicLine.height());

        $('.tabs li a').click(function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.parent().addClass('active').siblings().removeClass('active');
            $magicLine
                .data('origtop', $this.position().top)
                .data('origheight', $this.parent().height());
            return false;
        });

        /*Magicline hover animation*/
        $('.tabs li').find('a').hover(function() {
            var $thisBar = $(this);
            topPos = $thisBar.position().top;
            newheight = $thisBar.parent().height();
            $magicLine.css({
                "top": topPos,
                "height": newheight
            });
        }, function() {
            $magicLine.css({
                "top": $magicLine.data('origtop'),
                "height": $magicLine.data('origheight')
            });
        });
    });


    $(function() {
        $('.tab-content').find('.data-d').each(function(index) {

            $(this).animateCSS('fadeIn', 100 * index);
        });


    })
    $('.tabs li a').click(function(e) {
        e.preventDefault();
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tabs-child').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
        $('.tabs-child').find('.data-d').removeClass('fadeIn');



        $('.tabs-child.current').find('.data-d').each(function(index) {
            $(this).animateCSS('fadeIn', 100 * index);
        });


        /*$(elems).each(function(index) {
        c(index)
          $(this).delay(1200*index).fadeIn(1000);
      });*/



        /*for (var i = 0; i < list.length; ++i) {
           list[i].classList.add('fadeInUp');
           list[i].style.animationDelay = i * 55+"ms"
        }*/

    })

} else {

}
/*=========================================================================
   Preview items
=========================================================================*/
if ($('.product-view').length) {
    let product = $('.product-view');
    let item = $('.span-thumbail');

    item.click(function(ev) {
        let bg = $(this).css('background-image');
        bg = bg.replace('url(', '').replace(')', '');

        $('.details-menu').css('background-image', 'url(' + bg + ')');
        $('.data-gallery a').attr('href', bg.replace(/['"]+/g, ''));


    })
} else {

}

/*=========================================================================
   Overlay Menu
=========================================================================*/
if ($('.overlay-menu').length) {
    $('.menu-hambuguer').click(function(e) {
        e.preventDefault();
        $('body').toggleClass('is-open')
    })
    $('.close-btn-menu').click(function(e) {
        e.preventDefault();
        $('body').toggleClass('is-open')
    })
} else {

}