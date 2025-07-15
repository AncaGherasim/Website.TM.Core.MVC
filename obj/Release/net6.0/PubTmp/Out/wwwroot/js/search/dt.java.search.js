// File version
var fileVersion = 08012022;
/////////////////////////

var site = '';
$(document).ready(function () {
    // function to 'check' the fake ones and their matching checkboxes
    $(".falsecheck_1").click(function() {
        ($(this).hasClass('falsechecked_1')) ? $(this).removeClass('falsechecked_1') : $(this).addClass('falsechecked_1');
        $(this.hash).trigger("click");

        var id_ = $(this).attr("id");
        if (id_.substring(0, 1) != '2') {
            ($('#2' + id_).hasClass('falsechecked_1')) ? $('#2' + id_).removeClass('falsechecked_1') : $('#2' + id_).addClass('falsechecked_1');
            $('#2' + id_.replace("false", "")).trigger("click");
        }
        else {
            ($('#' + id_.replace("2", "")).hasClass('falsechecked_1')) ? $('#' + id_.replace("2", "")).removeClass('falsechecked_1') : $('#' + id_.replace("2", "")).addClass('falsechecked_1');
            $('#' + id_.replace("2false", "")).trigger("click");
        }
        return false;
    });

    $('a[id^="falsedotPrice"]').click(function() { ShowPacks(1); });
    $('a[id^="falsedotLen"]').click(function() { ShowPacks(1); });
    $('div[id^="top"] a[id^="falsedotCountry"]').click(function() { ShowPacks(1); });
    $('div[id^="top"] a[id^="falsedotCity"]').click(function() { ShowPacks(1); });
    $('div[id^="top"] a[id^="falsedotInter"]').click(function() { ShowPacks(1); });
    $('#Sort').change(function() { ShowPacks(1); });

    $('#q').val($('#awsQ').val());

    ShowPacks(1);
});
function createPagination(page) {
	$('.dvPaginas').pagination('destroy');
	var PGtotal = $("#noOfPacks").val();	
	
	$('.dvPaginas').pagination({
	    pages: Math.ceil(PGtotal / 10),
		currentPage:page,
		itemsOnPage: 10,
		cssStyle: 'light-theme',
		onPageClick: function (page, event) {
			scroll(0, 0);
			ShowPacks(page);
			return false;
		}
	});
};
function UncheckOptions() {	
	$('input[type="checkbox"][id^="dotPrice"]:checked').each(function () {
		$(this).prop('checked', false);
	});
	$('a[id^="falsedotPrice"]').each(function () {
		$(this).removeClass('falsechecked_1');
	});
		
	$('input[type="checkbox"][id^="dotLen"]:checked').each(function () {
		$(this).prop('checked', false);
	});
	$('a[id^="falsedotLen"]').each(function () {
		$(this).removeClass('falsechecked_1');
	});
		
	$('input[type="checkbox"][id*="dotCountry"]:checked').each(function () {
		$(this).prop('checked', false);
	});
	$('a[id*="falsedotCountry"]').each(function () {
		$(this).removeClass('falsechecked_1');
	});

	$('input[type="checkbox"][id*="dotCity"]:checked').each(function () {
		$(this).prop('checked', false);
	});
	$('a[id*="falsedotCity"]').each(function () {
		$(this).removeClass('falsechecked_1');
    });

    $('input[type="checkbox"][id*="dotInter"]:checked').each(function() {
        $(this).prop('checked', false);
    });
    $('a[id*="falsedotInter"]').each(function() {
        $(this).removeClass('falsechecked_1');
    });

	ShowPacks(1);
}
function unique(array) {
    return $.grep(array, function(el,index) {return index === $.inArray(el, array);});
}
function BuildFilterExpression() {
	var priceFilter = ''
	$('input[type="checkbox"][id^="dotPrice"]:checked').each(function() {
	    priceFilter = priceFilter + $(this).val() + 'P';
	});
	priceFilter = priceFilter.length > 1 ? priceFilter.substring(0, priceFilter.length - 1) : priceFilter;

	var lengthFilter = ''
	$('input[type="checkbox"][id^="dotLen"]:checked').each(function() {
	    lengthFilter = lengthFilter + $(this).val() + 'L';
	});
	lengthFilter = lengthFilter.length > 1 ? lengthFilter.substring(0, lengthFilter.length - 1) : lengthFilter;

	var countryFilter = '', countriesArray=[];
	$('input[type="checkbox"][id*="dotCountry"]:checked').each(function() {countriesArray.push($(this).val().replace(/_/g, ' '));});	
	countriesArray = unique(countriesArray);
	for (var i = 0; i <= countriesArray.length - 1; i++) { countryFilter = countryFilter + countriesArray[i].replace(/_/g, ' ') + '_'; }	    
	countryFilter = countryFilter.length > 1 ? countryFilter.substring(0, countryFilter.length - 1) : countryFilter;

	var citiesFilter = '', citiesArray = [];
	$('input[type="checkbox"][id*="dotCity"]:checked').each(function() { citiesArray.push($(this).val().replace(/_/g, ' ')); });
	citiesArray = unique(citiesArray);
	for (var i = 0; i <= citiesArray.length - 1; i++) { citiesFilter = citiesFilter + citiesArray[i].replace(/_/g, ' ') + '_'; }
	citiesFilter = citiesFilter.length > 1 ? citiesFilter.substring(0, citiesFilter.length - 1) : citiesFilter;

	var interestFilter = '', interestArray = [];
    $('input[type="checkbox"][id*="dotInter"]:checked').each(function () { interestArray.push($(this).val().replace(/_/g, ' ')); });
	interestArray = unique(interestArray);
	for (var i = 0; i <= interestArray.length - 1; i++) { interestFilter = interestFilter + interestArray[i].replace(/_/g, ' ') + '_'; }
	interestFilter = interestFilter.length > 1 ? interestFilter.substring(0, interestFilter.length - 1) : interestFilter;		
			
	var filter = ''
	filter = priceFilter + '|' + lengthFilter + '|' + countryFilter + '|' + citiesFilter + '|' + interestFilter;

	return filter;
}
function ShowPacks(page) {
    $('#dvPacks').hide();
    $('#dvPacks').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    $('#mainContainer').show();
    $('#errMessage').hide();
    $('#topContainer').show();
    $('.dvPagin').show();
    $('span[id^="totalPacks"]').text('');
    
    var filter = BuildFilterExpression();
    var awsQ = $('#awsQ').val();
    var sort = $('#Sort').val()
    var site = $('#site').val();

    console.log("/SearchPackages site = " + site + ", q = " + awsQ + ", filter = " + filter + ", sort = " + sort);
    var options = {};
    options.url = "/SearchPackages";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = '{"site":"' + site + '", "q":"' + awsQ + '", "filter":"' + filter + '", "sort":"' + sort + '", "page":"' + page + '"}';
    options.dataType = "html";
    options.success = function (data) {
        $('#dvPacks').html(data);
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvPacks').show();

        $('.toolTip').each(function () {
            var pakNTSs = $(this).attr('data').replace(/\_/g, " ").split('|')
            var id = '#' + $(this).attr('id');
            $(this).tooltip({
                content: '<div class="Text_Arial12" style="margin:10px">This packages is recommended for ' + pakNTSs[0] + '.<br /><br /><b>customize it </b> ' + pakNTSs[1] + '</div>',
                items: '.toolTip',
                position: { my: "center top", at: "center top-100", of: id },
                show: { delay: 300 },
                tooltipClass: "toolTipCss"
            });
        });

        var noOfpacks = $('#noOfPacks').val();
        if (noOfpacks == 0 || noOfpacks == undefined) {
            if (filter == '||||') {
                $('#mainContainer').hide();
                $('#errMessage').show();
            } else {
                $('#topContainer').hide();
                $('.dvPagin').hide();
                $('#msgNoPacks').html('<div style="padding:20px 0 10px 20px;">No itineraries found, please try other combination. Thank you!</div>')
                $('#msgNoPacks').show();
            }
        } else {
            $('span[id^="totalPacks"]').text(noOfpacks + ' itineraries ');
        }
        SetPages(page);
    };
    options.error = function (xhr, desc, exceptionobj) {
        $('#dvPacks').html(xhr.responseText);
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvPacks').show();
    };
    $.ajax(options);

}
function dvOpenMain(objID) {
    var img = $('#img' + objID.replace("divInfo", ""));
    var imgInf = $('#imgInfo' + objID.replace("divInfo", ""));

    $('#' + objID + '').css("top", img.offset().top - 4).css("left", imgInf.left).show(300);
    $('html, body').animate({ scrollTop: $('#' + objID).offset().top - 200 }, 300);
}
function dvCloseMain(dvM) {
    $('#' + dvM + '').hide(100);
}
function showPopUp(popID) {
    var mess
    var objLoc
    var objT
    var objL
    objLoc = ObjectPosition(document.getElementById(popID));
    objL = objLoc[0] - 5 + 'px';
    objT = objLoc[1] + 16 + 'px';
    if (popID.indexOf('Partially') != -1) {
        mess = '<div style="padding:0px 0px 7px 0px;"><b>Partially Guided:</b></div>'
        mess = mess + '<div>' + $('#inpparGuided').val().replace('.', '.<br><br>') + '</div>';
    }
    else if (popID.indexOf('none') != -1) {
        mess = '<div style="padding:0px 0px 7px 0px;"><b>None:</b></div>'
        mess = mess + '<div>has no value</div>';
    }
    else {
        mess = '<div style="padding:0px 0px 7px 0px;"><b>Guided:</b></div>'
        mess = mess + '<div>' + $('#inpGuided').val().replace('.', '.<br><br>') + '</div>';
    };
    dvMpop = $('<div id="dvMess" class="Text_12_Blue"></div>');
    $('body').append(dvMpop);
    $('#dvMess').html(mess);
    $('#dvMess').attr('style', 'left:' + objL + '; top:' + objT + '; position:absolute; display:block; border:solid 1px black; width:300px; padding:10px; background-color:#FFF;')
    $('#dvMess').show();
};
function hidePopUp(popID) {
    $('#dvMess').hide();
};
function ShowMoreObjects(divName) {                
    $('#' + divName + 'Link').hide();
    $('#' + divName).css("left",($(window).width() - $('#' + divName).width()) / 2).css("top", "50px");
   
    $(window).scrollTop(0);
    $('#dvBack').css("width", "100%").css("height", ($(document).height()+ 200) + "px").show();

    $('#' + divName).show();    
}
function CloseMoreObjects(divName, ScrollTop) {   
    $('#' + divName).hide();
    $('#' + divName + 'Link').show();    
    
    $('#dvBack').hide();
    if (ScrollTop == 1)
        $(window).scrollTop(0);  
    else
        $('html, body').animate({ scrollTop: $('#' + divName.replace('More', 'top')).offset().top - 35 }, 300);                              
}
function ApplyFilters(divName) {
    CloseMoreObjects(divName, 1);
    ShowPacks(1);
}

function SetPages(currentPage) {
    var totalPacks = $('#noOfPacks').val();
    var noPages = Math.ceil(totalPacks / 10);
    var pagesStr = ''
    pagesStr = pagesStr + 'Page(s): '

    if (currentPage > 0) {
        if (noPages <= 7) {
            for (i = 1; i <= noPages; i++) {
                if (i != currentPage)
                    pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(' + i + ')">' + i + '</a></span>';
                else
                    pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
            }
        }
        else {
            if (currentPage < 5) {
                for (i = 1; i <= 5; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(' + i + ')">' + i + '</a></span>';
                    else
                        pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                }

                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(' + noPages + ')">' + noPages + '</a></span>';
            }
            else {
                pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(1)">1</a></span>';
                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';

                if (currentPage + 3 < noPages) {
                    for (i = currentPage - 1; i <= currentPage + 2; i++) {
                        if (i != currentPage)
                            pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(' + i + ')">' + i + '</a></span>';
                        else
                            pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                    }

                    pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                    pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(' + noPages + ')">' + noPages + '</a></span>';
                }
                else {
                    for (i = noPages - 4; i <= noPages; i++) {
                        if (i != currentPage)
                            pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="ShowPacks(' + i + ')">' + i + '</a></span>';
                        else
                            pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                    }
                }
            }
        }
        $('div[id^="idPages"]').addClass('dvPaginNoContent').html(pagesStr);
        $('div[id="idPages2"] a').click(function () { scrollTo(0, 0); })
    } else {
        pagesStr = pagesStr + '<span class="spNumSelect">0</span>';
        $('div[id^="idPages"]').addClass('dvPaginNoContent').html(pagesStr);
        $('div[id="idPages2"] a').click(function () { scrollTo(0, 0); })
    }
}
