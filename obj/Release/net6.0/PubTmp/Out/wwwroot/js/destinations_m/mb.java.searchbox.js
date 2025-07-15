$(document).ready(function () {
    $('.componentRowSeo').click(function () {
        $('.moreSeo').toggle();
        if ($('.moreSeo').is(':visible')) {
            $('.componentRowSeo').removeClass('collapsed');
        } else {
            $('.componentRowSeo').addClass('collapsed');
        }
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
        }

        //$('.componentsContainer, .componentRow').hide();
        //$('.countryListRow span').html("&#9660");

    }).keyup(function (e) {
        var i = $(this).attr('id').replace('i', '');
        (i == 1) ? ($('#i2').val($('#i1').val())) : ($('#i1').val($('#i2').val()));

        var startLetters = $('#i1').val();
        if (startLetters.trim() == '') {
            $('.outer-detail').show();
        }
        else {
            $('.outer-detail').each(function () {
                var name = $(this).attr('data-name').toLowerCase();
                (name.startsWith(startLetters.toLowerCase()) == false) ? $(this).hide() : $(this).show();
            });
        }
    });

    $(".countryListRow").click(function () {
        var id = $(this).attr("id");
        if ($('#dvComps' + id).is(':visible')) {
            $('#dvComps' + id).hide(200, function () { $('#' + id + ' span').html("&#9660"); });
        }
        else {
            $('#' + id + ' span').html("&#9650");
            $('.componentRow').show();
            $('#dvComps' + id).show(200);
        }
    });

    $(".seeAll").click(function () {
        console.log(".seeAll click");
        var id = $(this).attr('data-id');
        var couName = $(this).attr('data-name');
        console.log(".seeAll id = " + id);
        $('html,body').animate({ scrollTop: 0 }, 300, function () {
            console.log(".seeAll 1");
            $('#mainContainer').hide();
            $('#citiesList').html('').show();
            $('#citiesLocation').text('Cities in ' + couName);
            $('#dvCities').show("slide", {}, 500, function () {
                console.log(".seeAll 2");
                setWait();
                $.ajax({
                    url: "/destinations/GetCityList/" + id,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) {
                        console.log(data);
                        var cities = data;
                        var citiesHtml = '';
                        for (i = 0; i <= cities.length - 1; i++) {
                            citiesHtml = citiesHtml + '<div class="componentRow"><a href="https://www.tripmasters.com/' + cities[i].cityDept + '/' + cities[i].name.replace(/\s/g, "_") + '/vacations">' + cities[i].name + '<span>&#8250;</span></a></div>'
                        }
                        citiesHtml = citiesHtml + '<div class="backToDest">Back to Destinations</div>';
                        $('#citiesList').html(citiesHtml);

                        $(".backToDest").click(function () {
                            $('html,body').animate({ scrollTop: 0 });
                            $('#dvCities').hide();
                            $('#mainContainer').show("slide", {}, 500);
                        })

                        $('#dvWait').fadeTo(200, 0, function () { $('#dvWait').hide().css("opacity", 1); });
                    },
                    error: function (xhr, desc, exceptionobj) {
                        $('#citiesList').html(xhr.responseText).show();
                    }
                });
            });
        });
    });

    $("#viewDests").click(function () {
        $('html,body').animate({ scrollTop: 0 });
        $('#dvCities').hide();
        $('#mainContainer').show("slide", {}, 500);
    });
});

function setWait() {
    var h = $('#citiesList').outerHeight();
    var w = $('#citiesList').outerWidth();
    var pos = $('#citiesList').offset();
    $('#dvWait').css({ "top": pos.top + "px", "left": "0px" });
    $('#dvWait #loaderImg').css({ "top": ((h - 70) / 2) + "px" });
    $('#dvWait').height(h).width(w).show();
}
function inArray(target, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === target) {
            return true;
        }
    }
    return false;
}