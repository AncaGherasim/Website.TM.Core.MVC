var containerName = "ctl00_ContentPlaceHolder1_";
var rates = [{ label: 'Dissatisfied', className: 'disatisfied' }, { label: 'Somewhat Dissatisfied', className: 'some_satisfied' }, { label: 'Somewhat Satisfied', className: 'satisfied' }, { label: 'Satisfied', className: 'satisfied' }, { label: 'Completely Satisfied', className: 'satisfied'}];
$(document).ready(function() {
    $('.star-rating').on('click touchend', function() {
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
        $('#rate_' + serviceId).val(starRate);
        $('#rate_' + serviceId + '_descrFull').show().html('<span class="' + rates[starRate - 1].className + '">' + rates[starRate - 1].label + '</span>');
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

    $('ul.usingAgain li').click(function() {
        $('ul.usingAgain li').removeClass("selectedItem").addClass("unselectedItem disabledText");
        $(this).removeClass("unselectedItem disabledText").addClass("selectedItem");
        var valSel = $(this).attr("id").replace('u', '');
        $('#usingVal').val(valSel);
		$('#userUsing').val(valSel);
    });

    $('ul.options li').click(function() {
        $('ul.options li').removeClass("selectedItem").addClass("unselectedItem");
        $(this).removeClass("unselectedItem").addClass("selectedItem");
        var valSel = $(this).attr("id").replace('o', '');
        $('#opVal').val(valSel);
		$('#userRate').val(valSel);
    });

    if ($('#hfFeedRcvd').val() == "True") {
        $('#dvSubmit').hide();
		AlignThankMess('dvThank');
    }

    var expOpt = $('#opVal').val();
    $('#ulExperienceOptions li[id^="o' + expOpt + '"]').removeClass("unselectedItem").addClass("selectedItem");
    $('#ulExperienceOptionsSel li[id^="Li' + expOpt + '"]').removeClass("unselectedItemSel").addClass("selectedItemSel");

    var using = $('#usingVal').val();
    var notUsed = using == 0 ? 1 : 0;
    $('#ulUseSel li[id^="Li' + using + '"]').removeClass("unselectedItemSel").addClass("selectedItemSel");
    $('#ulUseSel li[id^="Li' + notUsed + '"]').css("display","none");
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
    $('#'+divid+'').show().css("top", "30px");
    $('#'+divid+'').show();
}

function HideThankMess(divid) {
    $('#bgshow').hide();
    $('#'+divid+'').hide();
}
function webServiceConnection(){
	$('.dvMobMainContainer').hide();
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
var dvError = '<div ID="dvErrMess" runat="server" visible="false" style="padding:20px 0px;">' +
				'<div style="margin:0 auto; border:solid 1px #ccc; padding:17px; font-family:Arial, Helvetica, sans-serif; max-width:85%;">' +
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
var dvUse ='<div id="dvUse">' +
			'<ul class="usingAgainSel" runat="server">' +
            '<li id="useLbl" class="selectedItemSel"></li>' +
			'</div>';
var dvRev = '<div style="height:235px;width:900px;margin:25px 0px 0px 10px;border:none;" id="dvRevContentReadOnly"></div>';
var dvPre = '<div id="dvPreSelect"></div>';   
function webServiceSuccess(frmVal){
	HideThankMess('dvAjax');
	$('.dvMobMainContainer').show();
	AlignThankMess('dvThank');
	$('#rateOverall').hide();
	$('#valYN').hide();
	$('#ulExperienceOptions').hide();
	$('#dvExp').length === 0 ? ($(dvExp).insertAfter($('#ulExperienceOptions')), $('#Li'+frmVal.userRate+'').toggleClass('unselectedItemSel selectedItem')):'';
	$('#ulUse').hide();
	$('#dvUse').length === 0 ? ($(dvUse).insertAfter($('#ulUse')), $('#useLbl').html(frmVal.userUsing != 1? 'No' : 'Yes')) : ''
	$('#revContent').hide()
	$(dvRev).insertAfter($('#revContent'));
	$('#dvRevContentReadOnly').html(frmVal.userReview);
	$('#dvUserSelect').hide();
	$('#submitBotton').hide();	
	$('#dvPreSelect').length === 0 ? ($(dvPre).insertBefore($('#dvSubmit'))):'';
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
				'<div style="padding:0 0 7px 3px;">'+ srvcNA +'</div>' +
				'<div id="container_'+ srvcID +'_PreSelected" class="ServiceContainer-preselected">'                                    
				for(j=1;j<=5;j++){	
					j <= e ? dvSel = dvSel + '<div class="star-rating-selected" title="'+j+'"></div>' : dvSel = dvSel + '<div class="star-rating-preselected" title="'+j+'"></div>' ;  
				}    
				dvSel = dvSel + '</div>' +                              
				'<div style="float:left;margin-left:20px;padding:5px 0px 0px 0px;"><span class="' + rates[Number(e - 1)].className + '">' + rates[Number(e - 1)].label + '</span></div>' +
				'<div style="clear:both;"></div>' +                                                                  
				'</div>';
			
			};
			$('#dvPreSelect').append(dvSel);
	});	
      $('#dvStatusJS').css('display','');                
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