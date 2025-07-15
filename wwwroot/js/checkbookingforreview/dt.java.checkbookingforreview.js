var regexEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

$(document).ready(function() {
    $('#CheckBooking').on('click touchend', function() {
        var bookingId = $('#bookingId').val();
        var email = $('#email').val();
        $('.errMsg').css('color', '#9da0a5');
        $('#nobookMsg').hide();
        if (bookingId == '' || isNaN(bookingId)) {
            $('#bookingMsg').css('color', 'red');
            $('#bookingId').focus();
            return;
        }
        if (!regexEmail.test(email)) {
            $('#emailMsg').css('color', 'red');
            $('#email').focus();
            return;
        }

        $.ajax({
            url: "/Api/CheckBooking",
            contentType: "application/json; charset=utf-8",
            data: '{ "bookingId":"' + bookingId + '", "email":"' + email + '"}' ,
            type: "POST",
            success: function(data) {
                if (data != true) {
                    $('#nobookMsg').show();
                } else {
                    window.location.href = "/customer-review?b=" + bookingId + "&e=" + email + "&r=0";
                }
            },
            error: function(xhr, desc, exceptionobj) {
                alert(xhr.responseText + ' = error');
            }
        });


    });
});