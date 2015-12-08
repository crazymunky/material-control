$.fn.slider = function() {
    $.each(this, function(i, element){
        //elem es el que contiene todo 
        element = $(element);
        var itemsContainer = element.find("ul");
        var arrows = element.find(".arrow");
        var actual = 0;
        var cantItems = itemsContainer.find('li').length;
        var max = cantItems;
        var showing = false;
        var interval;

        element.find(".pointer").click(function(){
            var index = element.find(".pointer").index(this);
            goTo(index, true);
            //startInterval();
        });
        //startInterval();
        goTo(0);
        arrows.click(function(){
            if($(this).hasClass('right'))
                goTo(actual+1);
            else
                goTo(actual-1);
            //startInterval();
        });
        function startInterval(){
            if(interval)
                clearInterval(interval);
            interval = setInterval(function(){
                var isVisible = element.css("display") !== "none";
                if (isVisible && showing){
                    goTo(actual+1);
                }
            }, 3000);
        }
        function goTo(index, clickFromPointer){
            if(index >= max){
                if(clickFromPointer)
                    index = max-1;
                else
                    index = 0;
            }else if(index<0){
                index = max-1;
            }


            element.find(".pointer").removeClass("active");

            var pointers =  element.find(".pointer");

            element.find(".pointer").eq(index).addClass("active");

            var itemWidth = itemsContainer.find("li").outerWidth();
            var moveAmount = itemWidth * index;

            itemsContainer.css({
                transform:"translateX(-"+moveAmount+"px)"
            });
            actual = index;
        }

        $(window).on("resize", function(){
            if($( window ).width() <=750)
                goTo(0);
        });

        $(window).scroll(onScrollAnimate);
        onScrollAnimate();
        function onScrollAnimate(){
            var itemPosition = getViewportOffset(itemsContainer),
                itemHeight = itemsContainer.outerHeight(),
                windowHeight = $(window).height();
            //A is top line of the item
            //B is the bottom line of the item
            //POS its showing if its being seen 
            var distTopA = itemPosition.top,
                distTopB = itemPosition.top + itemHeight;
            showing = (distTopA >= 0 && distTopB<= windowHeight);
            return showing;
        }

        function getViewportOffset(e){

            var $body  = $("body"),
                scrollLeft = $body.scrollLeft(),
                scrollTop = $body.scrollTop(),
                $e = $(e),
                offset = $e.offset();


            var retorno = {
                left: offset.left - scrollLeft, 
                top: offset.top - scrollTop
            };
            return retorno;
        }

    });
    return this;

};
