//Javascript Document
// *************************************** //
// NEW HOME PA
// *************************************** //

var depCities = [];
var arrivalCities = [];
var myDate = new Date();
var backCookie;
var visitID;

$(function () {
	var toshow;
	var tohide;
	var todata;
	$('div[id^="info"]').click(function () {
		toshow = this.id.match(/[\d\.]+/g);
		todata = this.getAttribute("data-id").split("|");
		$('div[id^="divInfo"]').each(function () {
			tohide = this.id.match(/[\d\.]+/g);
			Number(toshow) != Number(tohide) ?
				(
					$('#divInfo' + tohide + '').is(":visible") ? (
						$('#divInfo' + tohide + ', #arrowInfo' + tohide + '').slideUp(),
						$('#info' + tohide + '').toggleClass('opened', function () { otherMoreDetails(todata[0], todata[1], 1) })
					) : ''
				)
				:
				$('#divInfo' + toshow + '').is(":visible") ?
					($('#divInfo' + toshow + ', #arrowInfo' + toshow + '').slideUp(), $('#info' + toshow + '').toggleClass('opened', function () { otherMoreDetails(todata[0], todata[1], 1) }))
					:
					($('#divInfo' + tohide + ', #arrowInfo' + tohide + '').slideDown(), $('#info' + tohide + '').toggleClass('opened', function () { otherMoreDetails(todata[0], todata[1], 1) }));
		})
	});
});
$(document).ready(function () {
	$('.template-RecentlyViewed').hide(),
		$('.moreViewed').hide()
	$('.moreButton').click(function () {
		$('.dvEachHighHide').is(':visible') === false ?
			($(this).html('Close More Highlights & Attractions <span>›</span>'), $('.dvEachHighHide').slideDown(), $('.moreButton span').css('transform', 'rotate(270deg)'))
			: ($(this).html('More Highlights & Attractions <span>›</span>'), $('.dvEachHighHide').slideUp(), $('.moreButton span').css('transform', 'rotate(90deg)'));
	});
	$('.moreHightButt').click(function () {
		$('.dvEachHighHide').is(':visible') === false ?
			($(this).html('Close More Highlights & Attractions'), $('.dvEachHighHide').slideDown())
			: ($(this).html('More Highlights & Attractions'), $('.dvEachHighHide').slideUp());
	});
	if (Cookies.get('ut2') != undefined) {
		var vstIDs = Cookies.get('ut2').split('&');
		var vstID = vstIDs[0].split('=');
		visitID = vstID[1];
	}
	else {
		_ut2Functions.push(function () {
			utValues = _ut2;
			jQuery.each(utValues, function (i, val) {
				if (i == '_utvId') { visitID = val; };
			});
		});
	};
	$('.dvEachPopItinInfo').hide();
	$('.dvEachSpotDstInfo').hide();
	$('.eachSec2Info').hide();
	$('.dvEachIdeasMore').click(function () { var stData = this.getAttribute("data-id").split("|"); otherMoreDetails(stData[0], stData[1], 1); });
	$('.dvIdeasClose span').click(function () { var closeID = this.getAttribute("data-id").split("|"); otherMoreDetails(closeID[0], closeID[1], 0); });
	$('.dvEachPopItin, .eachSec2, .dvEachSpotDst').click(function () { var stData = this.getAttribute("data-id").split("|"); var div = this.getAttribute("class"); popItinInfo(stData[0], stData[1], 1, $(this).position(), div) });
	$('.dvPopItinClose span, eachSec2 span, .dvEachSpotDst span').click(function () {
		var closeID = this.id.match(isNumber);
		(closeID, 0, 0);
	});
	$('.moreViewed, .buildButton, .customBtn, .btnRevMore').click(function () { winlocation(this.getAttribute("data-go-to")); });
	//showRecently();
	$('select[id*="iChild"]').click(function () {
		/iChild/g.test(this.id) === true ? $('#' + this.id + '').select().removeClass('errorClass') : '';
	});
	// **** CALENDAR **** //
	doAjaxOnReady();
	$('.btnAddCty').click(function () { qaddCity(this); });
	$('.btnNoMore').click(function () { byoValidation() });
	$('.dvIntlFly span.wair').click(function () { withAir(this) });
	$('.btnContinue').click(function (event) { submitPrice(); });
});
function doAjaxOnReady() {
	/*  ****  USA DEPARTURE AIRPORTS/CITIES  *** */
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/depCity",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (res) {
			var jsonData = res;
			depCities = $.map(jsonData, function (m) {
				var code = m.plC_Code ? m.plC_Code.trim() : "";
				if (code.toLowerCase() !== "none") {
					return {
						label: m.plC_Title + " - " + m.plC_Code,
						value: m.plC_Title,
						id: m.plcid
					};
				}
			});
			doitDep();
		},
		error: function (xhr, desc, exceptionobj) {
			//alert(xhr.responseText);
		}
	});
	/*  ****  ALL DESTINATIONS ARRIVAL AIRPORTS/CITIES *** */
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/priorCity",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (res) {
			jsonDataArr = res;
			arrivalCities = $.map(jsonDataArr, function (m) {
				return {
					label: m.ctyNA + " (" + m.couNA + ")  - " + m.ctyCOD,
					value: m.ctyNA + " (" + m.couNA + ")",
					id: m.ctyID,
					code: m.ctyCOD,
					dept: m.deptNA,
					hotapi: m.hotelAPI
				};
			});
			cookieCheck();
		},
		error: function (xhr, desc, exceptionobj) {
			//alert(xhr.responseText);
		}
	});
};

//function showRecently() {
//	//console.log("showRecently visitID: ");
//	//console.log(visitID);

//	$.ajax({
//		url: "/Api/RecentlyViewed",
//		contentType: "application/json; charset=utf-8",
//		dataType: "json",
//		data: JSON.stringify({ Name: visitID }),
//		type: "POST",
//		success: function (data) {
//			//console.log("Api/RecentlyViewed: ");
//			//console.log(data);
//			let pkVisited = data;
//			var visC = 0;
//			pkVisited ? visC = pkVisited.length : "";

//			visC > 0 ?
//				(
//					$('.template-RecentlyViewed').show(),
//					$('.dvRecentlyTitle').find('span').html("[" + visC + "]"),
//					buildRecentlyViewed(pkVisited),
//					visC > 5 ? $('.moreViewed').show() : $('.moreViewed').hide()
//				)
//				:
//				(
//					$('.template-RecentlyViewed').hide(),
//					$('.moreViewed').hide()
//				);
//		},
//		error: function (xhr, desc, exceptionobj) {
//			console.log(xhr);
//		}
//	});

//	return false;
//};

//function buildRecentlyViewed(jsonObj) {
//	var objC = 0;
//	var siteURL;
//	var newVisit = "";
//	var visited = "";
//	jQuery.each(jsonObj, function (data) {
//		objC++;
//		if (objC < 6) {
//			switch (this.UTS_Site) {
//				case 'TMED':
//					siteURL = "/europe" //"http://www.tripmasters.com/europe";				
//					break;
//				case 'TMASIA':
//					siteURL = "/asia" //"http://www.tripmasters.com/asia";				
//					break;
//				case 'TMLD':
//					siteURL = "/latin" //"http://www.tripmasters.com/latin";				
//					break;
//			};
//			var timestamp = Date.parse(this.UTS_Date);
//			var jsdate = new Date(timestamp);
//			var today = new Date();
//			var lastVst = timeBetween(jsdate, today)
//			visited = visited +
//				'<li>' +
//				'<div class="div-ContainerFlex" >' +
//				'<div class="wrapper">' +
//				'<img src="https://pictures.tripmasters.com' + this.IMG_Path_URL.toLowerCase() + '" alt="' + this.PDL_Title + '">' +
//				'<div>' +
//				'<h5><a href="' + this.UTS_URL + '">' + this.PDL_Title + '</a></h5>' +
//				'</div>' +
//				'</div>' +
//				'<div class="div-UnderImg">' +
//				'<p class="p-under1">Viewed ' + lastVst + '</p>'
//			if (this.feedbacks > 0) {
//				visited = visited + '<p class="p-under1">' +
//					'<a href="' + this.UTS_URL.replace("/package", "/feedback") + '">' + this.feedbacks + ' Customer Reviews</a>' +
//					'</p>'
//			};
//			visited = visited + '<hr class="hr1">' +
//				'<a href="' + this.UTS_URL + '" class="allRecViewBtn">Customize It</a>' +
//				'</div>' +
//				'</div >' +
//				'</li >'
//		};
//	});

//	$('#ulRecentlyViewed').append(visited)
//	$('.template-RecentlyViewed').slideDown();
//};


function winlocation(url) {
	window.location = url;
};
function buildFromCook(build) {
	var cookieValues = JSON.parse(getItemF("localStorageTMAdvancedBYO"));
	var cokC = 0;
	var cokL = Object.keys(cookieValues).length
	var cokR;
	if (build === 1) {
		jQuery.each(cookieValues, function (i, e) {
			i === 'qWair' ? e === 'False' ? $('.dvIntlFly').find('span:contains("Without Air")').trigger('click') : $('.dvIntlFly').find('span:contains("With Air")').trigger('click') : '';
			i === 'qCabinOpt' ? $('#qCabinOpt option[value="' + e + '"]').attr('selected', 'selected') : "";
			/qNACity/.test(i) === true ? (i.match(isNumber) > 1 ? $('.dvByoCalButtons').find('span:contains("ADD DESTINATION")').trigger('click') : '', $('#' + i + '').val(e)) : '';
			/qIDCity|qSTCity|qCOCity|qAPICity|qLeave|qReturnNA|qArrDate/.test(i) === true ? $('#' + i + '').val(e) : '';
			/qgoingID/.test(i) === true ? ($('#' + i + '').val(e), cokR = e) : '';
			cokC += 1;
			cokC === cokL ? (
				removeItemF("localStorageTMAdvancedBYO"),
				dateByDest(cokR)) : '';
		});
	};
};
function startAgain(obj) {
	var objTxt = obj.innerHTML;
	switch (true) {
		case /Without/.test(objTxt):
			$('.dvIntlFly').find('span:contains("Without")').trigger('click');
			break;
		case /With Air/.test(objTxt):
			$('.dvIntlFly').find('span:contains("With Air")').trigger('click');
			break;
	}
	$('#xcabinRoomPax').val('1 Room, 2 Travelers, Economy');
	$('#xiRoomsAndPax').val('1|2');
	selectRoomPax('1|2');
	$("select[id^='xiAdults']").val('')
	$("select[id^='xiChild']").val('')
	$("select[id^='xRoom2_iAdults']").val('')
	$("select[id^='xRoom2_iChild']").val('')
	$("select[id^='xRoom3_iAdults']").val('')
	$("select[id^='xRoom3_iChild']").val('')
	$('#myModal, .modal-content').slideUp();
	$('.dvTransportation').hide().removeAttr('style');
	$('.dvMask').hide().removeAttr('height');
	$('div.dvtranspCityList').remove();
	$('#dvTranspError').hide();
};
function withAir(obj) {
	$(obj).className === 'spselect' ? '' :
		(
			$('.dvIntlFly .spselect').removeClass('spselect'),
			$(obj).addClass('spselect'),
			/Without/.test(obj.innerHTML) === true ? hideAir('H') : hideAir('S')
		);
};
function hideAir(evt) {
	evt === 'H' ? ($('.dvAirParam').slideUp('slow'), $('#qWair').val('False')) : ($('.dvAirParam').slideDown('slow'), $('#qWair').val('True'));
};
function doitDep() {
	$("#qLeaveNA").autocomplete({
		autoFocus: true,
		source: depCities,
		minLength: 3,
		response: function (event, ui) {
			if (ui.content.length === 0) {
				alert('No valid airport found')
				return false;
			};
		},
		select: function (event, ui) {
			$("#qLeaveNA").val(ui.item.value);
			$("#qLeaveID").val(ui.item.id);

			if ($('#qReturnNA').is(':visible')) {
				$("#qReturnNA").val(ui.item.value);
				$("#qReturnID").val(ui.item.id);
			}
			return false;
		},
		close: function (event, ui) {
			var inpTxt = $('#' + event.target.id + '').val();
			if ($('#' + event.target.id + '').val().length >= 3) {
				if ($('#' + event.target.id.replace('NA', 'ID') + '').val() == "-1") {
					var firstElement = $(this).data("ui-autocomplete").menu.element[0].children[0]
						, inpt = $('.ui-autocomplete')
						, original = inpt.val()
						, firstElementText = $(firstElement).text();
					$('#' + this.id + '').val(firstElementText.substring(0, firstElementText.indexOf('-')));
					if (firstElementText == "No result found") {
						$('#' + event.target.id.replace('NA', 'ID') + '').val('-1');
						$('#' + event.target.id + '').val(inpTxt);
					} else {
						$.map(depCities, function (item) {
							$.each(item, function (itemVal) {
								if (itemVal.label == firstElementText) {
									$('#' + event.target.id.replace('NA', 'ID') + '').val(item.id);
									$('#' + event.target.id.replace('NA', 'CO') + '').val(item.code);
								}
							});
						});
					}
				}
			}
		}
	}).click(function () {
		$('#qLeaveNA').select().removeClass('errorClass');
		$('#' + this.id.replace('NA', 'ID') + '').val('-1');

		if ($('#qReturnNA').is(':visible')) {
			$('#qReturnID').val('-1');
		}

		if (IsMobileDevice()) { $('#qLeaveNA').val(''); };
	}).data("ui-autocomplete")._renderItem = function (ul, item) {
		var $a = $("<span></span>").text(item.label);
		highlightText(this.term, $a);
		return $("<li></li>").append($a).appendTo(ul);
	};

	if ($('#qReturnNA').is(':visible')) {
		$("#qReturnNA").autocomplete({
			autoFocus: true,
			source: depCities,
			minLength: 3,
			response: function (event, ui) {
				if (ui.content.length === 0) {
					alert('No valid airport found')
					return false;
				};
			},
			select: function (event, ui) {
				$("#qReturnNA").val(ui.item.value);
				$("#qReturnID").val(ui.item.id);
				return false;
			},
			close: function (event, ui) {
				var inpTxt = $('#' + event.target.id + '').val();
				if ($('#' + event.target.id + '').val().length >= 3) {
					if ($('#' + event.target.id.replace('NA', 'ID') + '').val() == "-1") {
						var firstElement = $(this).data("ui-autocomplete").menu.element[0].children[0]
							, inpt = $('.ui-autocomplete')
							, original = inpt.val()
							, firstElementText = $(firstElement).text();
						$('#' + this.id + '').val(firstElementText.substring(0, firstElementText.indexOf('-')));
						if (firstElementText == "No result found") {
							$('#' + event.target.id.replace('NA', 'ID') + '').val('-1');
							$('#' + event.target.id + '').val(inpTxt);
						} else {
							$.map(depCities, function (item) {
								$.each(item.label, function (itemVal) {
									if (item.label == firstElementText) {
										$('#' + event.target.id.replace('NA', 'ID') + '').val(item.id);
										$('#' + event.target.id.replace('NA', 'CO') + '').val(item.code);
									}
								});
							});
						}
					}
				}
			}
		}).click(function () {
			$('#qReturnNA').select().removeClass('errorClass');
			$('#qReturnID').val('-1');
			if (IsMobileDevice()) { $('#qReturnNA').val(''); };
		}).data("ui-autocomplete")._renderItem = function (ul, item) {
			var $a = $("<span></span>").text(item.label);
			highlightText(this.term, $a);
			return $("<li></li>").append($a).appendTo(ul);
		};
	}

};
function dateByDest(dest) {
	$("#qArrDate").datepicker("destroy");
	var strDate = '';
	strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);
	$('#qArrDate').datepicker({
		defaultDate: strDate,
		changeMonth: false,
		changeYear: false,
		numberOfMonths: 2,
		showButtonPanel: true,
		format: 'yyyy-mm-dd',
		hideIfNoPrevNext: true,
		prevText: '',
		nextText: '',
		minDate: strDate,
		maxDate: "+1Y",
		showOtherMonths: false,
		beforeShow: function (input, inst) { $(this).removeClass('errorClass'); }
	});
};
/*  **** ADD CITIES *** */
function qaddCity(obj) {
	var tofr = obj.id.split(',');
	var fr = Number(tofr[0]);
	var to = Number(tofr[1]);
	if (Number(to) > 12) {
		f
		alert('For best results, no more than 12 cities is allowed. Thanks.');
		return false;
	}
	else if (Number(to) <= 12) {
		let nwDiv = '';
		let selMarkup = '';
		for (let i = 1; i <= 14; i++) {
			selMarkup = selMarkup + `<option value="${i}" ${i === 3 ? "selected" : ''}>${i} ${i > 1 ? 'nights' : 'night'} </option>`
		};
		nwDiv = `<!-- div city ${to} -->
		 <div class="dvByoCalCity" id="dvCity${to}" style="margin-top:10px">
		   <div>
		     <input id="qNACity${to}" type="text" name="qNACity${to}" value="City or airport" />
		     <input type="hidden" name="qIDCity${to}"  id="qIDCity${to}" value="-1" />
		     <input name="qCOCity${to}" type="hidden" id="qCOCity${to}" value=""/>
		     <input name="qAPICity${to}" type="hidden" id="qAPICity${to}" value="" />
		   </div>
		   <div>
		     <span class="spRemoveCity" id="cty${to}" onclick="qdeleteCty(this)">Remove City</span>
		   </div>
		   <div>
		     <select name="qSTCity${to}" id="qSTCity${to}">
               ${selMarkup}
             </select>
		   </div>
		   <br style="clear:both" />\
		</div>`
		var $divBfr = $('#dvCity' + fr);
		$(nwDiv).insertAfter($divBfr);
		doitArr();
		var nxt = Number(to) + 1;
		$('.btnAddCty').attr('id', to + ',' + nxt);
		$('#qNACity' + to).keypress(function () {
			if ($('#' + this.id).val().length == 1) {
				$('#qIDCity' + to).val(-1);
			}
		});
	};
};
/*  **** DELETE CITIES *** */
function qdeleteCty(obj) {
	var cty = Number(obj.id.match(isNumber));
	var nxt = cty + 1;
	var ctTOT;
	ctTOT = $('.dvByoCalCity').length;
	$('#dvCity' + cty + '').remove();
	$('.btnAddCty').attr('id', Number(ctTOT - 1) + ',' + Number(ctTOT));
	for (i = nxt; i <= ctTOT; i++) {
		if ($('#dvCity' + i + '').length > 0) {
			var bfr = i - 1;
			$('#dvCity' + i + '').attr('id', 'dvCity' + bfr + '');
			$('#qNACity' + i + '').attr('name', 'qNACity' + bfr + '');
			$('#qNACity' + i + '').attr('id', 'qNACity' + bfr + '');
			$('#qIDCity' + i + '').attr('name', 'qIDCity' + bfr + '');
			$('#qIDCity' + i + '').attr('id', 'qIDCity' + bfr + '');
			$('#qCOCity' + i + '').attr('name', 'qCOCity' + bfr + '');
			$('#qCOCity' + i + '').attr('id', 'qCOCity' + bfr + '')
			$('#qAPICity' + i + '').attr('name', 'qAPICity' + bfr + '');
			$('#qAPICity' + i + '').attr('id', 'qAPICity' + bfr + '');
			$('#cty' + i + '').attr('id', 'cty' + bfr + '');
			$('#qSTCity' + i + '').attr('name', 'qSTCity' + bfr + '');
			$('#qSTCity' + i + '').attr('id', 'qSTCity' + bfr + '');
			$('#cty' + i + '').attr('id', 'cty' + bfr + '');
			doitArr(bfr);
		};
	};
};
function byoValidation() {
	if ($('#qWair').val() === 'True') {
		if ($('#qLeaveID').val() === '-1') { errorAlert('qLeaveNA', 'Select a valid city or airport'); return false };
		if ($('#qReturnNA').is(':visible')) {
			if ($('#qReturnID').val() === '-1') { errorAlert('qReturnNA', 'Select a valid city or airport to return to'); return false; }
		}
	};
	if ((/\//).test($('#qArrDate').val()) === false) { errorAlert('qArrDate', 'Date is not valid'); return false };
	var cC = 0
	$('form#formBYO input[id^="qIDCity"]').each(function () {
		if (this.value === '-1' && $('#' + this.id.replace('ID', 'NA') + '').val() == 'City or airport') {
			errorAlert(this.id.replace('ID', 'NA'), 'Select a valid city or airport');
			cC -= 1;
		} else if (this.value === '-1') {
			errorAlert(this.id.replace('ID', 'NA'), $('#' + this.id.replace('ID', 'NA') + '').val());
			cC -= 1;
		}
		cC += 1;
		cC === $('form#formBYO input[id^="qIDCity"]').length ? submitForm('formBYO') : '';
	});
};
function submitForm(frmNA) {
	openMask();
	$('.dvTransportation').show().css({ 'position': 'absolute' });
	var stringQuery = '';
	stringQuery = JSON.stringify($('#formBYO').serializeObject());
	stringQuery = JSON.parse(stringQuery);
	delete stringQuery["__RequestVerificationToken"];
	stringQuery = JSON.stringify(stringQuery);
	setItemF("localStorageTMAdvancedBYO", stringQuery, 1);
	var stringForm = ''
	stringForm = $('#' + frmNA + '').serialize();
	var options = {};
	options.url = SiteName + "/Api/Packages/webservTransportationOption";
	options.type = "POST";
	options.contentType = "application/json";
	options.data = JSON.stringify(stringForm);
	options.dataType = "json";
	options.success = function (data) {
		cityData = data.Cities;
		buildTransportationFrom();
	};
	options.error = function (msg) {
		console.log(msg);
	};
	$.ajax(options);
};
// -- Build Transportation Option display after ajax return
function findNextCity(id) {
	var NAcity = '';
	var nextCity = [];
	nextCity = jsonDataArr;
	nextCity = $.grep(nextCity, function (nxt) { return (nxt.ctyID == id); });
	jQuery.each(nextCity, function (nextCity) {
		NAcity = this.ctyNA;
	});
	return NAcity;
};
function buildTransportationFrom() {
	$('.dvSpin').hide();
	$('.dvtranspByoCalTools').show();
	var cookSaved = JSON.parse(getItemF("localStorageTMAdvancedBYO"));
	$('#xaddFlight').val(cookSaved.qWair);
	cookSaved.qWair === 'True' ? ($('span:contains("With Air")').addClass('spselect'), $('span:contains("Without")').removeClass('spselect'), $('.dvtranspAirParam').show()) : '';
	cookSaved.qWair === 'False' ? ($('span:contains("Without")').addClass('spselect'), $('span:contains("With Air")').removeClass('spselect'), $('.dvtranspAirParam').hide()) : '';
	$('#xLeaveCO').val(cookSaved.qLeaveNA);
	$('#xReturnCO').val(cookSaved.qReturnNA);
	$('#xtxtLeavingFrom').val(decodeURIComponent(cookSaved.qLeaveNA));
	$('#xidLeavingFrom').val(cookSaved.qLeaveID);
	$('#xtxtReturningTo').val(decodeURIComponent(cookSaved.qReturnNA));
	$('#xidReturningTo').val(cookSaved.qReturnID);
	$('#xtxtBYArriving').val($('#qArrDate').val());
	$('#xCabin option[value="' + cookSaved.qCabinOpt + '"]').attr('selected', 'selected');
	$('#xgoingID').val(cookSaved.qgoingID);
	// *** CITY LIST WITH TRANSPORTATION
	var jsCity = [];
	var jsCtyInfo = '';
	var jsC = 0;
	var coC = 0;
	var objC = length(cookSaved) - 1;
	$.each(cookSaved, function (i, e) {
		if (i.match(/\d+/g) != null) {
			if (jsC != i.match(/\d+/g)) {
				jsC = Number(i.match(/\d+/g));
				jsC > 1 ? (jsCity.push(jsCtyInfo), jsCtyInfo = '') : '';
				jsCtyInfo = jsCtyInfo + i.match(isNumber) + '@' + e;
			};
			/qNACity/.test(i) === false ? jsCtyInfo = jsCtyInfo + '@' + e : '';
		};
		coC++
		coC === objC ? (jsCity.push(jsCtyInfo), jsCtyInfo = '', buildTransportationTo(jsCity), dvTrans = '') : '';
	});
};
function buildTransportationTo(jscity) {
	try {
		var dvCities = '';
		var totCtys = cityData.length;
		if (totCtys === undefined) {
			var dataCity = JSON.parse(JSON.stringify(cityData));
			var infocity = jscity[0].split('@');
			let selMarkup = ''
			for (i = 1; i <= 14; i++) {
				selMarkup = selMarkup + `<option value="${i}" ${i == infocity[5] ? "selected" : ""}>${i} ${i > 1 ? 'nights' : 'night'}</option>`
			}
			dvCities = dvCities +
				`<div id="cityTo${dataCity['No']}" class="dvtranspCityList">
				 <!-- City Name / ${this.No} /-->
				   <div>
                     <span>${dataCity['No']}. <b>${decodeURIComponent(dataCity['PlaceName'].replace(/\+/g, ' '))}</b></span>
				     <input type="hidden" id="xNOCity${dataCity['No']}" name="xNOCity${dataCity['No']}" value="${dataCity['No']}" />
				     <input name="xNACity${dataCity['No']}" type="hidden" id="xNACity${dataCity['No']}" value="${decodeURIComponent(dataCity['PlaceName'].replace('+', ' '))}"/>
				     <input type="hidden" name="xIDCity${dataCity['No']}"  id="xIDCity${dataCity['No']}" value="${dataCity['PlaceID']}"/>
				     <input name="xCOCitx${dataCity['No']}" type="hidden" id="xCOCitx${dataCity['No']}" value="${infocity[3].trim()}"/>
				     <input name="xAPICity${dataCity['No']}" type="hidden" id="xAPICity${dataCity['No']}" value="${infocity[4].replace(/\%\7C/g, '|').trim()}"/>
				   </div>
				 <!-- Date / Edit-Remove -->
				   <div>
				     <span>
                       ${this.No === '1' ? `<b>${$('#qArrDate').val()}</b>` : '<span class="sptranspRemoveCity goToStartAgain">Edit/Remove</span>'}                  
                     </span>
                   </div>
				 <!-- Staying for -->
				   <div>
                     <span>
				       <select name="xSTCity${dataCity['No']}" id="xSTCity${dataCity['No']}">
                         ${selMarkup}
                       </select>
				     </span>
				  </div>
                  <br style="clear:both;">
                 </div>`
		}
		else {
			var DropOffStartCity = "";
			var DropOffEndCity = 0;
			$.each(cityData, function (city) {
				//console.log(city);
				var nxtCity = findNextCity(this.PlaceToID);
				if (isNaN(Number(this.No)) === true) {
					if (this.No === 'S') {
						var infocityS = jscity[0].split('@');
						dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvtranspCityList" style="margin:0">' +
							'<!-- City Name / S /-->' +
							'<div><span><font size="3">&#8224;</font> Must arrive to <b>' + decodeURIComponent(this.PlaceName) + '</b> </span>' +
							'<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
							'<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + decodeURIComponent(this.PlaceName) + '"/>' +
							'<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
							'<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocityS[3].trim() + '"/>' +
							'<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + infocityS[4].replace(/\%\7C/g, '|').trim() + '"/>' +
							'</div>' +
							'<!-- Date / Edit-Remove -->' +
							'<div>' +
							'<span>' +
							'</span>' +
							'</div>' +
							'<!-- Staying for -->' +
							'<div> <span>' +
							'<input type="hidden" id="xSTCity' + this.No + '" name="xSTCity' + this.No + '" value="0"/>' +
							'</span>' +
							'</div>' +
							'<div>'
						if (this.Options !== null) {
							var dvTranOpt = '';
							var dvTranChck = '<!-- Checkboxes for trasnsport options -->' +
								'<p class="ptranspCheck" id="pCheckBox' + this.No + '">'
							var ctyNo = this.No
							var transpOpt = this.Options;
							var selfCss = 'ptranspSelAct';
							var optCS = 1
							dvCities = dvCities + '<!-- Transport options -->'
							if (transpOpt.Ranking === undefined) {
								$.each(transpOpt, function () {
									if (this.Ranking === 1) {
										dvCities = dvCities + '<input name="xFIELDCityS" type="hidden" id="xFIELDCityS" value="' + this.ProductFreeField1 + '"/>'
										dvCities = dvCities + '<input name="xTRANSCityS" type="hidden" id="xTRANSCityS" value="' + this.ProductType + '"/>'
										dvCities = dvCities + '<input type="hidden" id="xOVNCityS" name="xOVNCityS" value="' + this.Overnight + '"/>'
										dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
										dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
											'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
											'<span><b>' + this.ProductTypeName + '</b>'
										this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
										dvTranOpt = dvTranOpt + '</span>' +
											'<span>' +
											'<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
											'</span> <br style="clear:both">' +
											'</p>'
										selfCss = 'ptranspSelNoAct'
									}
									else {
										dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
										dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
											'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
											'<span> <b>' + this.ProductTypeName + '</b>'
										this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to $$' + infocityS[1] : '';
										dvTranOpt = dvTranOpt + '</span>' +
											'<span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
											'</span> <br style="clear:both">' +
											'</p>'
										optCS++
									};
									if (this.ProductType === 'C') {
										var spDisplay = 'style="display:none"'
										this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
										dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
											'<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
											'<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
											'<span>Pick-up</span>' +
											'<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '">' +
											'<option value="A">Airport</option>' +
											'</select>' +
											'<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '">' +
											'<option value="F">First Day</option>' +
											'<option value="L">Last Day</option>' +
											'</select>' +
											'<br style="clear:both;">' +
											'</p>' +
											'<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
											'<span>Drop-off</span>' +
											'<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '">' +
											'<option value="A">Airport</option>' +
											'</select>' +
											'<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '">' +
											'<option value="L">Last Day</option>' +
											'<option value="F">First Day</option>' +
											'</select>' +
											'<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity" data-city="' + ctyNo + '">'
										if (this.CarDropOff.DOCity.DOPlaceNo !== undefined) {
											dvTranOpt = dvTranOpt + '<option value="' + this.CarDropOff.DOCity.DOPlaceNo + '">' + this.CarDropOff.DOCity.DOPlaceNo.replace(/\+/g, ' ') + '. ' + decodeURIComponent(this.CarDropOff.DOCity.DOPlaceName) + '</option>'
											if (this.Ranking === 1) { DropOffEndCity = this.CarDropOff.DOCity.DOPlaceNo; DropOffStartCity = ctyNo; }
										}
										else {
											var carOpt = this.CarDropOff.DOCity;
											if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
											$.each(carOpt, function () {
												dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
											});
										};

										dvTranOpt = dvTranOpt + '</select>' +
											'<br style="clear:both;">' +
											'</p>' +
											'</span>'
									};
								});
							}
							else {
								$.each(transpOpt, function () {
									if (this.Ranking === 1) {
										dvCities = dvCities + '<input name="xFIELDCityS" type="hidden" id="xFIELDCityS" value="' + this.ProductFreeField1 + '"/>'
										dvCities = dvCities + '<input name="xTRANSCityS" type="hidden" id="xTRANSCityS" value="' + this.ProductType + '"/>'
										dvCities = dvCities + '<input type="hidden" id="xOVNCityS" name="xOVNCityS" value="' + this.Overnight + '"/>'
										dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
										dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
											'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
											'<span><b>' + this.ProductTypeName + '</b>'
										this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
										dvTranOpt = dvTranOpt + '</span>' +
											'<span>' +
											'<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
											'</span> <br style="clear:both">' +
											'</p>'
										selfCss = 'ptranspSelNoAct'
									}
									if (this.ProductType === 'C') {
										var spDisplay = 'style="display:none"'
										this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
										dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
											'<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
											'<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
											'<span>Pick-up</span>' +
											'<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '">' +
											'<option value="A">Airport</option>' +
											'</select>' +
											'<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '">' +
											'<option value="F">First Day</option>' +
											'<option value="L">Last Day</option>' +
											'</select>' +
											'<br style="clear:both;">' +
											'</p>' +
											'<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
											'<span>Drop-off</span>' +
											'<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '">' +
											'<option value="A">Airport</option>' +
											'</select>' +
											'<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '">' +
											'<option value="L">Last Day</option>' +
											'<option value="F">First Day</option>' +
											'</select>' +
											'<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity" data-city="' + ctyNo + '">'
										if (this.CarDropOff !== undefined) {
											var carOpt = this.CarDropOff.DOCity;
											$.each(carOpt, function () {
												if (this.Ranking === 1) { DropOffEndCity = this.DOPlaceNo; DropOffStartCity = ctyNo; }
												dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
											});
										}
										else {
											var carOpt = this.CarDropOff.DOCity;
											if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
											$.each(carOpt, function () {
												dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName.replace(/\+/g, ' ')) + '</option>'
											});
										};
										dvTranOpt = dvTranOpt + '</select>' +
											'<br style="clear:both;">' +
											'</p>' +
											'</span>'
									};
								})

								optCS = 1
							};
							dvTranOpt = dvTranOpt + '<p id="pTranspSel' + ctyNo + '-' + Number(optCS + 1) + '" class="ptranspSelNoAct"><span><b>On your own</b> to ' + nxtCity + '</span><span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button"></span> <br style="clear:both"></p>'
							dvTranChck = dvTranChck + '<input data-type="W" data-field="OWN" data-ovrnts="0" data-rank="' + Number(optCS + 1) + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'
							dvCities = dvCities + dvTranChck + '</p>' + dvTranOpt
						};
						dvCities = dvCities + '</div><br style="clear:both;"></div>'
					};
					if (this.No === 'E') {
						var lst = Number(jscity.length - 1)
						var infocityE = jscity[lst].split('@');
						dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvtranspCityList">' +
							'<!-- City Name / E /-->' +
							'<div><span><font size="3">&raquo;</font> Must depart from <b>' + decodeURIComponent(this.PlaceName) + '</b> </span>' +
							'<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
							'<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + decodeURIComponent(this.PlaceName) + '"/>' +
							'<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
							'<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocityE[3].trim() + '"/>' +
							'<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + infocityE[4].replace(/\%\7C/g, '|').trim() + '"/>' +
							'<input type="hidden" id="xSTCity' + this.No + '" name="xSTCity' + this.No + '" value="0"/>' +
							'<input type="hidden" id="xOVNCity' + this.No + '" name="xOVNCity' + this.No + '" value="0"/>' +
							'</div>' +
							'<!-- Date / Edit-Remove -->' +
							'<div>' +
							'<span></span>' +
							'</div>' +
							'<!-- Staying for -->' +
							'<div> <span>' +
							'</span>' +
							'</div><br style="clear:both;"></div>'
					};
				}
				else {
					var infocity = jscity[Number(this.No - 1)].split('@');
					dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvtranspCityList">' +
						'<!-- City Name / ' + this.No + ' /-->' +
						'<div><span>' + this.No + '. <b>' + decodeURIComponent(this.PlaceName.replace(/\+/g, ' ')) + '</b></span>' +
						'<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
						'<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + this.PlaceName.replace('+', ' ') + '"/>' +
						'<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
						'<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocity[3].trim() + '"/>' +
						'<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + infocity[4].replace(/\%\7C/g, '|').trim() + '"/>' +
						'</div>' +
						'<!-- Date / Edit-Remove -->' +
						'<div>' +
						'<span>'

					if (this.No === '1') {
						dvCities = dvCities + '<b>' + $('#qArrDate').val() + '</b>'
					} else {
						dvCities = dvCities + '<span class="sptranspRemoveCity goToStartAgain">Edit/Remove</span>'
					}
					dvCities = dvCities + '</span>' +
						'</div>' +
						'<!-- Staying for -->' +
						'<div> <span>' +
						'<select name="xSTCity' + this.No + '" id="xSTCity' + this.No + '">'
					for (i = 1; i <= 14; i++) {
						if (i == infocity[5]) { dvCities = dvCities + '<option value="' + i + '" selected>' + i + ' nights</option>' }
						else { dvCities = dvCities + '<option value="' + i + '">' + i + ' nights</option>' }
					};
					dvCities = dvCities + '</select>' +
						'</span>' +
						'</div>' +
						'<div>'
					var selfCss = 'ptranspSelAct';
					var optC = 1
					if (this.Options !== null) {
						var ctyNo = this.No
						var dvTranOpt = '';
						var dvTranChck = '<!-- Checkboxes for trasnsport options -->' +
							'<p class="ptranspCheck" id="pCheckBox' + this.No + '">'
						var transOpt = this.Options;
						if (this.Options[0].Ranking !== null) {
							$.each(transOpt, function () {
								if (this.Ranking === 1) {
									dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="' + this.ProductFreeField1 + '"/>'
									dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="' + this.ProductType + '"/>'
									dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="' + this.Overnight + '"/>'
									dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
									dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
										'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
										'<span><b>' + this.ProductTypeName + '</b>'
									this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
									dvTranOpt = dvTranOpt + '</span>' +
										'<span>' +
										'<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
										'</span> <br style="clear:both">' +
										'</p>'
									selfCss = 'ptranspSelNoAct'
								}
								else {
									dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
									dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
										'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
										'<span> <b>' + this.ProductTypeName + '</b>'
									this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
									dvTranOpt = dvTranOpt + '</span>' +
										'<span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
										'</span> <br style="clear:both">' +
										'</p>'
									optC++;
								};

								if (this.ProductType === 'C') {
									var spDisplay = 'style="display:none"'
									this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
									dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
										'<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
										'<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
										'<span>Pick-up</span>' +
										'<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '">' +
										'<option value="A">Airport</option>' +
										'</select>' +
										'<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '">' +
										'<option value="F">First Day</option>' +
										'<option value="L">Last Day</option>' +
										'</select>' +
										'<br style="clear:both;">' +
										'</p>' +
										'<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
										'<span>Drop-off</span>' +
										'<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '">' +
										'<option value="A">Airport</option>' +
										'</select>' +
										'<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '">' +
										'<option value="L">Last Day</option>' +
										'<option value="F">First Day</option>' +
										'</select>' +
										'<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity" data-city="' + ctyNo + '">'
									if (this.CarDropOff !== null) {
										var carOpt = this.CarDropOff.DOCity;
										$.each(carOpt, function () {
											if (this.Ranking === 1) { DropOffEndCity = this.DOPlaceNo; DropOffStartCity = ctyNo; }
											dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
										});
									}
									else {
										var carOpt = this.CarDropOff.DOCity;
										if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
										$.each(carOpt, function () {
											dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName.replace(/\+/g, ' ')) + '</option>';
										});
									};
									dvTranOpt = dvTranOpt + '</select>' +
										'<br style="clear:both;">' +
										'</p>' +
										'</span>'
								};
							})
							dvTranOpt = dvTranOpt + '<p id="pTranspSel' + ctyNo + '-' + Number(optC + 1) + '" class="ptranspSelNoAct"><span><b>On your own</b> to ' + nxtCity + '</span><span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button"></span> <br style="clear:both"></p>';
							dvTranChck = dvTranChck + '<input data-type="W" data-field="OWN" data-ovrnts="0" data-rank="' + Number(optC + 1) + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>';
							dvCities = dvCities + dvTranChck + '</p>' + dvTranOpt
						}
						else {
							optC = 1;
							var transpOpt = this.Options;
							var dvTranOpt = '';
							var dvTranChck = '<!-- Checkboxes for trasnsport options -->' +
								'<p class="ptranspCheck" id="pCheckBox' + ctyNo + '">'
							var selfCss = 'ptranspSelAct';
							$.each(transpOpt, function () {
								if (this.Ranking === 1) {
									dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="' + this.ProductFreeField1 + '"/>'
									dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="' + this.ProductType + '"/>'
									dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="' + this.Overnight + '"/>'
									dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
									dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
										'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
										'<span><b>' + this.ProductTypeName + '</b>'
									this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
									dvTranOpt = dvTranOpt + '</span>' +
										'<span>' +
										'<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
										'</span> <br style="clear:both">' +
										'</p>'
									selfCss = 'ptranspSelNoAct';
								}
								else {

									dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
									dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
										'<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
										'<span> <b>' + this.ProductTypeName + '</b>'
									this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
									dvTranOpt = dvTranOpt + '</span>' +
										'<span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
										'</span> <br style="clear:both">' +
										'</p>'
									optC++;
								};
								if (this.ProductType === 'C') {
									var spDisplay = 'style="display:none"'
									this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
									dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
										'<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
										'<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
										'<span>Pick-up</span>' +
										'<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '">' +
										'<option value="A">Airport</option>' +
										'</select>' +
										'<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '">' +
										'<option value="F">First Day</option>' +
										'<option value="L">Last Day</option>' +
										'</select>' +
										'<br style="clear:both;">' +
										'</p>' +
										'<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
										'<span>Drop-off</span>' +
										'<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '">' +
										'<option value="A">Airport</option>' +
										'</select>' +
										'<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '">' +
										'<option value="L">Last Day</option>' +
										'<option value="F">First Day</option>' +
										'</select>' +
										'<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity" data-city="' + ctyNo + '">'
									if (this.CarDropOff.DOCity.DOPlaceNo !== undefined) {
										dvTranOpt = dvTranOpt + '<option value="' + this.CarDropOff.DOCity.DOPlaceNo + '">' + this.CarDropOff.DOCity.DOPlaceNo + '. ' + decodeURIComponent(this.CarDropOff.DOCity.DOPlaceName.replace(/\+/g, ' ')) + '</option>'
										if (this.Ranking === 1) { DropOffEndCity = this.CarDropOff.DOCity.DOPlaceNo; DropOffStartCity = ctyNo; }
									}
									else {
										var carOpt = this.CarDropOff.DOCity;
										if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
										$.each(carOpt, function () {
											dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
										});
									};
									dvTranOpt = dvTranOpt + '</select>' +
										'<br style="clear:both;">' +
										'</p>' +
										'</span>'
								};
							});
							dvTranOpt = dvTranOpt + '<p id="pTranspSel' + ctyNo + '-' + Number(optC + 1) + '" class="ptranspSelNoAct"><span><b>On your own</b> to ' + nxtCity + '</span><span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button"></span> <br style="clear:both"></p>'
							dvTranChck = dvTranChck + '<input data-type="W" data-field="OWN" data-ovrnts="0" data-rank="' + Number(optC + 1) + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'
							dvCities = dvCities + dvTranChck + '</p>' + dvTranOpt

						};
					}
					else {
						if (this.No < totCtys && nxtCity != '') {

							var ctyNo = this.No
							var selfCss = 'ptranspSelAct'
							var dvTranChck = '<!-- Checkboxes for trasnsport options -->'


							if (DropOffStartCity != 0) {
								if ((DropOffStartCity < this.No || DropOffStartCity == "S") && (DropOffEndCity == "E" || Number(DropOffEndCity) > this.No)) {
									selfCss = 'ptranspSelNoAct'
								}
							}

							dvTranChck = dvTranChck + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="OWN"/>'
							dvTranChck = dvTranChck + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="W"/>'
							dvTranChck = dvTranChck + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="0"/>' +
								'<p class="ptranspCheck" id="pCheckBox' + ctyNo + '">' +
								'<input data-type="OWN" data-field="W" data-ovrnts="0" data-rank="1" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'

							var dvTranOpt = '<!-- Trasport option selected label -->' +
								'<p id="pTranspSel' + ctyNo + '-1" class="' + selfCss + '">' +
								'<span><b>On your own</b> to ' + nxtCity +
								'</span>' +
								'<span>' +
								'<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
								'</span> <br style="clear:both">' +
								'</p>'

							dvCities = dvCities + dvTranChck + dvTranOpt
						}
					}
					dvCities = dvCities + '</div>'
					dvCities = dvCities + '<br style="clear:both"/>'
					dvCities = dvCities + '</div>'
				};
			});
		} // data city
		$('#dvWaitGlobe').html('').hide();
		$('.dvtranspMainContainer').show();
		$('#dvTranspError').hide();
		$(dvCities).insertAfter('.dvtranspLabels');
		$('.buttontranspChange').click(function () { changeTranspOption(this) });
		$('.selectDropOffCity').change(function () { carSelected($(this).data('city')) });
		$('.checkBox').click(function () { modifyTransportation(this, this.value) });
		$('.goToStartAgain').click(function () { startAgain(this) });
		dvCities = '';
	}
	catch (err) {
		buildTransportationError(err.message);
	};
};
function buildTransportationError(err) {
	$('.goToStartAgain').click(function () { startAgain(this) });
	var cookieValues = JSON.parse(getItemF("localStorageTMAdvancedBYO"));
	var cokC = 0;
	var cokL = Object.keys(cookieValues).length
	var ctys = '';
	jQuery.each(cookieValues, function (i, e) {
		/qNACity/.test(i) === true ? ctys = ctys + "<li>" + e + "</li>" : '';
		cokC += 1;
		cokC === cokL ? (
			removeItemF("localStorageTMAdvancedBYO"),
			$('#sptrancities').html(ctys), $('#perrorCode').html(err), $('.dvWaitGlobe').hide(), $('.dvtranspMainContainer').hide(), $('#dvTranspError').show()) : ''
	});
};

function length(obj) {
	return Object.keys(obj).length;
};
function changeTranspOption(obj) {
	$('p[id^="pTranspSel' + obj.id + '"]').each(function () { this.className === "ptranspSelAct" ? $(this).attr('class', 'ptranspSelNoAct') : '' });
	$('#pCheckBox' + obj.id + '').show();
};
function modifyTransportation(obj, q) {
	$('#xFIELDCity' + q + '').val($(obj).data('field'));
	$('#xTRANSCity' + q + '').val($(obj).data('type'));
	$('#xOVNCity' + q + '').val($(obj).data('ovrnts'));
	$('#pCheckBox' + q + '').hide();
	$('#pTranspSel' + q + '-' + $(obj).data('rank') + '').attr('class', 'ptranspSelAct');
	$(obj).data('type') === 'C' ? ($('#carOptions' + q + '').show(), carSelected(q)) : ($('#carOptions' + q + '').hide(), carNoSelected(q));
};
function carSelected(q) {
	var carTot = $('.dvtranspCityList').length;
	var carStr = q;
	carStr === 'S' ? (carStr = 1, carTot = Number(carTot) - 1) : carStr = Number(carStr) + 1;
	var carEnd = $('#xdropoffCity' + q + '').val();
	carEnd === 'E' ? ($('#cityToS').length === 1 ? (carEnd = $('.dvtranspCityList').length - 1, carTot = Number(carTot) - 1) : carEnd = carTot) : '';
	var i;
	for (i = carStr; i <= carTot; i++) {
		i < carEnd ? (
			$('#xFIELDCity' + i + '').val(''),
			$('#xTRANSCity' + i + '').val(''),
			$('p[id^="pTranspSel' + i + '').attr('class', 'ptranspSelNoAct'),
			$('#carOptions' + i + '').is(':visible') === true ? $($('#carOptions' + i + '').hide()) : ''
		) : '';
		if (i >= carEnd) {
			let isSelected = false;
			$('p[id^="pTranspSel' + i + '"]').each(function () {
				this.className == "ptranspSelAct" ? isSelected = true : ''
			});
			if (!isSelected) {
				$('#xFIELDCity' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('field'));
				$('#xTRANSCity' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('type'));
				$('#xradioTrans' + i + '[data-rank="1"]').prop('checked', true);
				$('p[id^="pTranspSel' + i + '-1').attr('class', 'ptranspSelAct');
			}
			$('#xFIELDCity' + i + '').val() === 'TBA' ? ($('#carOptions' + i + '').show(), i++) : '';
		}
	};
};
function carNoSelected(q) {
	var carTot = $('.dvtranspCityList').length;
	var carStr = q;
	carStr === 'S' ? (carStr = 1, carTot = Number(carTot) - 1) : carStr = Number(carStr) + 1;
	var carEnd = $('#xdropoffCity' + q + '').val();
	carEnd === 'E' ? ($('#cityToS').length === 1 ? (carEnd = $('.dvtranspCityList').length - 1, carTot = Number(carTot) - 1) : carEnd = carTot) : '';
	var i;
	for (i = carStr; i <= carTot; i++) {
		let isSelected = false;
		$('p[id^="pTranspSel' + i + '"]').each(function () {
			this.className == "ptranspSelAct" ? isSelected = true : ''
		});
		if (!isSelected) {
			$('#xFIELDCity' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('field'));
			$('#xTRANSCity' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('type'));
			$('#xradioTrans' + i + '[data-rank="1"]').prop('checked', true);
			$('p[id^="pTranspSel' + i + '-1').attr('class', 'ptranspSelAct');
		}
		$('#xFIELDCity' + i + '').val() === 'TBA' ? ($('#carOptions' + i + '').show(), i++) : '';
	};
};
function openMask() {
	var maskH = $(document).height();
	$('.dvMask').css({ 'height': maskH });
	$('.dvMask').fadeIn(1000);
	$('.dvMask').fadeTo("slow", 0.9);
};
$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value.trim() || '');
		} else {
			o[this.name] = this.value.trim() || '';
		}
	});
	return o;
};
function errorAlert(obj, mess) {
	var poss = $('#' + obj + '').position();
	$('#' + obj + '').addClass('errorClass').val(mess);
	window.scroll(0, poss.top - 100);
	return false;
};

function replacePicture(picID, picSRS, picTTL, picALT) {
	var picURL;
	picALT === 'none' ? picURL = picSRC : picURL = 'https://pictures.tripmasters.com' + picALT;
	/O/.test(picID) === false ?
		($('img.picSel[id*="Kipic"]').attr('class', 'picNSel'),
			$('img.picSel[id*="Mipic"]').attr('class', 'picNSel'),
			$('#' + picID + '').attr('class', 'picSel'),
			$('.dvFstPic').html('<img src="' + picURL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" />'),
			/M/.test(picID) === true ? ($('#dvMV').hide(), $('#Mipic' + picID.match(isNumber) + '').attr('class', 'picSel')) : ($('#dvMV').show(), $('#dvPicNa').html(picTTL))
		)
		:
		($('img[id*="Oipic"]').attr('class', 'picNSel'),
			$('#' + picID + '').attr('class', 'picSel'),
			/Map/.test(picID) === true || picURL.match(img500) === true ?
				($('.dvshowPIC').html('<img src="' + picURL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '" alt="' + picALT + '" title="' + picTTL + '" width="290" height="290"  class="clsCursor"/>'),
					$('.selM').css('width', '399px'),
					$('#dvallTHU').attr('style', 'width:258px;')
				)
				:
				($('.dvshowPIC').html('<img src="' + picURL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '"  class="clsCursor"/>'),
					$('.selM').css('width', '399px'),
					$('#dvallTHU').attr('style', 'width:258px;')
				)
		);
};
function moreMediaCLS() {
	$('.dvMask').hide().removeAttr('height');
	$('.dvmediaPopUp').hide();
};
// ******************************
// OLD HOME PAGE
// ******************************
var thumPic = '';
var thumMap = '';
var isNumber = /[0-9]+/g;
$(document).ready(function () {
	maskH = $(document).height();
	maskW = $(window).width();

	$('.moreButton').click(function () {
		$('.dvEacHighhHide').is(':visible') === false ?
			($(this).html('Close More Highlights & Attractions '), $('.dvEacHighhHide').slideDown())
			: ($(this).html('More Highlights & Attractions'), $('.dvEacHighhHide').slideUp());
	});
	$('.dvSuggestTitle a, .dvEachSuggest2ndCol').click(function () {
		var suggestID = this.id;
		var $dvInf = $('#divInfo' + suggestID + '');
		$dvInf.is(':visible') == false ? (
			$dvInf.slideDown(),
			$('div.dvEachSuggest2ndCol[id="' + suggestID + '"]').css('transform', 'rotate(270deg)'),
			otherMoreDetails(suggestID, 1)
		)
			:
			(
				$dvInf.slideUp(),
				$('div.dvEachSuggest2ndCol[id="' + suggestID + '"]').css('transform', 'rotate(90deg)')
			);
		return false;
	});
});
function otherMoreDetails(objid, objsite, cls) {
	$('.dvIdeasInfo').each(function () {
		var idDiv = $(this).attr('id');
		var idNum = idDiv.match(isNumber);
		idNum == objid ? (
			$('#' + idDiv + '').is(':visible') == false ? (
				$('#' + idDiv + '').slideDown(),
				$('#dvArrow' + idNum + '').slideDown(),
				$('.dvEachIdeasMore[data-id="' + objid + '|' + objsite + '"]').find('span').css('transform', 'rotate(-90deg)')
			) : (
				$('#' + idDiv + '').slideUp(),
				$('#dvArrow' + idNum + '').slideUp(),
				$('.dvEachIdeasMore[data-id="' + objid + '|' + objsite + '"]').find('span').removeAttr('style')
			)
		) : (
			$('#' + idDiv + '').slideUp(),
			$('#dvArrow' + idNum + '').slideUp(),
			$('.dvEachIdeasMore[data-id*="' + idNum + '"]').find('span').removeAttr('style')
		);
	});
	cls === 1 ? relPackCall(objid, objsite) : '';
};
function relPackCall(packID, site) {
	var relTxt = '';
	var siteLink;
	switch (site) {
		case 'ED':
		case 'TMED':
			siteLink = 'europe'
			break;
		case 'LD':
		case 'TMLD':
			siteLink = 'latin'
			break;
		case 'TMAS':
			siteLink = 'asia'
			break;
	};
	//console.log("relPackCallpackID = " + packID);
	$.ajax({
		type: "POST",
		url: "/Api/Packages/getDataRelPacks",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({ FaqQuestion: packID, FaqResponse: site }),
		crossDomain: true,
		success: function (data) {
			//console.log("Success: " + data.m_StringValue);
			msg = data.m_StringValue;
			if (msg != '') {
				relTxt = '<span>Related Package<br></span>'
				strPrts = msg.split('@');
				//console.log("strPrts.length = " + strPrts.length);
				for (i = 0; i <= strPrts.length - 1; i++) {
					echP = strPrts[i].split('|');
					relTxt = relTxt + '<a href="/' + siteLink + '/' + echP[0].replace(/\s/g, '_') + '/vacations" style="margin-right:10px"><u>' + echP[0] + ' (' + echP[1] + ')</u></a>';
				};
				//console.log("relTxt = " + relTxt);

				$('#dvRelPack' + packID + '').html(relTxt + '<br style="clear:both"/>').slideDown('slow');
			}
		},
		error: function (xhr, desc, exceptionobj) {
			console.log("Error: " + xhr.responseText);
			$('#dvWait' + packID + '').html(xhr.responseText);
		}
	});
};

function scrollToTop() {
	$('body,html').animate({
		scrollTop: 0
	}, 800);
};

function cookieCheck() {
	selectRoomPax('1|2')
	backCookie = getItemF("localStorageTMAdvancedBYO");
	backCookie != null ? (buildFromCook(1), doitArr()) : (dateByDest(), doitArr());
};
function doitArr() {
	$('input[id^="qNACity"]').each(function () {
		var inpID = '' + this.id + '';
		$(this).autocomplete({
			autoFocus: true,
			source: function (request, response) {
				var matcher
				if (request.term.length < 4) {
					matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
				}
				else if (request.term.length >= 4) {
					matcher = new RegExp("\\b" + $.ui.autocomplete.escapeRegex(request.term), "i");
				}
				response($.map(arrivalCities, function (item) {
					if (matcher.test(item.value) || matcher.test(item.code)) {
						return (item)
					}
				}));
			},
			minLength: 3,
			response: function (event, ui) {
				if (ui.content.length === 0 && $('#' + inpID + '').val().length >= 5) {
					$('#' + this.id.replace('NA', 'ID') + '').val('-1');
					ui.content.push({ label: 'No result found', value: "" });
					return false;
				}
			},
			select: function (event, ui) {
				$('#' + this.id + '').val(ui.item.value).removeClass('errorClass');
				$('#' + this.id.replace('NA', 'ID') + '').val(ui.item.id);
				$('#' + this.id.replace('NA', 'CO') + '').val(ui.item.code);
				$("#" + this.id.replace("NA", "API") + "").val(ui.item.hotapi);
				var objNum = this.id.match(isNumber);
				if (Number(objNum) === 1) {
					$("#qgoingID, #xgoingID").val(ui.item.dept);
				};
				return false;
			},
			close: function (event, ui) {
				var inpTxt = $('#' + event.target.id + '').val();
				if ($('#' + inpID + '').val().length >= 3) {
					if ($('#' + event.target.id.replace('NA', 'ID') + '').val() == "-1") {
						var firstElement = $(this).data("ui-autocomplete").menu.element[0].children[0]
							, inpt = $('.ui-autocomplete')
							, original = inpt.val()
							, firstElementText = $(firstElement).text();
						$('#' + this.id + '').val(firstElementText.substring(0, firstElementText.indexOf('-')));
						if (firstElementText == "No result found") {
							$('#' + event.target.id.replace('NA', 'ID') + '').val('-1');
							$('#' + event.target.id + '').val(inpTxt);
						} else {
							$.map(arrivalCities, function (item) {
								$.each(item, function (itemVal) {
									if (item.label == firstElementText) {
										$('#' + event.target.id.replace('NA', 'ID') + '').val(item.id);
										$('#' + event.target.id.replace('NA', 'CO') + '').val(item.code);
										$("#" + event.target.id.replace("NA", "API") + "").val(item.hotapi);
										var objNum = event.target.id.match(isNumber);
										if (Number(objNum) === 1) {
											$("#qgoingID, #xgoingID").val(item.dept);
										};
									}
								});
							});
						}
					}
				}
			}
		}).click(function () {
			$(this).select().removeClass('errorClass');
			$('#' + this.id.replace('NA', 'ID') + '').val('-1');
			$('#' + this.id + '').select();
			if (IsMobileDevice()) { $(this).val(''); };
		}).data("ui-autocomplete")._renderItem = function (ul, item) {
			var $a = $("<span></span>").text(item.label);
			highlightTextBYO(this.term, $a);
			return $("<li></li>").append($a).appendTo(ul);
		};
	});
};
/*  ****  AUTOCOMPLETE FUNCTIONS *** */
function highlightTextBYO(text, $node) {
	var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
	while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
		newTextNode = currentNode.splitText(matchIndex);
		currentNode = newTextNode.splitText(searchText.length);
		newSpanNode = document.createElement("span");
		newSpanNode.className = "highlight";
		currentNode.parentNode.insertBefore(newSpanNode, currentNode);
		newSpanNode.appendChild(newTextNode);
	};
};
/* ******************   Multiroom *************************  */
function selectRoomPax(ro) {
	var valP = ro.split('|');
	$('#xiRoom').val(valP[0]);
	$('#xRooms').val(valP[0]);
	/Other/.test(ro) === true ? (openRoom(valP[0], 1), $('#xiAdults').val(0)) : (openRoom(valP[0], 0), $('#xiAdults option[value="' + valP[1] + '"').attr('selected', 'selected'), otherCleanRoom());
};
function openRoom(rm, no) {
	no === 0 ? ($('.dvtranspAdultChild, #pPaxLabels').slideUp('fast')) : ($('.dvtranspAdultChild, #pPaxLabels').slideDown('fast'));
	$('p[id^="pRoom"]').each(function () {
		this.id.match(isNumber) <= rm ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRoom(this))
	});
};
function cleanRoom(obj) {
	$('#' + obj.id + ' select').each(function () {
		/_iAdults/.test(this.id) === true ? ($('#' + this.id + '').val(0)) : /iChildren/.test('#' + this.id + '') === true ? $(this).val(0) : /iChild/g.test(this.id) === true ? $('#' + this.id + '').val(-1) : '';
	});
};
function otherCleanRoom() {
	$('select[id*="iChild"]').each(function () {
		/iChildren/.test(this.id) === true ? $('#' + this.id + ' option[value="0"]').attr('selected', 'selected') : '';
		/iChild/g.test(this.id) === true ? $('#' + this.id + ' option[value="-1"]').attr('selected', 'selected') : '';
	});
};
function childAge(tag) {
	var rnum;
	tag.id.match(isNumber) === null ? rnum = 1 : rnum = tag.id.match(isNumber);
	var oval = tag.value;
	$('#' + tag.id + '').removeClass('errorClass');
	var totpax = countPax(0);
	if (totpax > 6) {
		alert('Max guest allowed (adults + children) are 6 !');
		$('#' + tag.id + '').addClass('errorClass');
	}
	else {
		$('#pChildAges').show();
		$('#pChildAges' + rnum + '').show().find('select').each(function () { this.id.slice(-1).match(isNumber) <= Number(oval) ? ($(this).show(), $('label[for="' + this.id + '"]').show()) : ($(this).hide().val(-1), $('label[for="' + this.id + '"]').hide('fast', function () { countChilds() <= 0 ? $('#pChildAges').hide() : '' })) });
	};
};
function countChilds() {
	var ch1 = 0; var ch2 = 0; var ch3 = 0;
	$('#pRoom1').is(':visible') === true ? (ch1 = Number($('#xiChildren').val())) : '';
	$('#pRoom2').is(':visible') === true ? (ch2 = Number($('#xRoom2_iChildren').val())) : '';
	$('#pRoom3').is(':visible') === true ? (ch3 = Number($('#xRoom3_iChildren').val())) : '';
	var totChild = ch1 + ch2 + ch3;
	return totChild;
};
function countPax(vs) {
	var vis = vs;
	var pOp = -1;
	var a = [];
	var ch = [];
	var totAdult = 0;
	var totChild = 0;
	var roompax = $('#xiRoomsAndPax').val();
	$('#pRoom1').is(':visible') === true ? (pOp = 0, a[0] = Number($('#xiAdults').val()), totAdult = a[0], ch[0] = Number($('#xiChildren').val()), totChild = ch[0]) : (/Other/.test(roompax) === false ? a[0] = Number($('#xiAdults').val(), totAdult = a[0]) : '');
	$('#pRoom2').is(':visible') === true ? (pOp = 1, a[1] = Number($('#xRoom2_iAdults').val()), totAdult = a[0] + a[1], ch[1] = Number($('#xRoom2_iChildren').val()), totChild = ch[0] + ch[1]) : '';
	$('#pRoom3').is(':visible') === true ? (pOp = 2, a[2] = Number($('#xRoom3_iAdults').val()), totAdult = a[0] + a[1] + a[2], ch[2] = Number($('#xRoom3_iChildren').val()), totChild = ch[0] + ch[1] + ch[2]) : '';
	if (totAdult === 0 && vis === 1) {
		alert('No adults on rooms !');
		if (a[0] === 0) { $('#xiAdults').addClass('errorClass'); };
		if (a[1] === 0) { $('#xRoom2_iAdults').addClass('errorClass') };
		if (a[2] === 0) { $('#xRoom3_iAdults').addClass('errorClass'); };
		return false;
	}
	else if (totAdult > 0 && vis === 1) {
		for (i = 0; i <= pOp; i++) {
			if (i === 0) { $ithis = $('#xiAdults') } else { $ithis = $('#xRoom' + Number(i + 1) + '_iAdults') };
			if (a[i] === 0) { alert('No adults in room ' + Number(i + 1) + '!'); $ithis.addClass('errorClass'); return false; }
			else { if ((totAdult + totChild) > 6) { alert('Max guest allowed (adults + children) are 6 !'); return false; } };
		};
	}
	else {
		if ((totAdult + totChild) <= 6 && $('p[id^="pRoom"]').find('.errorClass').length > 0) {
			$('p[id^="pRoom"]').find('.errorClass').removeClass('errorClass');
			$('select[id*="iChildren"]').each(function () { this.value > 0 ? childAge(this) : '' });
		};
		return totAdult + totChild;
	}
};

function changeAdults(obj) {
	$('#' + obj.id + '').removeClass('errorClass');
	var totpax = countPax(0);
	if (totpax > 6) {
		alert('Max guest allowed (adults + children) are 6 !');
		$('#' + obj.id + '').addClass('errorClass');
	}
};

function childValidAge() {
	var reTrue = true
	if ($('#pRoom1').is(':visible') === true) {
		$('#pRoom1 span[id^="pChildAges"]').find('select').each(function () {
			if ($(this).is(':visible') === true) {
				if ($(this).val() === '-1') { $(this).addClass('errorClass'); reTrue = false; };
			};
		});
		if ($('#pRoom2').is(':visible') === true) {
			$(' #pRoom2 span[id^="pChildAges"]').find('select').each(function () {
				if ($(this).is(':visible') === true) {
					if ($(this).val() === '-1') { $(this).addClass('errorClass'); reTrue = false; };
				};
			});
			if ($('#pRoom3').is(':visible') === true) {
				$('#pRoom3 span[id^="pChildAges"]').find('select').each(function () {
					if ($(this).is(':visible') === true) {
						if ($(this).val() === '-1') { $(this).addClass('errorClass'); reTrue = false; };
					};
				})
			};
		};
		return reTrue;
	} else { return reTrue; };
};
function submitPrice() {
	var paxT = countPax(1);
	if (!childValidAge()) {
		alert('Child age is empty');
		$('.btnContinue').click(function (event) { submitPrice(); });
		return false;
	}
	else {
		if (paxT > 6) {
			alert('Max guest allowed (adults + children) are 6 !');
			$('.btnContinue').click(function (event) { submitPrice(); });
			return false;
		}
		else if (paxT === false) {
			$('.btnContinue').click(function (event) { submitPrice(); });
			return false;
		}
		else {
			submitCompList();
		};
	};
};

/* -------------------------------------- */
var getNumericPart = function (id) {
	var $num = id.replace(/[^\d]+/, '');
	return $num;
}
function submitCompList() {
	var CantContinue = false;
	$("#frmTransp div[id^='cityTo']").each(function () {
		if (!isNaN(parseInt(($(this).attr("id")).replace('cityTo', '')))) {
			var valIdCity = $(this).find("div input[id^='xIDCity']").val();
			var TrueNaCity = findNextCity(valIdCity);
			var valNaCity = $(this).find("div input[id^='xNACity']").val();
			if (TrueNaCity == '') {
				/* ID not finding in nextCity */
				$(this).find("div input[id^='xNACity']").val(TrueNaCity);
				startAgain(this);

				var valNoCity = $(this).attr("id");
				varIdCity = "qNACity" + getNumericPart(valNoCity);
				$("#formBYO input[id='" + varIdCity + "']").val("Select city or airport");
				$("#formBYO input[id='" + varIdCity.replace("NA", "ID") + "']").val(-1);

				CantContinue = true;
				return false;
			}
			else
				if (TrueNaCity != valNaCity) {
					/* ID is ok, but NaCity is not */
					$(this).find("div input[id^='xNACity']").val(TrueNaCity);
				}
		}
	});

	if (CantContinue == true) {
		$('.btnContinue').click(function (event) { submitPrice(); });
		byoValidation();
		return;
	}

	var jsonCompList;
	var queryString = $('#frmTransp').serialize();
	queryString = queryString.substr(0, queryString.indexOf('&__RequestVerificationToken'));
	var jsonQSTR = QueryStringToJSON(queryString);
	var formData = {};
	$('#frmTransp').serializeArray().forEach(function (item) {
		formData[item.name] = item.value;
	});
	var options = {};
	options.url = SiteName + "/Api/Packages/webservComponentList";
	options.type = "POST";
	options.contentType = "application/json";
	options.data = JSON.stringify(formData);
	options.dataType = "json";
	options.success = function (res) {
		jsonCompList = res;
		submitToBP(jsonQSTR, jsonCompList);
	};
	options.error = function (xhr, desc, exceptionobj) {
		console.log(xhr);
	};
	$.ajax(options);
};
function submitToBP(strQ, jsR) {
	var dvWaitBP = '<div style="background:white; width:95%; margin:0 auto"><img src="https://pictures.tripmasters.com/siteassets/m/SearchingAH.gif" style="width:100%; height:100%"/></div>'
	$('.dvMMask').append(dvWaitBP).show();
	var jsRprts = jsR.split('@|@');
	var $subForm = $('#formToBooking');
	var iCity = "";
	if (jsRprts[1] === '1') {
		$subForm.find('input').each(function () {
			/SystemID/.test(this.id) ? this.value = jsRprts[2] : '';
			/PackageComponentList/.test(this.id) ? this.value = jsRprts[0] : '';
			/ByStayNite/.test(this.id) ? this.value = jsRprts[3] : '';
			/GetNextDay/.test(this.id) ? this.value = jsRprts[4] : '';
			/AirVendorAPI/.test(this.id) ? this.value = jsRprts[5] : '';
			/AirP2PVendorAPI/.test(this.id) ? this.value = jsRprts[6] : '';
			/CarVendorAPI/.test(this.id) ? this.value = jsRprts[7] : '';
			/SSVendorAPI/.test(this.id) ? this.value = jsRprts[8] : '';
			/TransferVendorAPI/.test(this.id) ? this.value = jsRprts[9] : '';
			/TICVendorAPI/.test(this.id) ? this.value = jsRprts[10] : '';
			bookingurl = jsRprts[12];
			/GIVendorAPI/.test(this.id) ? this.value = jsRprts[13] : '';
			/addFlight/.test(this.id) ? this.value = strQ.xaddFlight : '';
			/Cabin/.test(this.id) ? (this.value = strQ.xCabin) : '';
			/iDepCity|iRetCity/.test(this.id) ? this.value = strQ.xidLeavingFrom : '';
			/iRetCity/.test(this.id) ? this.value = (strQ.xidReturningTo == undefined ? strQ.xidLeavingFrom : strQ.xidReturningTo) : '';
			/StayCityS/.test(this.id) ? (strQ.xNOCityS ? this.value = strQ.xIDCityS : this.value = strQ.xIDCity1) : ('');
			/StayCityS_Name/.test(this.id) ? strQ.xNOCityS ? this.value = decodeURIComponent(strQ.xNACityS.replace(/\+/g, ' ')) : this.value = decodeURIComponent(strQ.xNACity1.replace(/\+/g, ' ')) : '';
			/StayCityE/.test(this.id) ? (strQ.xNoCityE ? this.value = strQ.xIDcityE : this.value = strQ['xIDCity' + jsRprts[11]]) : ('');
			/StayCityE_Name/.test(this.id) ? (strQ.xNoCityE ? this.value = decodeURIComponent(strQ.xNAcityE.replace(/\+/g, ' ')) : this.value = decodeURIComponent(strQ['xNACity' + jsRprts[11]].replace(/\+/g, ' '))) : ('');
			/Rooms/.test(this.id) ? (this.value = strQ.xRooms, $('#xRooms').val('1')) : '';
			/iRoom/.test(this.id) ? (this.value = strQ.xiRoom, $('#xiRooms').val('1')) : '';
			/iRoomsAndPax/.test(this.id) ? (this.value = decodeURI(strQ.xiRoomsAndPax), $('#xcabinRoomPax').val('1 Room, 2 Travelers, Economy'), $('#xiRoomsAndPax').val('1|2')) : '';
			/iAdults/.test(this.id) ? !/Room/.test(this.id) ? (this.value = strQ.xiAdults, $('#xiAdults').val('2')) : '' : '';
			/iChildren/.test(this.id) ? !/Room/.test(this.id) ? (this.value = strQ.xiChildren, $('#xiChildren').val('')) : '' : '';
			/iChild1/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild1 ? (this.value = strQ.xiChild1, $('#xiChild1').val('')) : '' : '' : '';
			/iChild2/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild2 ? (this.value = strQ.xiChild2, $('#xiChild2').val('')) : '' : '' : '';
			/iChild3/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild3 ? (this.value = strQ.xiChild3, $('#xiChild3').val('')) : '' : '' : '';
			/iChild4/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild4 ? (this.value = strQ.xiChild4, $('#xiChild4').val('')) : '' : '' : '';
			/Room2_iAdults/.test(this.id) ? strQ.xRoom2_iAdults ? (this.value = strQ.xRoom2_iAdults, $('#xRoom2_iAdults').val('')) : this.value = '' : '';
			/Room2_iChildren/.test(this.id) ? strQ.xRoom2_iChildren ? (this.value = strQ.xRoom2_iChildren, $('#xRoom2_iChildren').val('')) : this.value = '' : '';
			/Room2_iChild1/.test(this.id) ? strQ.xRoom2_iChild1 ? (this.value = strQ.xRoom2_iChild1, $('#xRoom2_iChild1').val('')) : this.value = '' : '';
			/Room2_iChild2/.test(this.id) ? strQ.xRoom2_iChild2 ? (this.value = strQ.xRoom2_iChild2, $('#xRoom2_iChild2').val('')) : this.value = '' : '';
			/Room2_iChild3/.test(this.id) ? strQ.xRoom2_iChild3 ? (this.value = strQ.xRoom2_iChild3, $('#xRoom2_iChild3').val('')) : this.value = '' : '';
			/Room2_iChild4/.test(this.id) ? strQ.xRoom2_iChild4 ? (this.value = strQ.xRoom2_iChild4, $('#xRoom2_iChild4').val('')) : this.value = '' : '';
			/Room3_iAdults/.test(this.id) ? strQ.xRoom3_iAdults ? (this.value = strQ.xRoom3_iAdults, $('#xRoom3_iAdults').val('')) : this.value = '' : '';
			/Room3_iChildren/.test(this.id) ? strQ.xRoom3_iChildren ? (this.value = strQ.xRoom3_iChildren, $('#xRoom3_iChildren').val('')) : this.value = '' : '';
			/Room3_iChild1/.test(this.id) ? strQ.xRoom3_iChild1 ? (this.value = strQ.xRoom3_iChild1, $('#xRoom3_iChild1').val('')) : this.value = '' : '';
			/Room3_iChild2/.test(this.id) ? strQ.xRoom3_iChild2 ? (this.value = strQ.xRoom3_iChild2, $('#xRoom3_iChild2').val('')) : this.value = '' : '';
			/Room3_iChild3/.test(this.id) ? strQ.xRoom3_iChild3 ? (this.value = strQ.xRoom3_iChild3, $('#xRoom3_iChild3').val('')) : this.value = '' : '';
			/Room3_iChild4/.test(this.id) ? strQ.xRoom3_iChild4 ? (this.value = strQ.xRoom3_iChild4, $('#xRoom3_iChild4').val('')) : this.value = '' : '';
		});
		var ovt;
		for (i = 1; i <= 12; i++) {
			if (strQ['xIDCity' + i]) {
				var jsNa = decodeURIComponent(strQ['xNACity' + i]);
				jsNa = decodeURIComponent(jsNa.replace(/\+/g, ' '));
				ovt = 0
				iCity = iCity + '<input type="hidden" id="StayCity' + i + '" name="StayCity' + i + '" value="' + strQ['xIDCity' + i] + '"/>';
				iCity = iCity + '<input type="hidden" name="StayCity' + i + '_Name" id="StayCity' + i + '_Name" value="' + jsNa + '" />';
				i === 1 ? iCity = iCity + '<input type="hidden" name="InDate' + i + '" id="InDate' + i + '" value="' + decodeURIComponent(strQ.xtxtBYArriving) + '" />' : '';
				iCity = iCity + '<input type="hidden" name="APICity' + i + '" id="APICity' + i + '" value="' + decodeURIComponent(strQ['xAPICity' + i]) + '"/>';
				iCity = iCity + '<input type="hidden" name="StayNite' + i + '" id="StayNite' + i + '" value="' + strQ['xSTCity' + i] + '"/>';
				strQ['xOVNCity' + i] ? ovt = strQ['xOVNCity' + i] : '';
				iCity = iCity + '<input type="hidden" name="OverNiteT' + i + '" id="OverNiteT' + i + '" value="' + ovt + '"/>';
				$('#formToBooking').append(iCity);
				iCity = "";
			}
			else {
				i = 12;
			};
			i === 12 ? toBPGo() : '';
		};
	}
	else {
		alert('error');
	};
};
function toBPGo() {
	var queryString = $('#formToBooking').serialize();
	document.formToBooking.action = bookingurl;
	document.formToBooking.submit();
	resetForm();
};
function resetForm() {
	$('#xcabinRoomPax').val('1 Room, 2 Travelers, Economy');
	$('#xiRoomsAndPax').val('1|2');
	selectRoomPax('1|2');
	var frmToBook = document.getElementById("formToBooking");
	frmToBook.reset();
	$(frmToBook).find('input').each(function () {
		if (this.id === 'GeneralLoc' || this.id === "bFirst" || this.id === "sortFlag" || this.id === "MinStay" || this.id === "addCar" || this.id === "iOutTime" || this.id === "iInTime" || this.id === "addTransfer_IC" || this.id === "" || this.id == "PkgInstance") {
			//do nothing
		} else {
			$('#' + this.id).val('');
			for (i = 1; i <= 12; i++) {
				$(frmToBook).find('#StayCity' + i).remove();
				$(frmToBook).find('#StayCity' + i + '_Name').remove();
				$(frmToBook).find('#InDate' + i).remove();
				$(frmToBook).find('#APICity' + i).remove();
				$(frmToBook).find('#StayNite' + i).remove();
				$(frmToBook).find('#OverNiteT' + i).remove();
			}
		}
	});
	$('#myModal, .modal-content').slideUp();
	$('.dvTransportation').hide().removeAttr('style');
	$('.dvMask').hide().removeAttr('height');
	$('div.dvtranspCityList').remove();
	$('#dvTranspError').hide();
};

function QueryStringToJSON(str) {
	var pairs = str.split('&');
	var result = {};
	pairs.forEach(function (pair) {
		pair = pair.split('=');
		var name = pair[0]
		var value = pair[1]
		if (name.length)
			if (result[name] !== undefined) {
				if (!result[name].push) {
					result[name] = [result[name]];
				};
				result[name].push(value || '');
			} else {
				result[name] = value || '';
			};
	});
	return (result);
};

function popItinInfo(objid, objsite, cls, pos, div) {
	$('.' + div + 'Info').each(function () {
		var idDiv = $(this).attr("id");
		var idNum = idDiv.match(isNumber);

		idNum == objid ? (

			$('#' + idDiv + '').is(':visible') == false ? (
				$('#' + idDiv + '').slideDown()
			) : (
				$('#' + idDiv + '').slideUp()
			)
		) : (
			''
		);
	});
	cls === 1 ? relPackCall(objid, objsite) : '';
};
