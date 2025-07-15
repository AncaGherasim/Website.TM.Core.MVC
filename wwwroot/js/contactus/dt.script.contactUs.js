//Javascript Document
// Contact Us Page
var chkBox;
var bkNum;
var flNA;
var email;
var phone;
var msg;
$(document).ready(function () {
    loadPage();
});
$(function () {
    $('.example-popover').popover({
        container: 'body',
        trigger: 'focus'
    })
})
function loadPage() {
    $('#frmBKN').val("");
    $('#frmFullName').val("");
    $('#frmEmail').val("");
    $('#frmMsg').val("");

    $("#frmReason").change(function () {
        if ($(this).val() == 'WithBooking' || $(this).val() == "WithTrip") {
            $(".dvBknum").slideDown();
        }
        else {
            $(".dvBknum").slideUp();
            hideInfo("frmBKN");
        }
    });

    $('#submitMsg').show();
    $('#imgLoading').hide();
}
function hideInfo(obj) {
    $('#' + obj + '').removeClass("warning");
    $('#' + obj + '').css("border", "");
    $('#divError').html('');
    $('#divError').hide();
}
function hideDataContent(obj) {
    $('#' + obj + '').popover('hide');
}

function validate(sender, args) {
    selReason = $('#frmReason');
    bkNum = $('#frmBKN');
    flNA = $('#frmFullName');
    email = $('#frmEmail');
    msg = $('#frmMsg');
    frmBKN.Text = "";
    var valid = ''
    var regBKN = new RegExp(/[0-9-()+]{6,20}/);
    var regFN = new RegExp('[A-Za-z]');
    var regEmail = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    var regMsg = new RegExp(/^.*?[a-zA-Z]{4,}.*?$/m);
    var regex = [regBKN, regFN, regEmail, regMsg];
    var idd = [];

    $.each([bkNum[0], flNA[0], email[0], msg[0]], function (i, item) {
        if (selReason[0].value == "WithBooking" || selReason[0].value == "WithTrip") {
            $(".dvBknum").show();
            if (this.value === '') {
                this.style.border = "2px solid #c71706";
                this.className = "warning";
                valid = "false";
            } else {
                isValid = true;
                if (isValid !== regex[i].test(this.value)) {
                    this.style.border = "2px solid #c71706";
                    this.className = "warning";
                    valid = "false";
                }
            }
        } else {
            if (this.id === 'frmBKN') {
                return true;
            } else {
                if (this.value === '') {
                    this.style.border = "2px solid #c71706";
                    this.className = "warning";
                    valid = "false";
                } else {
                    isValid = true;
                    if (isValid !== regex[i].test(this.value)) {
                        this.style.border = "2px solid #c71706";
                        this.className = "warning";
                        valid = "false";
                    };
                };
            };
        };
    });

    $.each(idd, function (i, item) {
        if ($('#user' + idd[i]).val() === 'false') {
            valid = "false";
        }
    });
    if (selReason[0].value === "Select the reason for your contact") {
        selReason[0].style.border = "2px solid #c71706";
        selReason[0].className = "warning";
        valid = 'false';
    } else {
        selReason[0].style.border = "1px solid #dedede";
        selReason[0].className = "userSelReason example-popover";
       if (valid === "false") {
            valid = 'false';
        }
    };
    if (valid === "false") {
        return false;
    } else {

        $('#submitMsg').hide();
        $('#imgLoading').show();

        var emailinfo = $('#contactForm').serialize();
        $.ajax({
            type: "POST",
            url: "/Api/Emailtous",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(decodeURIComponent(emailinfo)),
            success: function (data) {
                msg = data;
                $('#submitMsg').show();
                $('#imgLoading').hide();
                msg === "True" ? formReset("contactForm") : alert(msg);
            },
            error: function (xhr, desc, exceptionobj) {
                $('#submitMsg').show();
                $('#imgLoading').hide();

                console.log(xhr.responseText + ' = Error email to us');
            }
        });

    };
};
function formReset(frmID) {
    alert("Email sent.");
    $('#' + frmID + ' input[type=text], select, textarea').each(function () { $(this).val($(this).attr("placeholder")); });

    $("#frmReason").val("Select the reason for your contact").trigger('click');
   loadPage();
}
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
