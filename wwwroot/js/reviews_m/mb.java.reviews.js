var scoreF = '0';
$(document).ready(function () {
    $('#goTop').click(function () {
        $(window).scrollTop(0);
    });
    ShowPacks2(1, scoreF);

    $('.dvfilter').click(function () {
        $('#dvReviews').html('<div id="imgWait" style="padding:100px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        numPg = 1;
        scoreF = this.id;
        ShowPacks2(1, scoreF);
    });
});

function ShowPacks2(page, scrF) {
    // console.log(page + ' | ' + scrF)
    if (page == 1) {
        $(window).scrollTop(0);
        $('#goTop').hide();
        $('#dvReviews').html('<div style="text-align:center;padding:35px 0;background-color:white;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br><div style="color:navy;">Loading ...</div></div>');
    } else {
        $('#dvMore_' + page).html('<div style="text-align:center;padding-top:10px;background-color:white;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br><div style="color:navy;">Loading ...</div></div>');
    }


    var options = {};
    options.url = "/ReviewsPerPage";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = '{"SSFilter":"' + page + '", "Ids":"' + scrF + '"}';
    options.dataType = "html";
    options.success = function (data) {
        if (page == 1) {
            $('#dvReviews').html(data);
            $('#goTop').show();

        }
        else {
            $('#dvMore_' + page).attr("style", "");
            $('#dvMore_' + page).html(data);

        }
        $('.grayButton').click(function () { ShowPacks2(Number(page + 1), scrF); })
    };
    options.error = function (xhr, desc, exceptionobj) {
        $('#dvReviews').html(xhr.responseText);
        $('#dvReviews').show();
    };
    $.ajax(options);

}
function displayPackInfo(dvPackInfoName) {
    if ($('#' + dvPackInfoName).is(":visible")) {
        $('#' + dvPackInfoName).hide();
        $('#' + dvPackInfoName.replace('divInfo', 'divInfoLink')).removeClass("packIncludeDown").addClass("packIncludeUp");
    }
    else {
        $('#' + dvPackInfoName).show();
        $('#' + dvPackInfoName.replace('divInfo', 'divInfoLink')).removeClass("packIncludeUp").addClass("packIncludeDown");
    }
}