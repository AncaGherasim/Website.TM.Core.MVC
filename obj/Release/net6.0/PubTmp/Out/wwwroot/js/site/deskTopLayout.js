// File version
var fileVersion = 08012022;
/////////////////////////
var _utCookie = utmValue;
var hvCook = 0;

$(document).ready(function () {

    var backCook = ["TMLDpkbyoBack", "frmBack", "bpBack", "LDcalCount", "TM_BackCookie"];
    var cokC = 1;
    for (var i = 0; i < backCook.length; i++) {
        getCookie(backCook[i]) != null ? hvCook = 1 : '';
        backCook.length - 1 === cokC++ ? checkCook() : '';
    };

    $(".closeAnn").click(function () {
        $(".secAnnounce").slideUp(function () { $(".dvImgContainer").css({ "margin": "0 auto", "padding": "20px 0", "max-width": "980px", "height": "auto" }); });
    });

    if (webAnnounce != "") {
        var secAnn = '<section class="secTopAnnounce">' +
            '<p class="closeTopAnn">X</p>' +
            '<img src="https://pictures.tripmasters.com/siteassets/d/attention_icon2.png" />' + webAnnounce +
            '</section>'
        if (_utInputString.includes('home')) {
            $(".dvImgContainer").prepend(secAnn);
            $(".secTopAnnounce").css({ "margin": "0px auto 10px auto", "padding": "25px", "width": "930px", "background": "#333", "color": "white" });
            $(".dvImgContainer").css({ "margin": "0 auto", "padding": "0 0 20px 0", "max-width": "980px", "height": "auto" });
            $(".closeTopAnn").click(function () {
                $(".secTopAnnounce").slideUp(function () { $(".dvImgContainer").css({ "margin": "0 auto", "padding": "20px 0", "max-width": "980px", "height": "auto" }); });
            })
        }
        else if (_utInputString.includes('T4')) {
            $(".divImgContainer").prepend(secAnn);
            $(".secTopAnnounce").css({ "margin": "0px auto 10px auto", "padding": "25px", "width": "930px", "background": "#333", "color": "white" });
            $(".divImgContainer").css({ "padding": "0 0 30px 0", "max-width": "980px", "height": "auto" });
            $(".closeTopAnn").click(function () {
                $(".secTopAnnounce").slideUp(function () { $(".divImgContainer").css({ "margin": "0 auto", "padding": "70px 0 0", "height": "auto" }); });
            })
        }
        else if (/\/GP|_pk/.test(_utInputString) === true) {
            $(secAnn).insertAfter($('.dvhGreyBG'))
            $(".secTopAnnounce").css({ "margin": "0 auto", "padding": "30px", "width": "918px", "background": "#333", "color": "white" }).slideDown("fast");
            $(".closeTopAnn").click(function () { $(".secTopAnnounce").slideUp("fast"); })
        }
    };
});

function checkCook() {
    hvCook === 0 ? userHomeTown != '' ? userHomeTown != 'none' ? checkCalendar() : '' : '' : '';
};

// -- LazyLoad --
document.addEventListener("DOMContentLoaded", function () {
    var lazyloadImages;

    if ("IntersectionObserver" in window) {
        lazyloadImages = Array.prototype.slice.call(document.querySelectorAll(".delay")); 
        var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove("delay");
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
        });
    } else {
        var lazyloadThrottleTimeout;
        lazyloadImages = Array.prototype.slice.call(document.querySelectorAll(".delay")); 

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function () {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function (img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('delay');
                    }
                });
                if (lazyloadImages.length == 0) {
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }
});


