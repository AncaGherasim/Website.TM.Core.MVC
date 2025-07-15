var isValid = false;
var interval;
var echk;
var username = "";
var chkSts = 0;
var ContactId = '';
var agentMsgToSurvey = 0;
var customerName = "";
var question = "";
var refpage = "";
var useragentbrowser = "";
var clientemail = "";
var status = "";

//New code
function IframeRef(frameRef) {
    return frameRef.contentWindow
        ? frameRef.contentWindow.document
        : frameRef.contentDocument
}
function getIframe() {
    const collection = document.getElementsByClassName("show");
    var myElement = 1;
    if (collection.length >= 1) {
        myElement = collection[1];
    }
    var inside = IframeRef(myElement);
    var oo = inside.getElementsByClassName("htrRUB");
    var eContactId2 = inside.querySelectorAll("[data-testid=amazon-connect-chat-wrapper]");
    if (eContactId2.length > 0) {
        ContactId = eContactId2[0].getAttribute("data-contactid");
    }
    if (oo.length > 0) {
        myOo = oo[0];
        myOo.addEventListener("click", clickEndChat, false);
    }

    var timer2 = setInterval(function () {
        var cc = inside.getElementsByClassName("htrRUB");
        if (cc.length > 0) {
            let count = cc[0].children.length;
            if (count > 0) {
                let firstChild = cc[0].firstChild;
                if (firstChild.innerText == "Close chat" || firstChild.innerText == "Close") {
                    clearInterval(timer2);
                    myCc = cc[0];
                    myCc.addEventListener("click", clickEndChat, false);
                }
            }
        }
    }, 1000);

}
function clickEndChat() {
    console.log("Before LoadSurvey");
    LoadSurvey();
    setTimeout(function () {
        document.getElementById("amazon-connect-chat-widget").style.display = "none";

        const collection = document.getElementsByClassName("acOpenButton-0-0-9");
        if (collection.length > 0) {
            collection[0].style.display = "none";
        }
    }, 3000);
}

$(function () {


    $("body").on("click", ".sc-gzVnrw", function () {
        console.log("body.click.sc-gzVnrw");
    });

    $('#startChat').click(function (e) {
        e.preventDefault();
        clearInterval(interval);
        echk = '';
        isValid = true;

        //Names, Email validation
        customerName = $('#firstName');
        question = $('#question');
        clientemail = $('#clientEmail');
        username = "";
        $('input[type=radio]:checked').each(function () {
            username = this.value;
        });
        $.each([customerName[0], clientemail[0], question[0]], function () {
            if (!this.value) {
                $(this).css('border-color', 'red');
                isValid = false;
            } else {
                isValid = true;
            }
        })
        if (isValid == true) {
            if (!username) {
                $('<span class="errMsg">Please select option.</span><br style="clear:both">').insertAfter('.dvAgentDetails');
                isValid = false;
            } else {
                if (isValidEmailAddress(clientemail.val()) == true) {
                    isValid = true;
                    $('#agtstatus').val('1');
                }
                else {
                    clientemail.css("border-color", "red");
                    $('<span class="errMsg">Please type a valid email address.</span><br style="clear:both">').insertAfter('.dvAgentDetails');
                    isValid = false;
                }
                if (username == '99') {
                    if ($('#agtName').val() != '') {
                        var nm = $('#agtName').val();
                        if (isValidEmailAddress(nm) == true) {
                            echk = nm;
                        } else {
                            $('#agtName').css("border-color", "red");
                            $('<span class="errMsg">Please type a valid agent email address.</span><br style="clear:both">').insertAfter('.dvAgtNa');
                            isValid = false;
                        }
                    } else {
                        $('<span class="errMsg">Please type the agent email.</span><br style="clear:both">').insertAfter('.dvAgtNa');
                        isValid = false;
                    }
                }
            }
        }

        var hasAgent = false;
        if (isValid == true) {
            //Agent validation
            var date = new Date();
            var weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if (echk != '') {
                hasAgent = true;
                username = $('#agtEmail').text();
               $.ajax({
                    type: "POST",
                    url: "/Api/GetChtInfo",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(echk),
                    success: function (response) {
                        var jsonData = response[0];
                        if (jsonData != null) {

                            if (!$('.dvAgentDetails').is(":visible")) {
                                var inImg = '<img src="https://pictures.tripmasters.com/siteassets/d/' + jsonData.agentId + '.jpg" alt="' + jsonData.firstName + ' ' + jsonData.lastName + '" title="' + jsonData.firstName + ' ' + jsonData.lastName + '" />';
                                $('.dvAgentDetails div:nth-child(1)').html(inImg);
                                $('#agtNa').text(jsonData.firstName + ' ' + jsonData.lastName);
                                $('#agtEmail').text(jsonData.agentEmail);
                                username = jsonData.agentEmail;
                                $('#day').html('Today: <b>' + weekday[date.getDay()] + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '</b>');
                                wkSchedule(response);
                            } else {
                                if ($('#agtEmail').text() != jsonData.agentEmail) {
                                    var inImg = '<img src="https://pictures.tripmasters.com/siteassets/d/' + jsonData.agentId + '.jpg" alt="' + jsonData.firstName + ' ' + jsonData.lastName + '" title="' + jsonData.firstName + ' ' + jsonData.lastName + '" />';
                                    $('.dvAgentDetails div:nth-child(1)').html('');
                                    $('.dvAgentDetails div:nth-child(1)').html(inImg);
                                    $('#agtNa').text('');
                                    $('#agtEmail').text('');
                                    $('#day').html('');
                                    $('#agtNa').text(jsonData.firstName + ' ' + jsonData.lastName);
                                    $('#agtEmail').text(jsonData.agentEmail);
                                    username = jsonData.agentEmail;
                                    $('#day').html('Today: <b>' + weekday[date.getDay()] + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '</b>');
                                    wkSchedule(response);
                                }
                            }
                            var status = jsonData.agentStatus;
                            //status = "Available";
                            switch (status) {
                                case "Available":
                                    if (jsonData.contactType == null || jsonData.contactType == contactType) {
                                        if (jsonData.activeChats < activeChats) {
                                            $('#status').text("Available");
                                            $('#status').removeClass('offline');
                                            $('#status').addClass('available');
                                            $('#agtstatus').val('1');
                                            $('.dvFormDetails').hide();
                                            $('.dvChatHeader span:nth-child(3)').hide();
                                            $('.dvChatHeader span:nth-child(4)').hide();
                                            if ($('.errMsg').is(":visible")) {
                                                $('.errMsg').remove();
                                            }
                                            if (chkSts == 1) {
                                                clearInterval(interval);
                                                $('#startChat').trigger('click');
                                                chkSts = 0;
                                            }
                                            //$('.errMsg').remove();
                                            isValid = true;
                                        } else {
                                            $('#status').text("Not available");
                                            $('#status').removeClass('available');
                                            $('#status').addClass('offline');
                                            $('#agtName').val('');
                                            $('.dvAgtNa').hide();
                                            //$('input[type=radio][name=rdBtn]').prop('checked', '');
                                            if (!$('.errMsg').is(":visible")) {
                                                $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgtNa');
                                            }
                                            $('.dvFormDetails').hide();
                                            $('.dvChatHeader span:nth-child(3)').hide();
                                            $('.dvChatHeader span:nth-child(4)').hide();
                                            $('.dvAgentDetails').show();
                                            isValid = false;
                                        }
                                    } else {
                                        $('#status').text("Not available");
                                        $('#status').removeClass('available');
                                        $('#status').addClass('offline');
                                        $('#agtName').val('');
                                        $('.dvAgtNa').hide();
                                        //$('input[type=radio][name=rdBtn]').prop('checked', '');
                                        if (!$('.errMsg').is(":visible")) {
                                            $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgtNa')
                                        }
                                        $('.dvFormDetails').hide();
                                        $('.dvChatHeader span:nth-child(3)').hide();
                                        $('.dvChatHeader span:nth-child(4)').hide();
                                        $('.dvAgentDetails').show();
                                        isValid = false;
                                    }

                                    break;
                                case "Busy":
                                    $('#status').text("Not available (on a call)");
                                    $('#status').removeClass('available');
                                    $('#status').addClass('offline');
                                    $('#agtName').val('');
                                    $('.dvAgtNa').hide();
                                    //$('input[type=radio][name=rdBtn]').prop('checked', '');
                                    isValid = false;
                                    $('.dvFormDetails').hide();
                                    $('.dvChatHeader span:nth-child(3)').hide();
                                    $('.dvChatHeader span:nth-child(4)').hide();
                                    $('.dvAgentDetails').show();
                                    break;
                                default:
                                    if (!$('.dvAgentDetails').is(':visible')) {
                                        $('.dvFormDetails').slideUp("fast");
                                        $('.dvAgtNa').slideUp(); //hide();
                                        //$('input[type=radio][name=rdBtn]').prop('checked', '');
                                        $('#status').switchClass('available', 'offline').text('Not available');
                                        $('#agtName').val('');
                                        if (!$('.errMsg').is(":visible")) {
                                            $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgtNa');
                                        }
                                        $('.dvChatHeader span:nth-child(3)').hide();
                                        $('.dvChatHeader span:nth-child(4)').hide();
                                        $('.dvAgentDetails').hide().slideDown('slow');
                                    }
                                    isValid = false;
                                    break;
                            }
                        } else {
                            isValid = false;
                            $('.dvAgentDetails').slideUp('slow');
                            $('.dvFormDetails').slideUp("fast");
                            //$('input[type=radio][name=rdBtn]').prop('checked', '');
                            clearInterval(interval);
                            echk = '';
                            if (!$('.errMsg').is(":visible")) {
                                $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgtNa');
                            }
                        }

                        if (isValid == true) {
                            OpenChat();
                            return;
                        }

                    }
                });
            }
        }

        if (isValid == true && hasAgent == false) {
            OpenChat();
            return;
       }
    });

    function OpenChat() {
        customerName = $('#firstName').val();
        question = $('#question').val();
        refpage = document.referrer;
        useragentbrowser = navigator.userAgent;
        clientemail = $('#clientEmail').val();
        status = $('#agtstatus').val();

        if (username == "99") {
            username = $('#agtEmail').text();
        }

        document.getElementById("chatDetails").reset();
        $('#firstName').blur();
        $('#username').blur();
        document.getElementById("startChat").disabled = true;
        document.getElementById("firstName").disabled = true;
        //document.getElementById("username").disabled = true;
        $("#nav").css("width", "1063");
        $('#chatWrapper').hide();
        $('#section-main').hide();
        $("#section-chat").show("slide");
        $("#section-chat").draggable({
            handle: ".header-wrapper"
        });
        $("#divSpinner").fadeIn();


        //New code
        (function (w, d, x, id) {
            s = d.createElement('script');
            s.src = 'https://dg9yx063wiiht.cloudfront.net/amazon-connect-chat-interface-client.js';
            s.async = 1;
            s.id = id;
            d.getElementsByTagName('head')[0].appendChild(s);
            w[x] = w[x] || function () { (w[x].ac = w[x].ac || []).push(arguments) };
        })(window, document, 'amazon_connect', '103b353d-e55b-44f4-84c2-5550be60fd63');
        amazon_connect('styles', { openChat: { color: 'white', backgroundColor: '#123456' }, closeChat: { color: 'white', backgroundColor: '#123456' } });
        amazon_connect('snippetId', 'QVFJREFIaW80NEppRGNKMjg1T0xNN2M5djJLZkVBUmFXNVlJeW5VM3RXSDRmMU9zb0FHSUFUL3hHb3FoQzJyZUl3a2l4RU1xQUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNT2M3L3lxMkR2ZlpPM0hHZ0FnRVFnQ3RWeEhuM3IrRDE1RitocnE1bU9NZy95cEViQUV1SXJjanMrK0M3WTN3YnFEL0RFb3lGdGlqUzRjOHI6OlpxWFFMczdROE8zaURTOUxtWEdBZThxeGZaaXQ5dXBiS0ZZRlZ3K2dsVktIY0RNa2hqZnY2WVRLcDB4cGRvbUpYT0NmdlhTcGJoTWNiZWVBZm9oaGdJbEVkWGI0SFJqdExzTG1BaE1kY2pjVS8zaHkrWVc2ZU52TkJ6OFM4T0xNdzUzc1VQRnFNV05yRWRaeUU2bjlZSE9rUCs0dHdKYz0=');
        amazon_connect('supportedMessagingContentTypes', ['text/plain', 'text/markdown']);
        //amazon_connect("customerDisplayName", function (callback) {
        //    const displayName = "M S";
        //    callback(displayName);
        //});

        amazon_connect('customerDisplayName', function (callback) {
            const displayName = customerName;
            callback(displayName);
        });

        amazon_connect('authenticate', function (callback) {
            console.log("get user data");
            $("#divSpinner").fadeOut(200);

            let data = {
                "username": username,
                "customerName": customerName,
                "question": question,
                "refpage": refpage,
                "useragentbrowser": useragentbrowser,
                "clientemail": clientemail
            };
            console.log(data);

            function reqListener() {
                console.log("listener: " + this.responseText);
            }

            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.addEventListener("load", reqListener);
            xobj.open('POST', " https://jxdaz82s3k.execute-api.us-west-2.amazonaws.com/live/awsconnect/widgetchat", true);
            xobj.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xobj.onreadystatechange = function () {
                console.log("xobj.status = " + xobj.status);
                if (xobj.readyState == 4 && xobj.status == "200") {
                    let data = JSON.parse(xobj.responseText);
                    console.log(data);
                    agentMsgToSurvey++;
                    callback(data.data);
                }
            };
            xobj.send(JSON.stringify(data));


        });

        setTimeout(function () {
            const collection = document.getElementsByClassName("acOpenButton-0-0-9");
            if (collection.length > 0) {
                collection[0].click();
            }
        }, 3000);

        var timer = setInterval(function () {
            const collection = document.getElementsByClassName("show");
            console.log(collection.length);
            if (collection.length == 2) {
                if (collection[1].nodeName != "DIV") {
                    clearInterval(timer);
                    getIframe();
                }
            }
        }, 1000);
    }


    $('input[type=radio][name=rdBtn]').change(function () {
        if (this.value === "99") {
            $('.errMsg').is(":visible") ? $('.errMsg').hide() : $('.errMsg').show();
            $('.dvAgtNa').show();
        } else {
            $('.errMsg').remove();
            $('.errMsg').is(":visible") ? $('.errMsg').hide() : $('.errMsg').show();
            $('.dvAgtNa').hide();
            $('#agtstatus').val('1');
            $('#agtName').val('');
        }
    })
    $('#spExpand').click(function () {
        if ($('.dvSchedule').is(":visible") == true) {
            $('#spExpand').removeClass('collapsed');
            $('.dvSchedule').hide();
        } else {
            $('#spExpand').addClass('collapsed');
            $('.dvSchedule').show();
        }
    });
    $('#firstName').click(function () {
        $(this).removeAttr('style');
    })
    $('#clientEmail').click(function () {
        $('.errMsg').remove();
        $(this).removeAttr('style');
    });
    $('#question').click(function () {
        $(this).removeAttr('style');
    });
    $('#agtName').focus(function () {
        $('.errMsg').remove();
        $(this).removeAttr('style');
    });
    $(':checkbox').change(function () {
        if (this.value == "true") {
            $(this).prop("checked", true);
            $('#no').prop('checked', false);
        } else {
            $(this).prop("checked", true);
            $('#yes').prop('checked', false);
        }
    });
    $('#submitSurvey').click(function (e) {
        var politeness = "null", proficiency = "null", comments = '';
        var x = $('#formSurvey').serialize();
        var form = $('#formsurvey').serializeObject();
        'politeness' in form ? politeness = form.politeness : '';
        'proficiency' in form ? proficiency = form.proficiency : '';
        'comments' in form ? comments = form.comments : '';
        if (ContactId != '') {
            $.ajax({
                type: "POST",
                url: "/Api/PostSurvey",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"transcript":' + form.transcript + ', "politeness":"' + politeness + '", "proficiency":"' + proficiency + '", "comments":"' + comments + '", "contactId":"' + ContactId + '"}',
                success: function (data) {
                    //console.log(JSON.parse(data.d));
                    $('#section-main').show('slide');
                    $('.section-survey').hide('slide');
                    ContactId = '';
                    agentMsgToSurvey = 0;
                    resetSurvey();
                },
                error: function (xhr, desc, exceptionobj) {
                    alert(xhr.responseText + ' = error');
                }
            });
        }
    });
});

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

//Function work schedule
function wkSchedule(obj) {
    var weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var date = new Date();
    var jsonData = obj;
    var hrs = "";
    var hre = "";
    var workDay = weekday[date.getDay()];
    $(".dvSchedule").html('');
    $.each(weekday, function (i, n) {
        $.each(jsonData[0], function (k, v) {
            if (n == k.replace("In", "")) {
                var hr = new Date(v);
                hrs = formatAMPM(hr);
            }
            if (n == k.replace("Out", "")) {
                var hr = new Date(v);
                hre = formatAMPM(hr);
                if (v != null) {
                    var strDiv = "<div class='dvDaySchedule'><span class='spDay'> " + n + " </span><span class='spDayHours'> " + hrs + " - " + hre + " ET" + "</span></div>";
                } else {
                    hrs = "Day Off"
                    var strDiv = "<div class='dvDaySchedule'><span class='spDay'> " + n + " </span><span class='spDayHours'> " + hrs + "</span></div>";
                }
                $(".dvSchedule").append(strDiv);
            }
            if (workDay == k.replace("In", "")) {
                var hr = new Date(v);
                hrs = formatAMPM(hr);
            }
            if (workDay == k.replace("Out", "")) {
                var hr = new Date(v);
                hrs = formatAMPM(hr);
                $("#work").html("Working: <b>" + hrs + " - " + hre + " ET</b>");
            }
        });
    });
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//Chat Management

var chatStart;
var chatEnd;
var elapsedTime;

function LoadSurvey() {
    console.log("LoadSurvey");
    resetForm();
    agentMsgToSurvey > 0 ?
        $('.section-survey').show('slide').delay(4500)
        :
        $('#section-main').show('slide');
}

function resetForm() {
    document.getElementById("startChat").disabled = false;
    document.getElementById("firstName").disabled = false;
    document.getElementById("clientEmail").disabled = false;
    document.getElementById("question").disabled = false;
    $("#section-chat").removeAttr('style');
    $("#nav").css("width", "690");
    $("#section-chat").hide("slide");
    document.getElementById("chatDetails").reset();
    $('#agtstatus').val('0');
    $('.dvFormDetails').show();
    $('.dvChatHeader span:nth-child(3)').show();
    $('.dvChatHeader span:nth-child(4)').show();
    $('.dvAgentDetails').hide();
    $('.dvAgtNa').hide();
    $('.errMsg').text('');
    $('.errMsg').remove();
    $('.dvSchedule').html('');
}

function resetSurvey() {
    document.getElementById('formsurvey').reset();
    document.getElementById("yes").checked = false;
    document.getElementById("no").checked = true;
    $('input[name=politeness]').attr('checked', false);
    $('input[name=proficiency]').attr('checked', false);
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};

function blinkChatTabOff() {
    sound.pause();
    clearInterval(timeoutId);
    timeoutId = null;
    document.title = oldTitle;
    document.getElementById('ctl00_tmFavicon').href = oldIcon;
    document.removeEventListener("click", blinkChatTabOff);
};