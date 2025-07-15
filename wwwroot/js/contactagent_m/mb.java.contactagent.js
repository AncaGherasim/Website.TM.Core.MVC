var isNumber = /[0-9]+/g;
var interval;
var waitCall = 0;
$(document).ready(function () {
    var regPhone = new RegExp(/^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})( x\d{4})?$/g);
    $('[type="tel"]').keyup(function (e) {
        if (e.keyCode !== 8) {
            phoneMask(this);
        }
    });
    $(".btnCall").click(function () {
        var jsonData = window.location.search.split("&");
        var email = jsonData[0].substr(jsonData[0].indexOf("=") + 1);
        var phone = $('#phoneCust').val();
        if (regPhone.test(phone)) {
            var number = phone.replace(/[^0-9.]/g, "");
            var agtName = $("#agtName").val();
            callAgent(email, number, agtName);
        }
    });
    $('.spExpand').click(function () {
        if ($('.dvSchedule').is(":visible") == true) {
            $(this).removeClass('collapsed');
            $('.dvSchedule').hide();
        } else {
            $(this).addClass('collapsed');
            $('.dvSchedule').show();
        }
    });
    if ($('#validation').val() == "True") {
        interval = setInterval(function () { checkStatus(); }, 9000);
    }
});
function callAgent(email, phone, name) {
    $.ajax({
        type: "POST",
        url: "/Api/CallCustomer",
        contentType: "application/json; charset=utf-8",
        data: '{"email":"' + email + '", "phone":"' + phone + '", "name":"' + name + '"}',
        success: function (data) {
            var jsonData = JSON.parse(data);
            if (jsonData.statusCode === 200) {
                $('.online').hide();
                $('.notAvailable').hide();
                $('.done').show();
                waitCall = 1;
                $('#phoneCust').val("");
            }
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }
    });
}
function checkStatus() {
    var jsonData = window.location.search.split("&");
    var email = jsonData[0].substr(jsonData[0].indexOf("=") + 1);
    var agentId = jsonData[1].match(isNumber);
    $.ajax({
        type: "POST",
        url: "/Api/CheckStatus",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"email":"' + email + '", "agentID":' + agentId + '}',
        success: function (data) {
            var jsonData = JSON.parse(data.d);
            var status = jsonData[0].AgentStatus;
            var conType = jsonData[0].ContactType;
            var activeCh = jsonData[0].ActiveChats;
            if (status == "Available" && conType == "chat") {
                status = "OnChat";
            }
            switch (status) {
                case "Available":
                    $('.spStatus').text(status);
                    $('.spStatus').removeClass('offline');
                    $('.spStatus').addClass('available');
                    $('.notAvailableOn').hide();
                    $('.notAvailable').hide();
                    waitCall === 1 ? '' : ($('.done').hide(), $('.online').show());
                    break;
                case "Busy":
                    $('.spStatus').text("Not available (on a call)");
                    $('.spStatus').removeClass('offline');
                    $('.spStatus').removeClass('available');
                    $('.spStatus').addClass('offline');
                    $('.online').hide();
                    waitCall === 1 ? '' : ($('.done').hide(), $('.notAvailableOn').show(), $('.notAvailable').hide());
                    break;
                case "OnChat":
                    $('.spStatus').text("Not available (on a chat)");
                    $('.spStatus').removeClass('offline');
                    $('.spStatus').removeClass('available');
                    $('.spStatus').addClass('offline');
                    $('.online').hide();
                    waitCall === 1 ? '' : ($('.done').hide(), $('.notAvailableOn').show().html($('.notAvailableOn').html().replace("another call", "a chat")), $('.notAvailable').hide());
                    break;
                default:
                    waitCall = 0;
                    $('.spStatus').text("Not available");
                    $('.spStatus').removeClass('offline');
                    $('.spStatus').removeClass('available');
                    $('.spStatus').addClass('offline');
                    $('.online').hide();
                    $('.done').hide();
                    $('.notAvailableOn').hide();
                    $('.notAvailable').show();
                    break;
            }
        },
        error: function (xhr, desc, exceptionobj) {
            //alert(xhr.responseText + ' = error');
        }
    });
}
function phoneMask() {
    var num = $('#phoneCust').val().replace(/\D/g, '');
    var dash = "-";
    var closePar = ") ";
    if (num.length < 3) {
        closePar = "";
    }
    if (num.length < 6) {
        dash = "";
    }
    $('#phoneCust').val('(' + num.substring(0, 3) + closePar + num.substring(3, 6) + dash + num.substring(6, 10));
}