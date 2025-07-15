var isValid = false;
$(function () {
    $('#submitMess').click(function (e) {
        e.preventDefault();
        $('.errMsg').hide();
        $.when(validation()).done(function (r) {
            var name = $('#firstName').val();
            var email = $('#clientEmail').val();
            var message = $('#message').val();
            var bookingId = $('#bookingNo').val();
            bookingId == '' ? bookingId = 0 : ''
            $.ajax({
                type: "POST",
                url: "/Api/SendMessageChat",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"name":"' + name + '", "email":"' + email + '", "message":"' + message + '", "bookingId":"' + bookingId + '"}',
                success: function (data) {
                    //console.log(data);
                    if (data.statusCode === 200) {
                        $('.section-form').hide()
                        $('.section-success').show();
                    }
                },
                error: function (xhr, desc, exceptionobj) {
                    console.log(xhr.responseText);
                    $('<p class="errMsg">Oops! Something went wrong. Please submit the form again.</p>').insertBefore('#formMessage')
                }
            });
        }).fail(function () {
            console.log("Input validation error");
            return;
        })
    })
    $('#firstName').click(function () {
        $(this).removeAttr('style');
    })
    $('#clientEmail').click(function () {
        $(this).removeAttr('style');
    });
    $('#message').click(function () {
        $(this).removeAttr('style');
    });
})
function validation() {
    var $deferred = $.Deferred();
    var $name = $('#firstName');
    var $email = $('#clientEmail');
    var $message = $('#message');
    var $bookingId = $('bookingNo');
    $.each([$name[0], $email[0], $message[0]], function () {
        if (!this.value) {
            $(this).css('border-color', 'red');
            $deferred.reject();
        } else {
            var e = $('#clientEmail').val();
            if (isValidEmailAddress(e) == true) {
                $deferred.resolve()
            } else {
                $($email).css('border-color', 'red');
                $deferred.reject();
            }
        }
    });
    return $deferred.promise();
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};