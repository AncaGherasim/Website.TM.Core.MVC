$(document).ready(function () {
	$('#btnMore').click(function () {
		$('#toHide').is(':visible') === false ?
			($("#toHide").slideDown(), $('#toHide').removeClass('toHide'), $('#toHide'), $(this).html('Show Less')) : ($("#toHide").slideUp(), $('#toHide').addClass('toHide'), $(this).html('Show More'));
	});
	initSwiper();
});
function initSwiper() {
	var swiper = new Swiper(".mySwiper1", {
		navigation: {
			nextEl: ".swiper-button-next1",
			prevEl: ".swiper-button-prev1",
		},
		breakpoints: {
			// when window width is >= 320px
			320: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			// when window width is >= 1000px
			1000: {
				slidesPerView: 3,
				spaceBetween: 20
			}
		}
	});
	var swiper2 = new Swiper(".mySwiper2", {
		navigation: {
			nextEl: ".swiper-button-next2",
			prevEl: ".swiper-button-prev2",
		},
		breakpoints: {
			// when window width is >= 320px
			320: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			// when window width is >= 1000px
			1000: {
				slidesPerView: 3,
				spaceBetween: 20
			}
		}
	});
	var swiper3 = new Swiper(".mySwiper3", {
		navigation: {
			nextEl: ".swiper-button-next3",
			prevEl: ".swiper-button-prev3",
		},
		breakpoints: {
			// when window width is >= 320px
			320: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			// when window width is >= 1000px
			1000: {
				slidesPerView: 3,
				spaceBetween: 20
			}
		}
	});
}
/*function showRecently() {
	$.ajax({
		url: "/Api/RecentlyViewed",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({ Name: visitID }),
		type: "POST",
		success: function (data) {
			let pkVisited = data;
			var visC = 0;
			pkVisited ? visC = pkVisited.length : "";

			visC > 0 ?
				(
					$('.recently').show(),
					buildRecentlyViewed(pkVisited),
					visC > 5 ? $('.recently__link').show() : $('.recently__link').hide()
				)
				:
				(
					$('.recently').hide()
				);
		},
		error: function (xhr, desc, exceptionobj) {
			console.log(xhr);
		}
	});

	return false;
};

function buildRecentlyViewed(jsonObj) {
	var objC = 0;
	var visited = "";
	jQuery.each(jsonObj, function (data) {
		objC++;
		if (objC < 6) {
			var timestamp = Date.parse(this.UTS_Date);
			var jsdate = new Date(timestamp);
			var today = new Date();
			var lastVst = timeBetween(jsdate, today);

			visited = `<li class="swiper-slide">
                           <div class="recently__image">
                               <img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" src="https://pictures.tripmasters.com${this.IMG_Path_URL.toLowerCase()}" alt="${this.PDL_Title}" />
                               <h4><a href="${this.UTS_URL}">${this.PDL_Title}</a></h4>
                           </div>
                           <div class="recently__info">
                               <span class="recently__viewed">Viewed ${lastVst}</span>
                               ${this.feedbacks > 0 ? ('<a class="recently__review" href="' + this.UTS_URL.replace("/package", "/feedback") + '">' + this.feedbacks + ' Customer Reviews</a>"') : "<span class='recently__review'>No Customer Reviews yet</span>"}
                               <a class="recently__customize" href="${this.UTS_URL}">CUSTOMIZE IT</a>
                           </div>
                        </li>`;
		};
	});

	$('#recentlyViewed').append(visited);
	var swiper4 = new Swiper(".mySwiper4", {
		navigation: {
			nextEl: ".swiper-button-next4",
			prevEl: ".swiper-button-prev4",
		},
		breakpoints: {
			// when window width is >= 320px
			320: {
				slidesPerView: 1,
				spaceBetween: 18
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 3,
				spaceBetween: 18
			},
			// when window width is >= 900px
			900: {
				slidesPerView: 4,
				spaceBetween: 18
			},
			// when window width is >= 1100px
			1100: {
				slidesPerView: 5,
				spaceBetween: 18
			}
		}
	});
	$('.recently').slideDown();
};*/
var goTo = 0;
function toggleClassMoreDetails(packId) {
	$('body').toggleClass('modal-pack-info-open');
	$('#fti-' + packId + '-modal').toggleClass('is-hidden');
}
function otherMoreDetails(objid, objsite, cls) {
	switch (cls) {
		case 2:
			goTo = -1;
			break;
	}
	if (goTo == -1) { return false; }

	$('.secPackInfo').each(function () {
		var secID = $(this).attr('id');
		var numID = secID.match(isNumber);
		numID == objid ? (
			!$(this).is(':visible') ?
				(
					$(this).slideDown(),
					$('p[id="down' + numID + '"]').slideDown(),
					$('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(-135deg)', 'margin': '7px 10px' })
				) : (
					$(this).slideUp(),
					$('p[id="down' + numID + '"]').slideUp(),
					$('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(45deg)', 'margin': '5px 10px' })
				)
		) : (
			$(this).slideUp(),
			$('p[id="down' + numID + '"]').slideUp(),
			$('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(45deg)', 'margin': '5px 10px' })
		);
	});

	cls === 1 ? relPackCallHome(objid, objsite) : '';
}
function relPackCallHome(packID, site) {
    var relTxt = '';
    var mrChoice = '';
    var divCom = 'dvCom' + packID;
    var divInf = 'dvpkInf' + packID;
	var divRel = 'dvRel' + packID;
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
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Packages/getDataRelPacks/",
        contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({ FaqQuestion: packID, FaqResponse: site }),
		crossDomain: true,
		success: function (data) {
			msg = data.m_StringValue;
            if (msg != '') {
                relTxt = '<div style="padding:5px 3px;font-weight: 600;">Related Package</div><div style="padding:2px 2px;" align="left">'
                mrChoice = '<div style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    echP = strPrts[i].split('|');
					relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
					relTxt = relTxt + '<a href="' + siteLink + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                    relTxt = relTxt + '<span>'
                    relTxt = relTxt + '<u>' + echP[0] + '</u>'
                    relTxt = relTxt + '</span></a></span>'
                    if (echP[2] != 5) {
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '" >' + echP[0] + '</a>'
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '" id="dop' + echP[3] + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                        mrChoice = mrChoice + '</span>'
                    }
                }
                relTxt = relTxt + '<br style="clear:both"/></div>';
                mrChoice = mrChoice + '<br style="clear:both"/></div>';
                $('#' + divRel + '').html(relTxt);
                $('#' + divCom + '').html(mrChoice);
                $('#dvWait' + packID + '').hide();
                $('#dvWait' + packID + '').html('');
                $('#' + divInf + '').slideDown();
                activeCckBx('frm' + packID);
            }
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
            $('#dvWait' + packID + '').html(xhr.responseText);
        }
    });
};
// *** ACTIVE CHECK BOX *** ///
function activeCckBx(frm) {
	$('#' + frm + ' input:checkbox').each(function () {
		(this.checked) ? $('#false' + this.id + '').addClass('falsecheckeddop') : $("#false" + this.id + '').removeClass('falsecheckeddop');
	});
	// function to 'check' the fake ones and their matching checkboxes
	var replID;
	$('#' + frm + ' .falsecheckdop').click(function () {
		this.id.indexOf('falsedot') > -1 ? replID = this.id.replace('falsedot', '') : this.id.indexOf('false') > - 1 ? replID = this.id.replace('false', '') : '';
		if (($(this).hasClass('falsecheckeddop'))) {
			$(this).removeClass('falsecheckeddop')
			$('#' + replID + '').removeAttr('checked');
		} else {
			$(this).addClass('falsecheckeddop');
			$('#' + replID + '').attr('checked', true);
		}
		$(this.hash).trigger("click");

		return false;
	});
};
function findPacksHome(formID, site) {
	if ($('#' + formID + ' #allID').val() != '') {
		$('#' + formID + ' #allID').val('')
	}
	if ($('#' + formID + ' #allNA').val() != '') {
		$('#' + formID + ' #allNA').val('')
	}
	var idForm = formID
	var idString = $('#' + idForm + '').serialize();
	idString = idString.substring(0, idString.indexOf("&__RequestVerificationToken"))
	var idStrParts
	var idxOf
	var idValP
	var idVal
	var idValN
	var idToFind = ''
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
				idID = idID + ',' + idValN[0];
				idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
			}
			else {
				idID = idValN[0];
				idNA = idValN[1].replace(/\s/g, '-');
			}

		}

	}
	if (idID == undefined) {
		alert('Please check at least one box. Thanks!');
		return;
	}
	else {
		$('#allID').val(idID);
		$('#allNA').val(idNA);
		window.location.href = site + idNA.toLowerCase() + '/find-packages';
	}
};