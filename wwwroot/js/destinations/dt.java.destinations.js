$(document).ready(function () {
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


    $('#filterBox input').val('');
    $('#filterBox input').keydown(function (e) {
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
        //console.log(cities);
        //console.log(ctyTotal);
        if (ctyTotal > 0) {
            for (cty = 0; cty < ctyTotal; cty++) {
                var mockup = '';
                var infoImage = 'info_icon.png';
                var cursorType = 'cursor:pointer';
                if (cities[cty].CityInfo == 'none' || cities[cty].CityInfo == null) {
                    infoImage = 'noinfo_icon.png'
                    cursorType = 'cursor:default';
                }
                mockup += '<div class="outer-div2-1">\
                    <label style="' + cursorType + '" for="' + cities[cty].CityName + '"><img src="https://pictures.tripmasters.com/siteassets/d/' + infoImage + '" /></label >\
                    <a href ="/' + cities[cty].CityDept + '/' + cities[cty].CityName.replace(/ /g, '_').toLowerCase() + '/vacations">' + cities[cty].CityName + '</a>\
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