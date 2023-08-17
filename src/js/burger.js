export function Burger() {
    
    function hideBurger() {
        $('.navbar').removeClass('collapsed');
        $('body').removeClass('lock');
        $('.burger-menu_overlay_active').addClass('overlay-none');
    }

    function showBurger() {
        $('.navbar').addClass('collapsed');
        $('body').addClass('lock');
        $('.burger-menu_overlay_active').removeClass('overlay-none');
    }

    $('.navbar .toggle').on('click', function() {
        if ($('.navbar').hasClass('collapsed')) {
            hideBurger();
        } else {
            showBurger();
        }
    });

    $(window).on('click', function(e) {
        if ($(e.target).hasClass('burger-menu_overlay_active')) {
            hideBurger();
        }
    });



    $('[data-goto]').on('click', function(e) {
        e.preventDefault();
        const blockID = $(this).data('goto');
        $(blockID).get(0).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        hideBurger();
    });
    

    if ($('body').hasClass('_pc')) {
        let lastScroll = 0;
        const defaultOffset = 170;
        const navBarDynamicHeight = $('.navbar').innerHeight();
        const header = $('.navbar');
        const videoHeight = $('.video').innerHeight();


        const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
        const containHide = () => header.hasClass('hide-header');

        $(window).on('scroll', function() {
            if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
                header.addClass('hide-header');
                header.css('transform', `translateY(-${navBarDynamicHeight}px)`);
            } else if (scrollPosition() < lastScroll && containHide()) {
                header.removeClass('hide-header');
                header.css('transform', 'translateY(0)');
            } else if (scrollPosition() > videoHeight) {
                header.addClass('background-black');
            } else if (scrollPosition() < videoHeight) {
                header.removeClass('background-black');
            }

            lastScroll = scrollPosition();
        });
    }
   
}