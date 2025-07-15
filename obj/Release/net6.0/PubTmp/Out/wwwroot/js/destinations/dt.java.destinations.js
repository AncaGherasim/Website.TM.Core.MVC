// File version
var fileVersion = "02092023";
/////////////////////////

$(document).ready(function () {

    //$("#dvGoTop").click(function () {
    //    $('html,body').animate({ scrollTop: 20 }, 100);
    //    $("#dvGoTop").hide();
    //});

    //$("span.letter").click(function () {
    //    $("#dvGoTop").hide();
    //    $("span.letter").removeClass("letterSelected");
    //    var l = $(this).attr("id").split("_")[1];
    //    $("#L1_" + l).addClass("letterSelected");
    //    $("#L2_" + l).addClass("letterSelected");
    //    $(".countryListRow").removeClass("countryListRowSelected");
    //    $(".countryListRow[id^='" + l + "']").addClass("countryListRowSelected");
    //    var pos = $(".countryListRow[id^='" + l + "']:first").offset();
    //    $('html,body').animate({ scrollTop: pos.top - 25 }, 200, function () {
    //        if ($(window).scrollTop() > 100) {
    //            var w = $(".countryListRow[id^='" + l + "']:first").width();
    //            var h = $(".countryListRow[id^='" + l + "']:first").height();
    //            var posLast = $(".countryListRow[id^='" + l + "']:last").offset();
    //            var topPos = pos.top == posLast.top ? (pos.top + (h - $('#dvGoTop').height()) / 2) : ((pos.top + posLast.top + h) - $('#dvGoTop').height()) / 2;
    //            $('#dvGoTop').css({ "top": topPos + "px", "left": (pos.left + w + 10) + "px" }).show();
    //        }
    //    });
    //});

    $("div[id^='open']").click(function () {
        var id = $(this).attr("data-id");
        var dom = $(this);
        $('div[id="more-open' + id + '"]').is(':visible') == false ?
            (
                $(dom).attr("style", "transform: rotate(45deg); font-size: 2rem;"),
                $('div[id="more-open' + id + '"]').slideDown('slow'),
                $('#azcites' + id + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-indicator.gif" /> Loading cities A-Z List'),
                getPlacesOnCountry(id)
            )
            :
            (
                $(dom).removeAttr("style"),
                $('div[id="more-open' + id + '"]').slideUp('slow'),
                $('#azcites' + id + '').html('')
            );
    });


    $('.searchBox input, .filterBox input').val('');
    $('.searchBox input, .filterBox input').keydown(function (e) {
        var regex = new RegExp("^[a-zA-Z]*$");
        var keys = [8, 37, 39, 46];
        var key = (e.which) ? e.which : e.keyCode;
        var str = (inArray(key, keys) == false) ? String.fromCharCode(key) : '';
        if (!regex.test(str) && inArray(key, keys) == false) {
            e.preventDefault();
            return false;
        };
    }).keyup(function (e) {
        var i = $(this).attr('id').replace('i', '');
        (i == 1) ? ($('#i2').val($('#i1').val())) : ($('#i1').val($('#i2').val()));

        var startLetters = $('#i1').val();
        if (startLetters.trim() == '') {
            $('.outer-div').show();
        }
        else {
            $('.outer-div').each(function () {
                var name = $(this).attr('data-name').toLowerCase();
                (name.startsWith(startLetters.toLowerCase()) == false) ? $(this).hide() : $(this).show();
            });
        };
    });
});

//function setWait() {
//    var h = $('#dvCities').outerHeight();
//    var w = $('#dvCities').outerWidth();
//    $('#dvWait').css({ "top": $('#dvCities').position().top, "left": $('#dvCities').position().left });
//    $('#dvWait #loaderImg').css({ "top": ((h - 70) / 2) + "px" });
//    $('#dvWait').height(h).width(w).show();
//}

function getPlacesOnCountry(id) {
    var options = {};
    options.url = SiteName + "/Api/CountryPlaces";
    options.type = "POST";
    options.contentType = "application/json";
    options.data = JSON.stringify(id);
    options.dataType = "json";
    options.success = function (data) {
        var cities = data;
        var ctyTotal = cities.length
        var citiesHtml = '';
        var moreCitiesHtml = '';
        console.log(cities);
        console.log(ctyTotal);
        if (ctyTotal > 0) {
            for (cty = 0; cty < ctyTotal; cty++) {
                var mockup = '';
                var infoImage = 'info_icon.png';
                if (cities[cty].CityInfo == 'none' || cities[cty].CityInfo == null) {
                    infoImage = 'noinfo_icon.png'
                }
                mockup += '<div class="outer-div2-1">\
                    <label style="cursor:pointer" for="' + cities[cty].CityName + '"><img src="https://pictures.tripmasters.com/siteassets/d/' + infoImage + '" /></label >\
                    <a href ="' + cities[cty].CityDept + '/' + cities[cty].CityName + '/vacations">' + cities[cty].CityName + '</a>\
                    </div>';
                if (cities[cty].CityInfo != 'none') {
                    mockup += '<input type="checkbox" id="' + cities[cty].CityName + '" class="modal-state">\
                            <div class="modal">\
                                <label for="'+ cities[cty].CityName + '" class="modal_bg"></label>\
                                <div class="modal__inner">\
                                    <label class="modal__close" for="'+ cities[cty].CityName + '"></label>\
                                    <h2>'+ cities[cty].CityName + '</h2>\
                                    <div class="modal__description">'+ $.trim(cities[cty].CityInfo) + '</div>\
                                </div>\
                            </div>';
                }

                cities[cty].CityType !== 6 ? citiesHtml += mockup : moreCitiesHtml += mockup;
            }
        }
        $('#azcites' + id + '').html(citiesHtml);
        $('#azmorecites' + id + '').html(moreCitiesHtml);
    };
    options.error = function (xhr, desc, exceptionobj) {
        alert(xhr.responseText);
    };
    $.ajax(options);
}