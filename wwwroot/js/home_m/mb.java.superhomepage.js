var depCities = [];
var arrivalCities = [];
var today = new Date();
var isNumber = /[0-9]+/g;
var visitId;
var childAge = [];
var totalPax = 0;
var haveCook = 0;
for (c = 2; c <= 11; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childAge.push(chilObj);
}
$(document).ready(function () {
    var historyTraversal = (typeof window.performance != "undefined" &&
        window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
      //  console.log("Pageshow event");
     //   console.log("Cookie backCookMhome = " + Cookies.get('backCookMhome'));
        var cookSaved;
        if (Cookies.get('backCookMhome') != undefined) {
            cookSaved = JSON.parse(Cookies.get('backCookMhome'));
        }
      //  console.log("Pageshow historyTraversal = true before windows reload");
        DocReady();
        if (cookSaved != undefined) {
            Cookies.set('backCookMhome', cookSaved, { expires: 1 });
        }
      //  console.log("Pageshow historyTraversal = true after windows reload");
        GoUp();
    }
    else {
        DocReady();
    }
});

function DocReady() {
    //console.log("Begin of document.ready");
   // console.log("ut2 = " + Cookies.get('ut2'));
    if (Cookies.get('ut2') != undefined) {
      //  console.log(Cookies.get('ut2'));
        var utParts = $(Cookies.get('ut2').split('&'));
        var utVisitId = utParts[0].split('=');
        visitId = utVisitId[1];
    }
    
    //Recently Viewed
    $('#dvMvisitContainer').on('show.bs.collapse', function () {
        //getRecentlyView();
    });

}

function GoUp() {
    $("html, body").animate({ scrollTop: 0 }, 200);
   // console.log("Body GoUp.");
}

//Get Recently Viewed packages
//function getRecentlyView() {
//    var options = {};
//    options.url = SiteName + "/Api/RecentlyViewed";
//    options.type = "POST";
//    options.contentType = "application/json; charset=utf-8";
//    options.data = JSON.stringify({ Name: visitId });
//    options.dataType = "json";
//    options.success = function (data) {
//        console.log(data)
//        data != undefined ? buildRecentlyViewed(data) : '';
//    };
//    options.error = function (xhr, desc, exceptionobj) {
//        console.log(xhr);
//    };
//    $.ajax(options);
//}

//function buildRecentlyViewed(obj) {

//    var objC = 0;
//    var siteURL;
//    var newVisit = "<div class='row w-100 mx-auto border-bottom'>";
//    $.each(obj, function () {
//        objC++;
//        if (objC < 6) {
//            switch (this.UTS_Site) {
//                case 'TMED':
//                    siteURL = "/europe" //"http://www.tripmasters.com/europe";				
//                    break;
//                case 'TMASIA':
//                    siteURL = "/asia" //"http://www.tripmasters.com/asia";				
//                    break;
//                case 'TMLD':
//                    siteURL = "/latin" //"http://www.tripmasters.com/latin";				
//                    break;
//            };
//            var timestamp = Date.parse(this.UTS_Date);
//            var jsdate = new Date(timestamp);
//            var today = new Date();
//            var lastVst = timeBetween(jsdate, today);
//            newVisit = newVisit + "<div class='col-6 pt-2 pb-2 pl-2 pr-2'><a href='" + siteURL + "/" + this.STR_PlaceTitle.replace(' ', '_').toLowerCase() + "/" + this.PDL_Title.replace(' ', '_').toLowerCase() + "/package-" + this.PDLID + "' class='font12'>" +
//                "<img class='img-fluid' src='https://pictures.tripmasters.com" + this.IMG_Path_URL.toLowerCase() +
//                "' title='" + this.PDL_Title + "'/></a><div class=row style='height:130px;padding-left: 17px;padding-right: 10px'><a style='height:80px' href='" + siteURL + "/" + this.STR_PlaceTitle.replace(' ', '_').toLowerCase() + "/" + this.PDL_Title.replace(' ', '_').toLowerCase() + "/package-" + this.PDLID + "'>" + this.PDL_Title +
//                "</a><span class='d-block font12'>Viewed " + lastVst + "</span>";

//            if (this.feedbacks > 0) {
//                newVisit = newVisit + "<div class='col pl-0 pr-0'><a href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/%20|\s/g, '_').toLowerCase() + "/" + this.PDL_Title.replace(/ /g, '_').toLowerCase() + "/feedback-" + this.PDLID + "' class='font12'>" + this.feedbacks + " Customer Reviews " +
//                    "</a>" +
//                    "</div>";
//            };
//            newVisit = newVisit + "</div>";
//            newVisit = newVisit + "<div class='col pl-0 pr-0 font12 pt-2 text-center mx-auto'><a role='button' href='" + siteURL + "/" + this.STR_PlaceTitle.replace(' ', '_').toLowerCase() + "/" + this.PDL_Title.replace(' ', '_').toLowerCase() + "/package-" + this.PDLID + "' class='btn btn-warning'>View It</a></div></div>";

//        }
//    });
//    newVisit = newVisit + "</div>";
//    $('.dvMvisit').append(newVisit);
//}

function highlightText(text, $node) {
    var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
    while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
        newTextNode = currentNode.splitText(matchIndex);
        currentNode = newTextNode.splitText(searchText.length);
        newSpanNode = document.createElement("span");
        newSpanNode.className = "highlight boldText";
        currentNode.parentNode.insertBefore(newSpanNode, currentNode);
        newSpanNode.appendChild(newTextNode);
    }
}