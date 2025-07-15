// JavaScript Document
var utVisitorID = -1;
var visitID;
const perpage = 10;
let nextPage = 1;
$(document).ready(function () {
	$('.dvRoundContainer').append('<div class="col-12" id="loading" style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
	if (Cookies.get('ut2') != undefined) {
		RecentlyViewedFromCookie();
	}
	else {
		let noCheckCookie = 0;
		var timer = setInterval(function () {
			noCheckCookie++;
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

			var NoTotalPages = Math.ceil(visC / 10);
			$('#novisited').text(visC);

			if (visC > 0) {
				buildRecentlyViewed(pkVisited);
				if (visC > perpage) {
					const itemsLeft = visC - perpage;
					if (itemsLeft < perpage) {
						$(".dvViewDisplayMore button").html(`${itemsLeft} More recently Viewed ${itemsLeft === 1 ? "Package" : "Packages"}`)
					}
				}
			}
			else {
				$(".dvRoundContainer").append("<p class='col-12'>You don't have any recent views</p>")
			}
		},
		error: function (xhr, desc, exceptionobj) {
			$('#loading').remove();
			console.log(xhr);
		}
	});
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

function buildRecentlyViewed(jsonObj) {
	//console.log("buildRecentlyViewed");
	var siteURL;
	var newVisit = "";
	newVisit = newVisit + '<div class="dvViewList">';

	var noPages = Math.ceil(jsonObj.length / perpage);

	for (let noPage = 1; noPage <= noPages; noPage++) {
		newVisit = newVisit + '<div class="dvpage' + noPage + '" style="display:' + (noPage > 1 ? 'none' : 'block') + '">';

			var objC = 0;
			jQuery.each(jsonObj, function (datas) {
				objC++;

				if (objC > (noPage - 1) * perpage && objC <= (noPage) * perpage ) {

					liItems = "";
					this.PDL_Content.split("\r\n").map(function (element) {
						liItems = liItems + "<li>" + element + "</li>"; })
				
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
							   <ul>` + 
							liItems
							    +
						   `</ul>
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
					                     <button onclick="ShowHideMore(${noPage1}, ${noPages})"> 10 More recently Viewed Packages</button>
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