var containerName = "ctl00_ContentPlaceHolder1_";
var rates = [{ label: 'Dissatisfied', className: 'disatisfied' }, { label: 'Somewhat Dissatisfied', className: 'some_satisfied' }, { label: 'Somewhat Satisfied', className: 'satisfied' }, { label: 'Satisfied', className: 'satisfied' }, { label: 'Completely Satisfied', className: 'satisfied'}];
$(document).ready(function() {
    $('.star-rating').mouseover(function() {
        var serviceId = $(this).attr("id").split('_')[1];
        var starRate = $(this).attr("id").split('_')[2];
        for (i = 1; i <= 5; i++) {
            if (i <= starRate) {
                if (!$('#s_' + serviceId + '_' + i).hasClass("star-rating-selected"))
                    $('#s_' + serviceId + '_' + i).addClass("star-rating-selected");
            }
            else {
                if ($('#s_' + serviceId + '_' + i).hasClass("star-rating-selected"))
                    $('#s_' + serviceId + '_' + i).removeClass("star-rating-selected");
            }
        }
        $('#rate_' + serviceId + '_descr').show().text('(' + starRate + ' out of 5)');
        $('#rate_' + serviceId + '_descrFull').show().html('<span class="' + rates[starRate - 1].className + '">' + rates[starRate - 1].label + '</span>');
    }).on('click touchend', function() {
        var serviceId = $(this).attr("id").split('_')[1];
        var starRate = $(this).attr("id").split('_')[2];
        $('#rate_' + serviceId).val(starRate);
		switch(serviceId){
			case "1":
				$('#serviceScore').val(starRate);
			break;
			case "2":
				$('#sitebpScore').val(starRate);
			break;
			case "3":
				$('#flightScore').val(starRate);
			break
			case "4":
				$('#hotelScore').val(starRate);
			break;
			case "5":
				$('#transferScore').val(starRate);
			break;
			case "6":
				$('#ssScore').val(starRate);
			break;
			case "7":
				$('#carrentalScore').val(starRate);
			break;
			case "8":
				$('#trainScore').val(starRate);
			break;
			case "9":
				$('#ferryScore').val(starRate);
			break;	
		};
    });
    $('.ServiceContainer').mouseout(function() {
        var serviceId = $(this).attr("id").split('_')[1];
        var serviceRate = $('#rate_' + serviceId).val();
        for (i = 1; i <= 5; i++) {
            if (i <= serviceRate) {
                if (!$('#s_' + serviceId + '_' + i).hasClass("star-rating-selected"))
                    $('#s_' + serviceId + '_' + i).addClass("star-rating-selected");
            }
            else {
                if ($('#s_' + serviceId + '_' + i).hasClass("star-rating-selected"))
                    $('#s_' + serviceId + '_' + i).removeClass("star-rating-selected");
            }
        }
        if (serviceRate == 0) {
            $('#rate_' + serviceId + '_descr').hide();
            $('#rate_' + serviceId + '_descrFull').hide();
        }
        else {
            $('#rate_' + serviceId + '_descr').text('(' + serviceRate + ' out of 5)');
            $('#rate_' + serviceId + '_descrFull').html('<span class="' + rates[serviceRate - 1].className + '">' + rates[serviceRate - 1].label + '</span>');
        }
    });

    $('ul.usingAgain li').click(function() {
        $('ul.usingAgain li').removeClass("selectedItem").addClass("unselectedItem");
        $(this).removeClass("unselectedItem").addClass("selectedItem");
        var valSel = $(this).attr("id").replace('u', '');
        $('#' + containerName + 'usingVal').val(valSel);
		$('#userUsing').val(valSel);
    });

    $('ul.options li').click(function() {
        $('ul.options li').removeClass("selectedItem").addClass("unselectedItem");
        $(this).removeClass("unselectedItem").addClass("selectedItem");
        var valSel = $(this).attr("id").replace('o', '');
        $('#opVal').val(valSel);
        $('#opVal_Descr').val($(this).text());
		$('#userRate').val(valSel);
    });

    if ($('#feedRcvd').val() == "True") {
        $('#submitBotton').hide();
        AlignThankMess('dvThank');        
    }

    var expOpt = $('#opVal').val();
    $('#ulExperienceOptions li[id^="o' + expOpt + '"]').removeClass("unselectedItem").addClass("selectedItem");
    $('#ulExperienceOptionsSel li[id^="Li' + expOpt + '"]').removeClass("unselectedItemSel").addClass("selectedItemSel");

    // --- If we found values for star rating ---
    for (i = 1; i <= 9; i++) {
        var rate = $('#rate_' + i).val();
        if (rate == undefined)
            break;
        if (rate != 0) {
            for (j = 1; j <= rate; j++) {
                $('#s_' + i + '_' + j).addClass('star-rating-selected');
            }
            $('#rate_' + i + '_descr').show().text('(' + rate + ' out of 5)');
            $('#rate_' + i + '_descrFull').show().html('<span class="' + rates[rate - 1].className + '">' + rates[rate - 1].label + '</span>');
        } else {
            $('#rate_' + i + '_descr').hide();
            $('#rate_' + i + '_descrFull').hide();
        }
    }
    // --- END If we found values for star rating ---
    $('#submitBotton').on('click touchend', function() {
		var isU = 0;
        var isO = 0;
        $('.unselectedItem').length === 7 ? ($('#valYN').show(), $('#rateOverall').show(), $("html, body").scrollTop(0))
		:
		$('.selectedItem').each(function() {
		    this.id.indexOf('u') > -1 ? isU = 1 : '';
		    this.id.indexOf('o') > -1 ? isO = 1 : '';
		});
		isU === 1 && isO === 1 ? ($('#userReview').val($('#revContent').val()), webServiceConnection() )
			:
			(
				isU === 1 ? $('#valYN').hide() : ($('#valYN').show(), $("html, body").scrollTop(0)),
				isO === 1 ? $('#rateOverall').hide() : ($('#rateOverall').show(), $("html, body").scrollTop(0))
			);
    });
});
function AlignThankMess(divid) {
    $('#bgshow').show();    
    var w = $('#'+divid+'').width();
    var ow = $('#'+divid+'').outerWidth();
    var ml = (w + (ow - w)) / 2;
    $('#'+divid+'').show().css("left", "50%");
    $('#'+divid+'').show().css("margin-left", "-" + ow / 2 + "px");
    $('#'+divid+'').show().css("top", "200px");
    $('#'+divid+'').show();
}

function HideThankMess(divid) {
    $('#bgshow').hide();
    $('#'+divid+'').hide();
}
function CustomValidatorClientValidate(source, arguments) {
	return false;
    var usingVal = $('#usingVal').val();
    var unselItems = $('ul.usingAgain li.unselectedItem').length;
        
    if (usingVal == -1 || unselItems==2) {
        arguments.IsValid = false;        
        $("html, body").scrollTop(0);    
    } else {
        arguments.IsValid = true;
    };
};
function CustomTextValidatorClientValidate(source, arguments) {
    var comment = $('#revContent').val();
    if (comment.length<15) {
        arguments.IsValid = false;        
        $("html, body").scrollTop(0);
    } else {
        arguments.IsValid = true;
    };
};
function CustomExpValidatorClientValidate(source, arguments) {
    var usingVal = $('#opVal').val();
    var unselItems = $('ul.options li.unselectedItem').length;
    if (usingVal == -1 || unselItems == 5) {
        arguments.IsValid = false;        
        $("html, body").scrollTop(0);
    } else {
        arguments.IsValid = true;
    };
};

function webServiceConnection(){
	AlignThankMess('dvAjax');
	$("html, body").scrollTop(0);
	var formValues = $('#formAjax').serializeObject();
	var formJson = getFormData($('#formAjax'));
	$.ajax({
		url: "/Api/GetReview",
		data: JSON.stringify(formValues),
		contentType: "application/json",
		type: "POST",
		success: function(html) {
			html === "Success" ? webServiceSuccess(formJson): webServiceFail();
	},
		error: function(xhr, desc, exceptionobj) {
		   alert(xhr.responseText);
		}
	});
};
var dvError = '<div ID="dvErrMess" visible="false" style="padding:20px 0px;">' +
				'<div style="margin:0 auto; border:solid 1px #ccc; padding:30px; font-family:Arial, Helvetica, sans-serif; max-width:640px;">' +
				'<p><img src="https://pictures.tripmasters.com/siteassets/d/TM_Header.png" alt="TripMaster.com"/></p>' +
				'<div ID="dvLblErr" style="color:#006;font-size:18px">We are sorry that we are unable to save your review at this time.</div>' +               
				'</div>' +
				'</div>'
function webServiceFail(){
	HideThankMess('dvAjax');
	$('.dvMainContainer').hide();
	$('#errMess').length === 0 ? $(dvError).insertAfter($('#dvAjax')) : '';
}
var dvExp = '<div id="dvExp" style="padding:30px 0px 40px 10px;">' +
			'<ul id="ulExperienceOptionsSel" class="options">' +                                        
			'<li id="Li5" class="unselectedItemSel">Completely Satisfied</li>' +
			'<li id="Li4" class="unselectedItemSel">Satisfied</li>' +
			'<li id="Li3" class="unselectedItemSel">Somewhat Satisfied</li>' +
			'<li id="Li2" class="unselectedItemSel">Somewhat Dissatisfied</li>' +
			'<li id="Li1" class="unselectedItemSel">Dissatisfied</li>' +
			'</ul>' +                           
			'</div>';
var dvUse ='<div id="dvUse" style="display:inline;padding:0px 0px 0px 30px;">' +
			'<img align="absmiddle" style="border-width:0px;border:none;" src="https://pictures.tripmasters.com/siteassets/d/checkmark.png">' +
			'<span id="useLbl" class="txt_boldBlack14"></span>' +
			'</div>';
var dvRev = '<div style="height:235px;width:900px;margin:25px 0px 0px 10px;border:none;" id="dvRevContentReadOnly"></div>';
var dvPre = '<div id="dvPreSelect"></div>';   
function webServiceSuccess(frmVal){
	HideThankMess('dvAjax');
	AlignThankMess('dvThank');
	$('#rateOverall').hide();
	$('#valYN').hide();
	$('#topText').hide();
	$('#topLbl').show();
	$('#ulExperienceOptions').hide();
	$('#dvExp').length === 0 ? ($(dvExp).insertAfter($('#ulExperienceOptions')), $('#Li'+frmVal.userRate+'').toggleClass('unselectedItemSel selectedItem')):'';
	$('#ulUse').hide();
	$('#dvUse').length === 0 ? ($(dvUse).insertAfter($('#valYN')), $('#useLbl').html(frmVal.userUsing != 1? 'No' : 'Yes')) : ''
	$('#revContent').hide()
	$(dvRev).insertAfter($('#revContent'));
	$('#dvRevContentReadOnly').html(frmVal.userReview);
	$('#dvUserSelect').hide();
	$('#submitBotton').hide();	
	$('#dvLinks').length === 0 ? $('#dvLinksJS').show() : '' ;	
	$('#dvPreSelect').length === 0 ? ($(dvPre).insertBefore($('#dvUsMoreLine'))):'';
	$.each(frmVal, function(i, e){
			var dvSel = '';	
			var srvcNA = '';
			var srvcID = 0;
			switch(i){
				case 'serviceScore':
					srvcNA = 'Customer service';
					srvcID = 1;
				break;
				case 'sitebpScore':
					srvcNA = 'Website';
					srvcID = 2;
				break;
				case 'flightScore':
					srvcNA = 'Flights';
					srvcID = 3;
				break;
				case 'hotelScore':
					srvcNA = 'Hotels';
					srvcID = 4;
				break;
				case 'transferScore':
					srvcNA = 'Transfers';
					srvcID = 5;
				break;
				case 'ssScore':
					srvcNA = 'Activities';
					srvcID = 6;
				break;
				case 'carrentalScore':
					srvcNA = 'Car Rentals';
					srvcID = 7;
				break;
				case 'trainScore':
					srvcNA = 'Trains';
					srvcID = 8;
				break;
				case 'ferryScore':
					srvcNA = 'Ferries';
					srvcID = 9;
				break;
			};	
			if (srvcID > 0 && e != 'N/A') {
				dvSel = '<div class="dvEachSrvc" style="padding-left:10px; margin:0px 10px; height:46px;">' +
				'<div style="color:#ec7f15;float:left;padding:14px 0px 0px 10px;">&#9632;&nbsp;&nbsp;</div>' +
				'<div style="width:250px;float:left;padding:15px 0px 0px 4px;">'+ srvcNA +'</div>' +
				'<div id="container_'+ srvcID +'_PreSelected" class="ServiceContainer-preselected">'                                    
				for(j=1;j<=5;j++){	
					j <= e ? dvSel = dvSel + '<div class="star-rating-selected" title="'+j+'"></div>' : dvSel = dvSel + '<div class="star-rating-preselected" title="'+j+'"></div>' ;  
				}    
				dvSel = dvSel + '</div>' +   
				'<div style="float:left;margin-left:10px;color:#929191;padding:15px 0px 0px 0px;">('+ e +' out of 5)</div>' +                               
				'<div style="float:left;margin-left:20px;padding:15px 0px 0px 0px;"><span class="' + rates[Number(e - 1)].className + '">' + rates[Number(e - 1)].label + '</span></div>' +
				'<div style="clear:both;"></div>' +                                                                  
				'</div>';
			
			};
			$('#dvPreSelect').append(dvSel);
	});
    $('#dvStatusJS').css('display','block');                
    $('#feedReceived').val('True');
};
function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};
    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
};
$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};