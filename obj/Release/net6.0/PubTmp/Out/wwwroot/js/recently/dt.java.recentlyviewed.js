// File version
var fileVersion = 08012022;
/////////////////////////
// JavaScript Document
var utVisitorID = -1;
var visitID;
const perpage = 10;
let nextPage = 1;
$(document).ready(function () {

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

	utVisitorID = visitID;
    console.log("recently utVisitorID: ");
	console.log(utVisitorID);

		$.ajax({
			url: "/Api/RecentlyViewed",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify({ Name: utVisitorID }),
			type: "POST",
			success: function (pkVisited) {
				console.log("Api/RecentlyViewed: ");
				console.log(pkVisited);
				let visC = 0;
				pkVisited ? visC = pkVisited.length : "";

				$('#novisited').text(visC);

				if (visC > 0) {
					buildRecentlyViewed(pkVisited.slice(0, perpage));

						if (visC > perpage) {
							createButtonMore();
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
				console.log(xhr);
			}
		});

});

function buildRecentlyViewed(jsonObj) {
	const markup = jsonObj.map(function ({ UTS_Site, STR_PlaceTitle, PDL_Title, PDLID, IMG_Path_URL, feedbacks, PDL_Content, UTS_Date }) {
		return `<div class="dvImage">
			     <a href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle)}/${getReplaceStr(PDL_Title)}/package-${PDLID}">
                   <img src="https://pictures.tripmasters.com${IMG_Path_URL.toLowerCase()}"/>
                 </a>
                </div>
				<div class="dvInfo">
			      <div class="dvInfoTitle" id="pos${PDLID}">
			        <a href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle)}/${getReplaceStr(PDL_Title)}/package-${PDLID}">
                      ${PDL_Title}
				    </a>
                  </div>
				  <div class="dvDetails">
				    <div style="font-weight:bold; padding:3px 0px 0px 0px; color:#333; font-size:12px; text-align:left;">
                      Itinerary includes:
                    </div>
				    <div>
				      <ul style="padding:3px 12px; margin:0px; font-size:12px; color:#666; text-align:left;">
                        ${PDL_Content.split("\r\n").map((item,index) => `<li>${item}</li>`).join('')}
                      </ul>
				    </div>
				  </div>
			    </div>
				<div class="dvButton">
				  <div class="dvViewed">Viewed ${getVisitTime(UTS_Date)}</div>
                  ${feedbacks > 0 ? `<div class="dvViewed">
				                       <a href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle)}/${getReplaceStr(PDL_Title)}/feedback-${PDLID}">
                                         ${feedbacks} Travelers reviewed this package
                                       </a>
				                     </div>`: ""}
                  <div style="padding:10px 0; margin-left:60px">
				    <a class="customize" href="${getSiteURL(UTS_Site)}/${getReplaceStr(STR_PlaceTitle)}/${getReplaceStr(PDL_Title)}/package-${PDLID}">
                      Customize It
			        </a>
                  </div>
                </div>
                <div style="clear:both;"></div>
                <hr class="gradLineTop"/>`
	}).join("");

	const newVisit = `<div id="pagDV1" class="dvEachVis">
                      ${markup}
                      </div>`;

	$('div .dvItemsContainer').append(newVisit); 
}

function createButtonMore() {
	const markup = `<div class="dvViewDisplayMore" id="displayMore">
		              <button onclick="fetchNextRecentlyViewed()"> ${perpage} More recently Viewed Packages</button>
		            </div>`;

	$(".dvRoundContainer").append(markup);
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

function fetchNextRecentlyViewed() {
	$.ajax({
		url: "/Api/RecentlyViewed",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({ Name: utVisitorID }),
		type: "POST",
		success: function (pkVisited) {
			console.log("Api/RecentlyViewed: ");
			console.log(pkVisited);
			const visC = pkVisited.length;
			const startIndex = nextPage * perpage;
			const endIndex = nextPage * perpage + perpage;

			buildRecentlyViewed(pkVisited.slice(startIndex, endIndex));

			if (endIndex >= visC) {
				$(".dvViewDisplayMore").hide();
			}
			const itemsLeft = visC - endIndex;

			if (itemsLeft < perpage) {
				$(".dvViewDisplayMore button").html(`${itemsLeft} More recently Viewed ${itemsLeft === 1 ? "Package" : "Packages"}`)
            }
			nextPage++;
		},
		error: function (xhr, desc, exceptionobj) {
			console.log(xhr);
		}
	});
}



