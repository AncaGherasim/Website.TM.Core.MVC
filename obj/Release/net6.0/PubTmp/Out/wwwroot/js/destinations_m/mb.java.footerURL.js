$(document).ready(function() {

    OpenDestinations()

    var site = GetParameterValues('site');

    if (site == undefined || site == '' || site == 'all') {
        $('#dvCountrytd').toggleClass('dvCountryDown');
        $('#dvListtd').slideToggle(500);

    }
    else {
        $('#dvCountry' + site + '').toggleClass('dvCountryDown');
        $('#dvList' + site + '').slideToggle(500);
    }
    
    ;

    $('div [id^="dvCountry"]').click(function() {


        var openID = $(this).attr('id');

        var splitID = openID.split("try");
        var ListID = splitID[1];
        $(this).toggleClass('dvCountryDown')
        $('#dvList' + ListID + '').slideToggle(500);
        $('#dvPlay' + ListID + '').toggleClass('dvPlayDw');
        $('#dvPlay' + ListID + '').toggleClass('dvPlayUp');

    });

    $('div [id^="dvItin"]').click(function() {
        var dID = $(this).attr('id').match(isNumber);
        var dPS = $(this).position();
        $(this).toggleClass('dvFeaItiner');
        $(this).toggleClass('dvFeaItinerRot');
        $('#dvInfo' + dID + '').slideToggle(400);
        if ($('#dvInfo' + dID + '').is(':visible') == true) { scrollToTop(dPS.top); }
    });

});




function OpenCityList(cityId) {

    $('#dvInfo' + cityId + '').slideToggle();
    $('#cnArrow' + cityId + '').toggleClass('cnArrowUp');
    $('#cnName' + cityId + '').toggleClass('cnNameUp');
    $('.dvCtyNaOff').click(function() {
        var goTo = $(this).attr('lang');
        document.location.href = location.protocol + '//tripmasters.com/' + goTo.replace(/\s/g, '_');

    });
    $('.dvCtySeeMore').click(function() {
        var smID = $(this).attr('id');
        var splitSMID = smID.split("More");
        var goToSM = splitSMID[1];
        document.location.href = location.protocol + '//tripmasters.com/' + goToSM.replace(/\s/g, '_') + '_Destinations.aspx';

    });
     
}

function OpenDestinations() {
    var regId = ["0","243", "182", "595"];
    var regTit = ["td", "ed", "ld", "asia"];
    var ind;
    var regionId;
    var Title;
    var boxName;
		for (ind = 0; ind < regId.length; ind++) {

		regionId = regId[ind]
		Title = regTit[ind]
		if (regionId == '0') { regionId = '243,595,182' }
  //      GetMobileDest(Title,regionId)
		}
        
    }

    function GetMobileDest(Title,regionId) { 

    		$.ajax({
		    url: "/Mobile/GET_Mobile_Destinations.aspx",
		    data: 'Title=' + Title + '&regionId=' + regionId,
		    type: "GET",
		    success: function(data) {
		    $('#FeedsContainer' + Title + '').html(data);
		       // document.getElementById(boxName).innerhtml = data;
		    },
		    error: function(xhr, desc, exceptionobj) {
		        $('#FeedsContainer' + Title + '').html(xhr.responseText);
		    }

		});
    
    }
    
    
    
    
function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}  


