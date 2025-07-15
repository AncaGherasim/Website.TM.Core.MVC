// JavaScript Document
var utVisitorID = -1;
var visitID;
const perpage = 10;
let nextPage = 1;
$(document).ready(function () {
	$('.dvItemsContainer').append('<div id="loading" style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
	if (Cookies.get('ut2') != undefined) {
		RecentlyViewedFromCookie();
	}
	else {
		let noCheckCookie = 0;
		var timer = setInterval(function () {
			noCheckCookie ++;
			console.log("Check cookie " + noCheckCookie);
			if (Cookies.get('ut2') != undefined || noCheckCookie >= 2) {
				clearInterval(timer);
				RecentlyViewedFromCookie();
			}
		}, 1000);
	};
});

function RecentlyViewedFromCookie() {
		var vstIDs = Cookies.get('ut2').split('&');
		var vstID = vstIDs[0].split('=');
		visitID = vstID[1];

		utVisitorID = visitID;

		$.ajax({
			url: "/Api/RecentlyViewed",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ Name: utVisitorID }),
			type: "POST",
			success: function (pkVisited) {
				$('#loading').remove();
				let visC = 0;
				pkVisited ? visC = pkVisited.length : "";

				$('#novisited').text(visC);

				if (visC > 0) {
					buildRecentlyViewed(pkVisited);

					if (visC > perpage) {
						const itemsLeft = visC - perpage;
						if (itemsLeft < perpage) {
							$(".dvViewDisplayMore button").html(`${itemsLeft} More recently Viewed ${itemsLeft === 1 ? "Package" : "Packages"}`)
						}
					}
				} else {
					$(".dvRoundContainer").append("<p style='text-align:center;font-size:15px;color:#666;'>You don't have any recent views</p>")
				}

			},
			error: function (xhr, desc, exceptionobj) {
				$('#loading').remove();
				console.log(xhr);
			}
		});
}
function buildRecentlyViewed(jsonObj) {
	var siteURL;
	var newVisit = "";

	var noPages = Math.ceil(jsonObj.length / perpage);

	for (let noPage = 1; noPage <= noPages; noPage++) {
		newVisit = newVisit + '<div id="pagDV' + noPage + '" class="dvEachVis dvpage' + noPage + '" style="display:' + ((noPage > 1) ? 'none' : 'block') + '">';
		var objC = 0;
		jsonObj.map(function ({ UTS_Site, STR_PlaceTitle, PDL_Title, PDLID, IMG_Path_URL, feedbacks, PDL_Content, UTS_Date }) {
			objC++;
			if (objC > (noPage - 1) * perpage && objC <= (noPage) * perpage) {
				divPackage = `<div class="dvImage">
					 <a href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle.toLowerCase())}/${getReplaceStr(PDL_Title.toLowerCase())}/package-${PDLID}">
					   <img src="https://pictures.tripmasters.com${IMG_Path_URL.toLowerCase()}"/>
					 </a>
					</div>
					<div class="dvInfo">
					  <div class="dvInfoTitle" id="pos${PDLID}">
						<a href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle.toLowerCase())}/${getReplaceStr(PDL_Title.toLowerCase())}/package-${PDLID}">
						  ${PDL_Title}
						</a>
					  </div>
					  <div class="dvDetails">
						<div style="font-weight:bold; padding:3px 0px 0px 0px; color:#333; font-size:12px; text-align:left;">
						  Itinerary includes:
						</div>
						<div>
						  <ul style="padding:3px 12px; margin:0px; font-size:12px; color:#666; text-align:left;">
							${PDL_Content.split("\r\n").map((item, index) => `<li>${item}</li>`).join('')}
						  </ul>
						</div>
					  </div>
					</div>
					<div class="dvButton">
					  <div class="dvViewed">Viewed ${getVisitTime(UTS_Date)}</div>
					  ${feedbacks > 0 ? `<div class="dvViewed">
										   <a href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle.toLowerCase())}/${getReplaceStr(PDL_Title.toLowerCase())}/feedback-${PDLID}">
											 ${feedbacks} Travelers reviewed this package
										   </a>
										 </div>`: ""}
					  <div style="padding:10px 0; margin-left:60px">
						<a class="customize" href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle.toLowerCase())}/${getReplaceStr(PDL_Title.toLowerCase())}/package-${PDLID}">
						  Customize It
						</a>
					  </div>
					</div>
					<div style="clear:both;"></div>
					<hr class="gradLineTop"/>`

				newVisit = newVisit + divPackage;
			}
		})


		if (noPage < noPages) {
			var noPage1 = parseInt(noPage, 10) + 1;
			newVisit = newVisit + `<div class="dvViewDisplayMore" id="displayMore${noPage}">
					                     <button onclick="ShowHideMore(${noPage1}, ${noPages})"> 10 More recently Viewed Packages</button>
					                   </div>`
		}

		newVisit = newVisit + '</div>';

	}

	newVisit = newVisit + '</div>';

	$('div .dvItemsContainer').append(newVisit); 
}
function ShowHideMore(noPage, noPages) {
	for (i = 1; i <= noPages; i++) {
		var n = i.toString();
		if (i <= noPage) {
			$('.dvpage' + n).show();
			if (i < noPage) {
				$('#displayMore' + n).hide();
			}
		}
		else {
			$('.dvpage' + n).hide();
		}
	}
}

function getSiteURL(UTS_Site) {
	let siteURL;
	switch (UTS_Site) {
		case 'TMED':
			siteURL = "/europe" //"http://www.tripmasters.com/europe";				
			break;
		case 'TMASIA':
			siteURL = "/asia" //"http://www.tripmasters.com/asia";				
			break;
		case 'TMLD':
			siteURL = "/latin" //"http://www.tripmasters.com/latin";				
			break;
		case 'TMLUX':
			siteURL = "/luxury"
			break;
	};

	return siteURL;
}

function getVisitTime(UTS_Date) {
	const timestamp = Date.parse(UTS_Date);
	const jsdate = new Date(timestamp);
	const today = new Date();

	return timeBetween(jsdate, today);
}

function getReplaceStr(str) {
	return str.replace(/ /g, "_");
}

