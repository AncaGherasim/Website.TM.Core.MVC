// JavaScript Document
var isNumber = /[0-9]+/g;
$(document).ready(function () {
	$('.dvEachMoreDeals').click(function () { var dt = this.lang; MoreDeals(dt); })
	$('.dvMEachCouInfo').click(function () { var dt = this.lang; countryDeal(dt); })
	$('.dvMCustomize, .dvMbEachPk').click(function () {
		window.location = this.lang
	});
});
function MoreDeals(objId) {
	$('.dvEachMoreDesc').each(function () {
		var divId = $(this).attr('id');
		var isNum = divId.match(isNumber);
		objId == isNum ? (
			$('#' + divId + '').is(':visible') == false ? (
                $('#' + divId + '').slideDown(),
        $('#spArrow' + isNum + '').css('transform', 'rotate(270deg)')
            ) : (
                $('#' + divId + '').slideUp(),
        $('#spArrow' + isNum + '').css('transform', 'rotate(90deg)')
                )
        ) : (
			$('#' + divId + '').slideUp(),
            $('#spArrow' + isNum + '').css('transform', 'rotate(90deg)')
		);
	});
}
function countryDeal(obj) {
	$('.dvMCouPkList').each(function () {
		var dvID = this.id;
		var idNa = dvID.substr(0 , dvID.indexOf('List'));
		obj == idNa ? (
			$('#' + dvID + '').is(':visible') == false ? (
                $('#' + dvID + '').slideDown(),
        $('.spArrow' + idNa + '').css('transform', 'rotate(270deg)')
            ) : (
                $('#' + dvID + '').slideUp(),
        $('.spArrow' + idNa + '').css('transform', 'rotate(90deg)')
                )
        ) : (
			$('#' + dvID + '').slideUp(),
			$('.spArrow' + idNa + '').css('transform', 'rotate(90deg)')
		);
	});
}