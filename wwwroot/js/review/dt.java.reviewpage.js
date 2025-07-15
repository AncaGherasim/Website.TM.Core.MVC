// JavaScript Document
var objRev = [];
var objAjax;
var objData;
var objRev;
var objFilt;
var PGtotal;
var isNumber = /[0-9]+/g;
var numPg = 1;
var sortPg = 1;
$(document).ready(function(){

	var options = {};
	options.url = SiteName + "/Api/getDataReviewFirst";
	options.type = "POST";
	options.contentType = "application/json";
	options.dataType = "json";
	options.success = function (data) {
		objAjax = data;
		sortReview(objAjax);
	};
	options.error = function (xhr, desc, exceptionobj) {
		alert(xhr.responseText);
		$('#dvReviews').html(xhr.responseTex);
	};
	$.ajax(options);

	$('.rad').click(function(){
		sortPg = this.value;
		numPg = 1;
		objRev = [];
		sortReview(objAjax);
	});
	$('.dvfilter').click(function () {
		$('#dvReviews').html('<div id="imgWait" style="padding:100px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
	    numPg = 1;
        filterReview(this.id);
	});
});
function sortReview(obj) {
    objRev = [];
    objData = obj;
	var objC = 0;
	$('#reviewTotal').val(objData.length);
	var iID = '';
	jQuery.each(objData, function(objData){
	if(objC == 0){
		iID = this.PCCID;
	}
	else{
		if(objC % 10 == 0){
			objRev.push(iID);
			iID = this.PCCID;
		}
		else{
			iID = iID +','+ this.PCCID;
		};					
	};
	objC++;
	});
	if (objC == objData.length) { objRev.push(iID); callReviewData(numPg);createPagination();  };
};
function filterReview(num) {
    objFilt = objAjax;
    objFilt = $.grep(objFilt, function (scr) { return (scr.Score == num); });
    setTimeout(function () { sortReview(objFilt) }, 300);
};
function callReviewData(pg) {
    var nwDv = '';
	var nwPg = Number(numPg - 1);
	var options = {};
	options.url = SiteName + "/Api/getDataReviewPage";
	options.type = "POST";
	options.contentType = "application/json";
	options.data = JSON.stringify(objRev[nwPg]);
	options.dataType = "json";
	options.success = function (data) {
		rvData = data;
	        var rvDest, rvLink, rvType;
	        jQuery.each(rvData, function(rvData) {
	            nwDv = nwDv + '<div class="dveachReview">';
				nwDv = nwDv + '<div class="dvEachRvwLeft">';
				/* Mofify logic to include dept if UserID is null */
	            switch (true) {
					case (this.STR_UserId === 243 || this.dept === 1615):
	                    rvDest = 'Europe';
                        rvLink = '/europe/'; //'https://www.tripmasters.com/europe/';
	                    break;
	                case (this.STR_UserId === 182 || this.dept === 1617):
	                    rvDest = 'Latin America';
                        rvLink = '/latin/'; //'https://www.tripmasters.com/latin/';
	                    break;
	                case (this.STR_UserId === 595 || this.dept === 1425):
	                    rvDest = 'Asia & South Pacific';
                        rvLink = '/asia/'; //'https://www.tripmasters.com/asia/';
						break;				
				};

	            this.PCC_PDLID != 0 ? rvType = 1 : rvType = 0;
	            rvType === 1 ? this.PDL_NoWeb === true ? rvType = 0 : '' : '';
	            if (rvType == 1) {
					var cC = 0;
					nwDv = nwDv + '<span class="spEaReLeLine"><a href="' + rvLink + this.CountryNA.toLowerCase() + "/" + this.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/feedback-' + this.PCC_PDLID + '">' + this.PDL_Title + '</a></span>';
	                nwDv = nwDv + '<span class="spEaReLeLine"><font class="fntLightText">(' + this.NoOfFeed + ' reviews)</font></span>';
	                if (this.STP_Save != 9999 && this.STP_Save != 0) {
	                    nwDv = nwDv + '<span class="spEaReLeLine"><font class="darkText" style="padding-bottom:2px!important;">Price for this package starting at </font><font class="orangeText"><b>' + formatCurrency(this.STP_Save) + '*</b></font></span>';
	                };
	                if (this.RelatePlaces != null) {
	                    var jsplaces = this.RelatePlaces.trim().slice(0, -1).split('@');
	                    nwDv = nwDv + '<span class="spEaReLeLine"><b>See Reviews for:</b> <br/>';
	                    cC = 0;
	                    jsplaces.forEach(function(a) {
							var plcLn = a.split('|');
							nwDv = nwDv + '<a class="alightcolor" href="' + rvLink + plcLn[0].trim().replace(/\s/g, '_').toLowerCase() + '/trips_taken_by_travelers">' + plcLn[0].trim() + '</a>';
	                        cC == jsplaces.length - 1 ? '' : nwDv = nwDv + ' <font style="color:#999"> - </font> ';
	                        cC++
	                    });
	                    nwDv = nwDv + '</span>';
	                }
	                nwDv = nwDv + '</div>';
	            }
	            else {
	                nwDv = nwDv + '<span class="spEaReLeLine"><a href="' + rvLink + '">Explore ' + rvDest + '</a></span> </div>';
	            };
	            nwDv = nwDv + '<div class="dvEachRvwRight">';

	            if (this.OverallScore != -999 && this.OverallScore != 0) {	                
					nwDv = nwDv + '<div style="padding:0px 0 10px 0px;position:relative;"><img alt="' + this.OverallScore + '" src="https://pictures.tripmasters.com/siteassets/d/Stars_' + this.OverallScore + '_Stars.gif"/><span class="darkText" style="font-weight:normal;padding:0 0 0 8px;position:absolute;margin-top:0px;">(' + this.OverallScore + ' out of 5)</span></div>';
	            }	            
				if (this.TCF_FeedbackReceivedTime != null) {
					var date_tcf = new Date(this.TCF_FeedbackReceivedTime);
					var dd = date_tcf.getDate();
					var mm = date_tcf.getMonth() + 1;

					var yyyy = date_tcf.getFullYear();
					if (yyyy > 2000) {
						if (dd < 10) {
							dd = '0' + dd;
						}
						if (mm < 10) {
							mm = '0' + mm;
						}
						var today = mm + '/' + dd + '/' + yyyy;
						nwDv = nwDv + '<span class="spEaReLeTitle">Date:</span><span class="spEaReLeDesc">' + today + '</span> <br style="clear:both"/>'
					}
	            }
	            nwDv = nwDv + '<p>' + FormatCustomerComment(this.PCC_Comment) + ' </p>';
	            if (rvType == 1) {
	                var ccC = 0;
	                nwDv = nwDv + '<div class="dvLinearTopBgRev dvitinInclude"> <span class="spEaReRiLeft"> <b>Itinerary Details:</b><br/>';
	                nwDv = nwDv + '<font>' + this.PCC_Itinerary.replace(/\n/g, "<br />") + '</font>';
	                nwDv = nwDv + '</span>';
	                if (this.RelatePlaces != null) {
	                    var jscities = this.RelatePlaces.trim().slice(0, -1).split('@');
	                    nwDv = nwDv + '<span class="spEaReRiRight"> <b>Places visited in this trip:</b>';
	                    nwDv = nwDv + '<p class="pPlcVisit">'
	                    jscities.forEach(function(c) {
	                        var ctyLn = c.split('|');
	                        if (ctyLn[2] == 25 || ctyLn[2] == 1) {
								ccC == 0 ? '' : nwDv = nwDv + ' <font style="color:#999"> - </font> '
								nwDv = nwDv + '<a class="alightcolor" href="' + rvLink + ctyLn[0].trim().replace(/\s/g, '_').toLowerCase() + '/vacations">' + ctyLn[0].trim() + '</a>';
	                            ccC++;
	                        };
	                    });
	                    nwDv = nwDv + '</p>';
	                    nwDv = nwDv + '<br/>';
	                    nwDv = nwDv + '<b>More choices, combine cities found in this Itinerary:</b><br/>';
	                    nwDv = nwDv + '<form name="frm' + this.PCCID + '" id="frm' + this.PCCID + '" method="post"><ul class="dvColumn">';
	                    var frmval = this.PCCID;
	                    var jsctyfind = this.RelatePlaces.trim().slice(0, -1).split('@');
	                    var cP = 0;
	                    jsctyfind.forEach(function(c) {
	                        var naid = c.split('|');
	                        if (naid[2] == 25 || naid[2] == 1) {
	                            nwDv = nwDv + '<li><span class="spCheckBox">';
	                            nwDv = nwDv + '<a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + frmval + naid[1].trim() + '" >' + naid[0] + '</a>';
	                            nwDv = nwDv + '</span>';
	                            nwDv = nwDv + '<input type="checkbox" name="dop' + frmval + naid[1].trim() + '" id="dop' + frmval + naid[1].trim() + '" style="display:none" value="' + c.trim() + '"/></li>';
	                        };
	                    });
	                    nwDv = nwDv + '</ul><input type="hidden" name="allID" id="allID" value="" />';
	                    nwDv = nwDv + '<input type="hidden" name="allNA" id="allNA" value="" />';
	                    nwDv = nwDv + '</form>';
	                    var formNA = "'frm" + this.PCCID + "'";
	                    var formLK = "'" + rvLink + "'";
	                    nwDv = nwDv + '<p class="pSimilar"><a class="alightcolor" href="/" onclick="findSimilar(' + formNA + ',' + formLK + '); return false;">>> Find similar itineraries</a></p>';
	                    nwDv = nwDv + '</span> <br style="clear:both"/>';
	                } else {
	                    nwDv = nwDv + '<span class="spEaReRiRight"></span><br style="clear:both"/>';
	                }
	                nwDv = nwDv + '</div>';
	            }
	            nwDv = nwDv + '</div>';
	            nwDv = nwDv + '<br style="clear:both"/>';
	            if (rvType == 1) {
					nwDv = nwDv + '<div class="spBgLinearBlue" style="padding-right:15px; width:98%;display: inline-flex">';
					nwDv = nwDv + '<p class="bookItButton"><a class="button" href="' + rvLink + this.CountryNA.toLowerCase() + '/' + this.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + this.PCC_PDLID + '">Customize a trip like this one</a></p>';
	                nwDv = nwDv + '</div>';
	            }
	            nwDv = nwDv + '</div>';
	            nwDv = nwDv + '<div class="dvhr">&nbsp;</div>';
	        });
	        $('#dvReviews').html(nwDv);
		checkBoxes();

	};
	options.error = function (xhr, desc, exceptionobj) {
		alert(xhr.responseText);
		$('#dvReviews').html(xhr.responseTex);
	};
	$.ajax(options);
};
function findSimilar(formID, siteUrl){
	if ($('#' + formID + ' #allID').val() != '') {
		$('#' + formID + ' #allID').val('')
	}
	if ($('#' + formID + ' #allNA').val() != '') {
		$('#' + formID + ' #allNA').val('')
	}
	var idString = $('#' + formID).serialize();
	if (idString.indexOf("&__") > 0) {
		idString = idString.substring(0, idString.indexOf("&__"));
	}
	var idStrParts
	var idValP
	var idValN
	var idID
	var idNA
	var chkCHK = 0
	idString = idString.replace(/\+/g, ' ');
	idString = idString.replace(/\%7C/g, '|');
	idStrParts = idString.split('&');
	for (i = 0; i < idStrParts.length; i++) {
		idValP = idStrParts[i].split('=');
		if (idValP[1] != '') {
			chkCHK = chkCHK + 1
			idValN = idValP[1].split('|');
			if (chkCHK > 1) {
				idID = idID + ',' + idValN[1];
				idNA = idNA + '_-_' + idValN[0].replace(/\s/g, '-');
			}
			else {
				idID = idValN[1];
				idNA = idValN[0].replace(/\s/g, '-');
			}
		}
	}

	if (idID == undefined) {
		alert('Please check at least one box. Thanks!');
		return;
	}
	else {
		$('#' + formID + ' #allID').val(idID);
		$('#' + formID + ' #allNA').val(idNA);       
		window.location = siteUrl + idNA.toLowerCase() + "/find-packages";
	}
};
function checkBoxes(){
		// check for what is/isn't already checked and match it on the fake ones
		$("input:checkbox").each( function() {
			(this.checked) ? ($("#falsedop"+this.id.match(isNumber)+"").addClass('falsecheckeddop')) : $("#falsedop"+this.id.match(isNumber)+"").removeClass('falsecheckeddop');
		});
		// function to 'check' the fake ones and their matching checkboxes
		$(".falsecheckdop").click(function(){
			replID = this.id.match(isNumber);
			if (($(this).hasClass('falsecheckeddop'))) {
				$(this).removeClass('falsecheckeddop')
				$('#dop' + replID + '').removeAttr('checked');
			} else {
				$(this).addClass('falsecheckeddop');
				$('#dop' + replID + '').attr('checked', true);
			};
			return false;
		});
};
function FormatCustomerComment(comment) {
    var commentBold = "";
    var commentNorm = "";
    comment = comment.trim();
    if (comment.length == 0)
        return "";
    if (comment.indexOf("---") != -1)
        return comment.replace(/\n/g, "<br />");
    var regex = new RegExp("[!?.]");
    if (regex.test(comment)) {
        var res = comment.match(regex);
        if (res != null) {
            commentBold = comment.substring(0, res.index + 1);
            commentNorm = comment.substring(res.index + 1);
        }
        else {
            commentBold = comment;
            commentNorm = "";
        }
    }
    return "<b>" + commentBold.replace(/\n/g, "<br />") + "</b>" + commentNorm.replace(/\n/g, "<br />");
}

function createPagination() {
	$('.dvPaginas').pagination('destroy');
	PGtotal = objRev.length
	$('.dvPaginas').pagination({
		pages: PGtotal,
		itemsOnPage: 10,
		cssStyle: 'light-theme',
		onPageClick: function (page, event) {
			scroll(0, 0);
			clickPG = 1;
			$('#dvReviews').animate({ 'opacity': '.0' }, 100);
			$('#dvReviews').html('<div id="imgWait" style="padding:100px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
			$('#dvReviews').animate({ 'opacity': '1' }, 0);
			numPg = page;
			callReviewData(page);
			return false;
		}
	});
};
var num;
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num)) num = '0';
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) cents = '0' + cents;
	var untilTO = Math.floor(num.length);
	untilTO = Number(untilTO) - 1;
	for (var i = 0; i < Math.floor(Number(untilTO + i) / 3); i++)
		num = num.substring(0, Number(num.length) - (4 * i + 3)) + ',' + num.substring(Number(num.length) - (4 * i + 3));
	return (((sign) ? '' : '-') + '$' + num); 
};
