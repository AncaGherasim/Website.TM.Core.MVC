$(document).ready(function () {

    $('#submitSurvey').click(function () {
        var checkq1; var checkq2; var checkq3; var checkexp; var checktxt;
        if ($("#formpostsurvey [name='q1']").is(":checked")) {
            checkq1 = true;
            $('.q1_text').removeAttr('style');
        } else {
            $(".q1_text").css('color', 'red');
            checkq1 = false;
        }
        if ($("#formpostsurvey [name='q2']").is(":checked")) {
            checkq2 = true;
            $('.q2_text').removeAttr('style');
        } else {
            $('.q2_text').css('color', 'red');
            checkq2 = false;
        }
        if ($("#formpostsurvey [name='q3']").is(":checked")) {
            checkq3 = true;
            $('.q3_text').removeAttr('style');
        } else {
            $('.q3_text').css('color', 'red');
            checkq3 = false;
        }
        if ($("#formpostsurvey [name='experience']").is(":checked")) {
            checkexp = true;
            $('.experience_text').removeAttr('style');
        } else {
            $('.experience_text').css('color', 'red');
            checkexp = false;
        }
        if ($("#formpostsurvey [name='experience']").val() != "") {
            checktxt = true;
            $('.message_text').removeAttr('style');
        } else {
            $('.message_text').css('color', 'red');
            checktxt = false;
        }
        if (checkq1 == true && checkq2 == true && checkq3 == true && checkexp == true && checktxt == true) {
            $('#submitSurvey').prop('disabled', true);
            subSurvey();
        }
        $("#formpostsurvey [name='q1']").change(function () {
            $('.q1_text').removeAttr('style');
        })
        $("#formpostsurvey [name='q2']").change(function () {
            $('.q1_text').removeAttr('style');
        })
        $("#formpostsurvey [name='q3']").change(function () {
            $('.q1_text').removeAttr('style');
        })
        $("#formpostsurvey [name='experience']").change(function () {
            $('.q1_text').removeAttr('style');
        })
        $("#formpostsurvey [name='message']").change(function () {
            $('.q1_text').removeAttr('style');
        })
    });
    //$('input[id^="q').click(function () {selectOnlyOne(this.id) })
})

function subSurvey() {
    var form = $('#formpostsurvey').serializeObject();
    var bookingId = Number($('#bookId').val());
    var email = $('#email').val();
    console.log(form);
    $.ajax({
        type: "POST",
        url: "/Api/PostBookingSurvey",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{"BookingId":' + bookingId + ',"EmailAddress":"' + email + '","FindEverything":' + form.q1 + ', "EasyWebsite":' + form.q2 + ', "DidYouContactUs":' + form.q3 + ', "ExperienceScore":' + Number(form.experience) + ', "Comments":"' + form.message + '"}',
        success: function (data) {
            console.log(data.statusCode);
            if (data.statusCode === 200) {
                $('.survey').hide();
                $('.survey-title1').hide();
                $('.survey-title2').hide();
                $('.success').show();
            }
            if (data.statusCode === 201) {
                
                const dt = new Date(data.responseMessage[0].CAPS_SurveyReceived);
                const htmlContent = `<div class="survey-present">
                                <h1>Thank you for filling the survey, we value your feedback!</h1>
                                <h2>We received your feedback about the booking process with us.</h2>
                                <h3>Survey saved on: ${dt.toLocaleDateString("en-US")}</h3>
                                <a href="/">Get back to our homepage</a></div>`
                $(htmlContent).insertAfter('.survey');
                $('.survey').hide();
                $('.survey-title1').hide();
                $('.survey-title2').hide();
            }
            
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
}

//function selectOnlyOne(sel) {
//    console.log(sel);
//    switch (sel) {
//        case "q1_yes":
//            $("#q1_no").prop('checked', '');
//            break;
//        case "q1_no":
//            $("#q1_yes").prop('checked', '');
//            break;
//        case "q2_yes":
//            $("#q2_no").prop('checked', '');
//            break;
//        case "q1_no":
//            $("#q2_yes").prop('checked', '');
//            break;
//        case "q3_yes":
//            $("#q3_no").prop('checked', '');
//            break;
//        case "q3_no":
//            $("#q3_yes").prop('checked', '');
//            break;
//    }
//}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};