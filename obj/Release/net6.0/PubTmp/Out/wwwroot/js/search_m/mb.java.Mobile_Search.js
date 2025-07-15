// File version
var fileVersion = 08012022;
/////////////////////////

$(document).ready(function () {
    $('#inpSearchAWS').val($('#awsQ').val());

    $('div[id^="optOrder"]').click(function() {
        $('div[id^="optOrder"]').removeClass("selectedOption").addClass("unselectedOption");
        $(this).removeClass("unselectedOption").addClass("selectedOption");
        var optVal = $(this).attr("id").replace("optOrder", "");
        $('#orderByText').text($(this).text());
        $('#orderByVal').val(optVal);
    });
    $('#ClearFilter_optOrder').click(function() {
        $('#orderByText').text("Relevance");
        $('#orderByVal').val(5);
        $('div[id^="optOrder"]').removeClass("selectedOption").addClass("unselectedOption");
        $('#optOrder5').removeClass("unselectedOption").addClass("selectedOption");
    });

    $('div[id^="optPrice"]').click(function() {
        $('div[id^="optPrice"]').removeClass("selectedOption").addClass("unselectedOption");
        $(this).removeClass("unselectedOption").addClass("selectedOption");
    });
    $('#ClearFilter_optPrice').click(function() { $('div[id^="optPrice"]').removeClass("selectedOption").addClass("unselectedOption"); });


    $('div[id^="optLen"]').click(function() {
        $('div[id^="optLen"]').removeClass("selectedOption").addClass("unselectedOption");
        $(this).removeClass("unselectedOption").addClass("selectedOption");
    });
    $('#ClearFilter_optLen').click(function() { $('div[id^="optLen"]').removeClass("selectedOption").addClass("unselectedOption"); });


    $('div[id^="optCk"]').click(function() {
        $(this).hasClass('selectedOptionC') ? $(this).removeClass("selectedOptionC") : $(this).addClass("selectedOptionC");
        var id_ = decodeURIComponent($(this).attr("id").replace('`', "&#96;"));
        if (id_.indexOf("2More") > 0) {
            $('#' + id_.replace("2More", "")).hasClass('selectedOptionC') ? $('#' + id_.replace("2More", "")).removeClass("selectedOptionC") : $('#' + id_.replace("2More", "")).addClass("selectedOptionC");
        } else {
            $('#' + id_.replace("optCk", "optCk2More")).hasClass('selectedOptionC') ? $('#' + id_.replace("optCk", "optCk2More")).removeClass("selectedOptionC") : $('#' + id_.replace("optCk", "optCk2More")).addClass("selectedOptionC");
        }
    });
    $('div[id^="ClearFilter_optCk"]').click(function() {
        var option_ = $(this).attr("id").indexOf("2More") > 0 ? $(this).attr("id").replace("ClearFilter_optCk2More", "") : $(this).attr("id").replace("ClearFilter_optCk", "")
        $('div[id^="optCk' + option_ + '"]').removeClass("selectedOptionC").addClass("unselectedOptionC");
        $('div[id^="optCk2More' + option_ + '"]').removeClass("selectedOptionC").addClass("unselectedOptionC");
    });

    $('.filterCategoryHeader, .blueButton').click(function() {
        showDiv("dvFilterPacks");
        ShowPacks(1);
    });

    $('#goTop').click(function() {
        $(window).scrollTop(0);
    });           
     
    ShowPacks(1);
});
function showDiv(name) {    
    if (name != "dvFilterPacks") {
        $('#dvResultsNumber').hide();
        $('#goTop').hide();       
    }
    else {
        $('#dvResultsNumber').show();
        $('#goTop').show();       
    }
    $('div[id^="dvFilter"]').hide();
    $('html, body').scrollTop();
    $('#' + name).show("slide", {},500);
}
function unique(array) {
    return $.grep(array, function(el, index) { return index === $.inArray(el, array); });
}
function BuildFilterExpression() {
    var priceFilter = ''
    $('div.selectedOption[id^="optPrice"]').each(function() {
        priceFilter = priceFilter + $(this).attr("id").replace("optPrice","") + 'P';
    });
    priceFilter = priceFilter.length > 1 ? priceFilter.substring(0, priceFilter.length - 1) : priceFilter;

    var lengthFilter = ''
    $('div.selectedOption[id^="optLen"]').each(function() {
        lengthFilter = lengthFilter + $(this).attr("id").replace("optLen","") + 'L';
    });
    lengthFilter = lengthFilter.length > 1 ? lengthFilter.substring(0, lengthFilter.length - 1) : lengthFilter;

    var countryFilter = '', countriesArray = [];
    $('div.selectedOptionC[id*="Countries"]').each(function() { countriesArray.push($(this).attr("id").replace("optCkCountries", '').replace("optCk2MoreCountries", '')); });
    countriesArray = unique(countriesArray);
    for (var i = 0; i <= countriesArray.length - 1; i++) { countryFilter = countryFilter + countriesArray[i].replace(/_/g, ' ') + '_'; }
    countryFilter = countryFilter.length > 1 ? countryFilter.substring(0, countryFilter.length - 1) : countryFilter;

    var citiesFilter = '', citiesArray = [];
    $('div.selectedOptionC[id*="Cities"]').each(function() { citiesArray.push($(this).attr("id").replace("optCkCities", '').replace("optCk2MoreCities", '')); });
    citiesArray = unique(citiesArray);
    for (var i = 0; i <= citiesArray.length - 1; i++) { citiesFilter = citiesFilter + citiesArray[i].replace(/_/g, ' ') + '_'; }
    citiesFilter = citiesFilter.length > 1 ? citiesFilter.substring(0, citiesFilter.length - 1) : citiesFilter;

    var interestFilter = '', interestArray = [];
    $('div.selectedOptionC[id*="Interests"]').each(function() { interestArray.push($(this).attr("id").replace("optCkInterests", '').replace("optCk2MoreInterests", '')); });
    interestArray = unique(interestArray);
    for (var i = 0; i <= interestArray.length - 1; i++) { interestFilter = interestFilter + interestArray[i].replace(/_/g, ' ') + '_'; }
    interestFilter = interestFilter.length > 1 ? interestFilter.substring(0, interestFilter.length - 1) : interestFilter;

    var filter = ''
    filter = priceFilter + '|' + lengthFilter + '|' + countryFilter + '|' + citiesFilter + '|' + interestFilter;

    return filter;    
}
function ShowPacks(page) {
    if (page == 1) {
        $(window).scrollTop(0);
        $('#errMessage').hide();
        $('#msgNoPacks').hide();
        $('#goTop').hide();
        $('#dvResultsNumber').show();
        $('#resultsVal').text('0');

        $('#dvFilterPacks').html('<div class="col-12" style="text-align:center;padding:35px 0;background-color:white;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br><div style="color:navy;">Loading ...</div></div>');
    } else {
        $('#dvMore_' + page).html('<div style="text-align:center;padding-top:10px;background-color:white;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br><div style="color:navy;">Loading ...</div></div>');
    }
           
    var filter = BuildFilterExpression();
    var awsQ = $('#awsQ').val();
    var sort = $('#orderByVal').val()



    console.log("/SearchPackages q = " + awsQ + ", filter = " + filter + ", sort = " + sort);
    var options = {};
    options.url = "/SearchPackages";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = '{"site":"", "q":"' + awsQ + '", "filter":"' + filter + '", "sort":"' + sort + '", "page":"' + page + '"}';
    options.dataType = "html";
    options.success = function (data) {
            if (page == 1) {
                $('#dvFilterPacks').html(data);
                $('#goTop').show();
            }
            else {
                $('#dvMore_' + page).css("display", "none");
                $('#dvFilterPacks').append(data);
            }

            var noOfpacks = $('#noOfPacks').val();
            if (noOfpacks == 0 || noOfpacks == undefined) {
                $('#goTop').hide();
                if (filter == '||||') {
                    $('#errMessage').show();
                    $('#dvResultsNumber').hide();
                } else {
                    $('#msgNoPacks').show();
                }                
            } else {
                $('#resultsVal').text(noOfpacks);
            }
    };
    options.error = function (xhr, desc, exceptionobj) {
            $('#dvPacks').html(xhr.responseText);
            $('#dvWait').html('');
            $('#dvWait').hide();
            $('#dvPacks').show();
    };
    $.ajax(options);
}
function displayPackInfo(dvPackInfoName) {
    if($('#'+dvPackInfoName).is(":visible")){
        $('#' + dvPackInfoName).hide();
        $('#' + dvPackInfoName.replace("divInfo", "divInfoArrow")).removeClass("packIncludeDown").addClass("packIncludeUp");
    }
    else{
        $('#' + dvPackInfoName).show();
        $('#' + dvPackInfoName.replace("divInfo", "divInfoArrow")).removeClass("packIncludeUp").addClass("packIncludeDown");
    }        
}