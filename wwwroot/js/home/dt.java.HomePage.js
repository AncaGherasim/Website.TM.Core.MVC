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
	showRecently();
	$('select[id*="iChild"]').click(function () {
		/iChild/g.test(this.id) === true ? $('#' + this.id + '').select().removeClass('errorClass') : '';
	});
});

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

function openMask() {
	var maskH = $(document).height();
	$('.dvMask').css({ 'height': maskH });
	$('.dvMask').fadeIn(1000);
	$('.dvMask').fadeTo("slow", 0.9);
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
