export function Burger() {
    function hideBurger(){
        navbar.classList.remove("collapsed");
        body.classList.remove('lock');
        overlayBlock.classList.add('overlay-none');
    }
    function showBurger(){
        navbar.classList.add("collapsed");
        body.classList.add('lock');
        overlayBlock.classList.remove('overlay-none');
    }

    const navbar = document.querySelector(".navbar");
    const overlayBlock = document.querySelector('.burger-menu_overlay_active');
    const body = document.querySelector('body');
    navbar.querySelector(".toggle").addEventListener("click", (e) => {
    
    if(navbar.classList.contains("collapsed")){
        hideBurger()
    }else {
        showBurger()
    }
   window.addEventListener('click', (e) => {
    if(e.target.classList.contains('burger-menu_overlay_active')){
        hideBurger();
    }
   })
    
    
    });

    const anchors = document.querySelectorAll('[data-goto]')

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const blockID = anchor.getAttribute('data-goto')
        document.querySelector(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

        hideBurger();
      })
    });
    
      
    
    // Sticky navbar settings
    if(document.querySelector('body').classList.contains('_pc')){
            let lastScroll = 0;
            const defaultOffset = 170,
                  navBarDynamicHeight = document.querySelector('.navbar').clientHeight,
                  header = document.querySelector('.navbar');
                
                  function getBackgroundHeight(){
                    if(document.querySelector('.video')){
                        return document.querySelector('.video').clientHeight;
                     } else {  
                        return document.querySelector('#bgnd-wall').clientHeight;
                      }
                  }



            const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
            const containHide = () => header.classList.contains('hide-header');

                window.addEventListener('scroll', (e) => {
                    if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset ) {
                        header.classList.add('hide-header');
                            header.style.transform = `translateY(-${navBarDynamicHeight}px)`;
                        

                    } else if(scrollPosition() < lastScroll && containHide()) {
                        header.classList.remove('hide-header');
                        header.style.transform = `translateY(0)`;
                    } else if(window.pageYOffset > getBackgroundHeight()){
                        header.classList.add('background-black')
                    } else if(window.pageYOffset < getBackgroundHeight()){
                        header.classList.remove('background-black');
                    } 

                    lastScroll = scrollPosition();
                })
            }
    
    //Categories tabs

   
}