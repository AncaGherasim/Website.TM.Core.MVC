// File version
var fileVersion = 08012022;
/////////////////////////
var html_ = '<div style="width:400px;text-align:center;padding-left:100px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div></div>'
var DOMContentLoaded_event = document.createEvent("Event")
DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true)
$(document).ready(function() {
    var site = SiteName_;
    console.log("site = " + site);
    var regionId = ""
    $("div[id^='tab']").removeClass("TabActive").addClass("Tab");

    if (site != undefined && site != '' && site != 'all' && site != 'ed' && site != 'ld' && site != 'asia') {
        site = 'all'
        regionId = "0"
        $("#tab0").addClass("TabActive");
    }
    if (site == undefined || site == '' || site == 'all') {
        site = 'all'
        regionId = "0"
        $("#tab0").addClass("TabActive");
    };
    if (site == 'ed') {
        $("#tab243").addClass("TabActive");
        regionId = "243"
    };
    if (site == 'asia') {
        regionId = "595"
        $("#tab595").addClass("TabActive");
    };
    if (site == 'ld') {
        regionId = "182"
        $("#tab182").addClass("TabActive");
    };

    var pId1 = $('#packId1').val();
    var pId2 = $('#packId2').val();
    var pId3 = $('#packId3').val();
    console.log("site2 = " + site);
    if (site == 'all') {
        $('#pack243').html(html_);

        var options243 = {};
        options243.url = "/TopDealsPackageInfo";
        options243.type = "POST";
        options243.contentType = "application/json; charset=utf-8";
        options243.data = '{"SSFilter":"' + pId1 + '", "Ids":"' + 243 + '"}';
        options243.dataType = "html";
        options243.success = function (data) {
            $('#pack243').html(data);
            window.document.dispatchEvent(DOMContentLoaded_event);
        };
        options243.error = function (xhr, desc, exceptionobj) {
            $('#pack243').html(xhr.responseText)
        };
        $.ajax(options243);


        $('#pack595').html(html_);
        var options595 = {};
        options595.url = "/TopDealsPackageInfo";
        options595.type = "POST";
        options595.contentType = "application/json; charset=utf-8";
        options595.data = '{"SSFilter":"' + pId2 + '", "Ids":"' + 595 + '"}';
        options595.dataType = "html";
        options595.success = function (data) {
            $('#pack595').html(data);
            window.document.dispatchEvent(DOMContentLoaded_event);
        };
        options595.error = function (xhr, desc, exceptionobj) {
            $('#pack595').html(xhr.responseText)
        };
        $.ajax(options595);


        $('#pack182').html(html_);
        $('#pack182').html(html_);
        var options182 = {};
        options182.url = "/TopDealsPackageInfo";
        options182.type = "POST";
        options182.contentType = "application/json; charset=utf-8";
        options182.data = '{"SSFilter":"' + pId3 + '", "Ids":"' + 182 + '"}';
        options182.dataType = "html";
        options182.success = function (data) {
            $('#pack182').html(data);
            window.document.dispatchEvent(DOMContentLoaded_event);
        };
        options182.error = function (xhr, desc, exceptionobj) {
            $('#pack182').html(xhr.responseText)
        };
        $.ajax(options182);
    }
    if (site == 'ed' || site == 'ld' || site == 'asia') {
        $('#pack1').html(html_);
        $('#pack2').html(html_);
        $('#pack3').html(html_);

        console.log("site3 = " + site);
        var options1 = {};
        options1.url = "/TopDealsPackageInfo";
        options1.type = "POST";
        options1.contentType = "application/json; charset=utf-8";
        options1.data = '{"SSFilter":"' + pId1 + '", "Ids":"' + regionId + '"}';
        options1.dataType = "html";
        options1.success = function (data) {
            $('#pack1').html(data);
            window.document.dispatchEvent(DOMContentLoaded_event);
        };
        options1.error = function (xhr, desc, exceptionobj) {
            $('#pack1').html(xhr.responseText)
        };
        $.ajax(options1);

        console.log("site4 = " + site);

        var options2 = {};
        options2.url = "/TopDealsPackageInfo";
        options2.type = "POST";
        options2.contentType = "application/json; charset=utf-8";
        options2.data = '{"SSFilter":"' + pId2 + '", "Ids":"' + regionId + '"}';
        options2.dataType = "html";
        options2.success = function (data) {
            $('#pack2').html(data);
            window.document.dispatchEvent(DOMContentLoaded_event);
        };
        options2.error = function (xhr, desc, exceptionobj) {
            $('#pack2').html(xhr.responseText)
        };
        $.ajax(options2);

        var options3 = {};
        options3.url = "/TopDealsPackageInfo";
        options3.type = "POST";
        options3.contentType = "application/json; charset=utf-8";
        options3.data = '{"SSFilter":"' + pId3 + '", "Ids":"' + regionId + '"}';
        options3.dataType = "html";
        options3.success = function (data) {
            $('#pack3').html(data);
            window.document.dispatchEvent(DOMContentLoaded_event);
        };
        options3.error = function (xhr, desc, exceptionobj) {
            $('#pack3').html(xhr.responseText)
        };
        $.ajax(options3);

    }
});
function changeCheck(id) {    
    if ($('#' + id).hasClass('falsechecked'))
        $('#' + id).removeClass('falsechecked')
    else
        $('#' + id).addClass('falsechecked');
    var idH = id.replace('false','');    
    $('#'+idH).trigger("click");
    return false;    
}
function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        };
    };
};
/* TO TAKE ID FROM FORM TO FIND PACKAGES */
function findPacks(formID, siteUrl) {
    if ($('#' + formID + ' #allID').val() != '') {
        $('#' + formID + ' #allID').val('')
    }
    if ($('#' + formID + ' #allNA').val() != '') {
        $('#' + formID + ' #allNA').val('')
    }
    var idString = $('#' + formID).serialize();
    idString = idString.substring(0, idString.indexOf("&__"));
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
        $('#' + formID + ' #allID').val(idID);
        $('#' + formID + ' #allNA').val(idNA);       
        window.location = siteUrl + idNA + "/find-packages";

    }
}
function openDivInfo(packId, regionId) {
    var srcImg = $('#pic' + packId).attr('src');

    if (srcImg.indexOf('Plus') > -1) {
        $('#infPack' + packId).slideDown();
        if ($('#infPack' + packId).html() != '') {
            $('#pic' + packId).attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');
            $('#pic' + packId).attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');
            return;
        }
        $('#infPack' + packId).html(html_);

        var options = {};
        options.url = "/TopDealsPackageInfo";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = '{"SSFilter":"' + packId + '", "Ids":"' + regionId + '"}';
        options.dataType = "html";
        options.success = function (data) {
            $('#infPack' + packId).html(data);
            $('#pic' + packId).attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');

            window.document.dispatchEvent(DOMContentLoaded_event)
        };
        options.error = function (xhr, desc, exceptionobj) {
            $('#infPack' + packId).html(xhr.responseText);
        };
        $.ajax(options);
    } else {
        $('#infPack' + packId).slideUp('slow');
        $('#pic' + packId).attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg');       
    }
}