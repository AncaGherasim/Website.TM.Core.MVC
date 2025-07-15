// File version
var fileVersion = 08012022;
/////////////////////////
// JavaScript Document
var utVisitorID = -1;
var cookVisTot = 0;
var visitID;
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
		success: function (data) {
			console.log("Api/RecentlyViewed: ");
			console.log(data);
			pkVisited = data;
			var visC = 0
			pkVisited ? visC = pkVisited.length : "";
			var NoTotalPages = Math.ceil(visC / 10);

			$('#novisited').text(visC);

			if (visC > 0) {
				buildRecentlyViewed(pkVisited);
				ShowHideMore(1, NoTotalPages)
			}
		},
		error: function (xhr, desc, exceptionobj) {
			console.log(xhr);
		}
	});

});

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

function buildRecentlyViewed(jsonObj) {
	console.log("buildRecentlyViewed");
	var siteURL;
	var newVisit = "";
	var perpage = 10;
	newVisit = newVisit + '<div class="dvViewList">';

	var noPages = Math.ceil(jsonObj.length / perpage);

	console.log("buildRecentlyViewed jsonObj.length = " + jsonObj.length);
	console.log("buildRecentlyViewed noPages = " + noPages);

	for (let noPage = 1; noPage <= noPages; noPage++) {
			newVisit = newVisit + '<div class="dvpage' + noPage + '">';

			var objC = 0;
			jQuery.each(jsonObj, function (datas) {
				objC++;

				if (objC > (noPage - 1) * perpage && objC <= (noPage) * perpage ) {
					

					newVisit = newVisit +
						`<div class="dvEachView">
					       <div class="dvViewImage">
						     <img src="https://pictures.tripmasters.com${this.IMG_Path_URL.toLowerCase()}"/>
                           </div>
						   <div class="dvViewInfo">
						     <div>
							   <a href="${getSiteURL(this.UTS_Site)}/${this.STR_PlaceTitle.replace(/ /g, "_")}/${this.PDL_Title.replace(/ /g, "_")}/package-${this.PDLID}">${this.PDL_Title}</a>
                             </div>
						     <div class="dvViewIncludes">
							   <span>Itinerary Includes:</span>
							   <ul>
                                 ${this.PDL_Content.split("\r\n").map(function (element) { return `<li>${element}</li>` })}
							   </ul>
							 </div>
						 </div> 
						 <div class="dvViewBtn">
						   <div class="dvViewed">Viewed ${getVisitTime(this.UTS_Date)}</div>
                           ${this.feedbacks > 0 ? `<a class="lnkFeedTravel" href="${getSiteURL(this.UTS_Site)}/${this.STR_PlaceTitle.replace(/ /g, "_")}/${this.PDL_Title.replace(/ /g, "_")}/feedback-${this.PDLID}">${this.feedbacks} Travelers reviewed this package</a>` : ''}  
						   <a class="dvViewIt" href="${getSiteURL(this.UTS_Site)}/${this.STR_PlaceTitle.replace(/ /g, "_")}/${this.PDL_Title.replace(/ /g, "_")}/package-${this.PDLID}"> Customize It</a>
                         </div>
                       </div>`
				};
			});

			if (noPage < noPages) {
				var noPage1 = parseInt(noPage, 10) + 1;
				newVisit = newVisit + `<div class="dvViewDisplayMore" id="displayMore${noPage}">
					                     <button onclick="ShowHideMore(${noPage1}, ${noPages} 10 More recently Viewed Packages</button>
					                   </div>`
			}

			newVisit = newVisit + '</div>';
		}

	newVisit = newVisit + '</div>';

	$('div .dvRoundContainer').append(newVisit);
};

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

switch (this.UTS_Site) {
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
var timestamp = Date.parse(this.UTS_Date);
var jsdate = new Date(timestamp);
var today = new Date();
var visTimeR = timeBetween(jsdate, today)