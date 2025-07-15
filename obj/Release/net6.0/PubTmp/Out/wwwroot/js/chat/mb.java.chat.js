// File version
var fileVersion = 08012022;
/////////////////////////
$(document).ready((a) => {
    connect.ChatInterface.init({
        containerId: 'root',
        headerConfig: {
            isHTML: true,
            render: () => {
                return (`
                                <div class="header-wrapper">
                                    <h2 class="welcome-text">Chat Demo</h2>
                                    <p id="chatDescription">You can modify this header or use the default.</p>
                                </div>
                            `)
            }
        }
    });
});

var isValid = false;
var interval;
var echk;
var username = "";
var chkSts = 0;
var ContactId = '';
$(function () {
    $('.submit').click(function (e) {
        e.preventDefault();
        clearInterval(interval);
        echk = '';
        $('input[type=radio]:checked').each(function () {
            username = this.value;
        })
        var dfd = new $.Deferred();

        $.when(validation(), agtInfo()).done(function (result1, result2) {
            var customerName = $('#firstName').val();
            var question = $('#question').val();
            var refpage = document.referrer;
            var useragentbrowser = navigator.userAgent;
            var clientemail = $('#clientEmail').val();
            var status = $('#agtstatus').val();

            if (username == "4") {
                username = $('#agtEmail').text();
            }

            let att = JSON.stringify({
                "username": username,
                "customerName": customerName,
                "question": question,
                "refpage": refpage,
                "useragentbrowser": useragentbrowser,
                "clientemail": clientemail
            });
            if (result1 === false) {
                return;
            } else {

                console.log("this is the first name:" + customerName);
                console.log("this is the username: " + username);
                document.getElementById("chatDetails").reset();
                $('#firstName').blur();
                $('#username').blur();
                document.getElementById("startChat").disabled = true;
                document.getElementById("firstName").disabled = true;
                $("#nav").css("width", "1063");
                $('#chatWrapper').hide();
                $('#section-main').hide();
                $("#section-chat").show("slide");
                $("#section-chat").draggable({
                    handle: ".header-wrapper"
                });
                $("#divSpinner").fadeIn();
                //*** PRODUCTION *** //
                connect.ChatInterface.initiateChat({
                    name: customerName,
                    username: username,
                    region: "us-west-2",
                    apiGatewayEndpoint: "https://jxdaz82s3k.execute-api.us-west-2.amazonaws.com/live/awsconnect/startchat",
                    contactAttributes: att,
                    contactFlowId: "caeb91a4-17e6-4d69-b050-c3f0f105eccc",
                    instanceId: "29aef2c1-06fb-4c89-bb68-61faa40808f8"
                }, successHandler, failureHandler);

                // *** DEVELOP *** //
                //connect.ChatInterface.initiateChat({
                //    name: customerName,
                //    username: username,
                //    region: "us-west-2",
                //    apiGatewayEndpoint: "https://43iftkoseh.execute-api.us-west-2.amazonaws.com/live/",
                //    contactAttributes: att,
                //    contactFlowId: "71bd113f-587b-430c-9700-2bf94c3182b1",
                //    instanceId: "0b68b46f-be36-4598-b537-6c400eb5c46d"
                //}, successHandler, failureHandler);
            }
        }).fail(function () {
            interval = setInterval(function () { agtInfo(); }, 10000);
            chkSts = 1;
            return;
        });
    });
    $('input[type=radio][name=rdBtn]').change(function () {
        if (this.value === "4") {
            $('.errMsg').is(":visible") ? $('.errMsg').hide() : $('.errMsg').show();
            $('.dvAgtNa').show();
        } else {
            $('.errMsg').remove();
            $('.errMsg').is(":visible") ? $('.errMsg').hide() : $('.errMsg').show();
            $('.dvAgtNa').hide();
            $('#agtstatus').val('1');
            $('#agtName').val('');
        }
    });
    $('#spExpand').click(function () {
        if ($('.dvSchedule').is(":visible") == true) {
            $('#spExpand').removeClass('collapsed');
            $('.dvSchedule').hide('slow');
        } else {
            $('#spExpand').addClass('collapsed');
            $('.dvSchedule').show('slow');
        }
    });
    $('#firstName').click(function () {
        $(this).removeAttr('style');
    });
    $('#clientEmail').click(function () {
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
        e.preventDefault();
        var politeness = "null", proficiency = 'null', comments = '';
        var x = $('#formSurvey').serialize();
        var form = $('#formsurvey').serializeObject();
        'politeness' in form ? politeness = form.politeness : '';
        'proficiency' in form ? proficiency = form.proficiency : '';
        'comments' in form ? comments = form.comments : '';
        if (ContactId != '') {
            $.ajax({
                type: "POST",
                url: "/WS_Library.asmx/PostSurvey",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{transcript:' + form.transcript + ', politeness:"' + politeness + '", proficiency:"' + proficiency + '", comments:"' + comments + '", contactId:"' + ContactId + '"}',
                success: function (data) {
                    console.log(JSON.parse(data.d));
                    $('#section-main').show('slide');
                    $('.section-survey').hide('slide');
                    ContactId = '';
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

function validation() {
    var $deferred = $.Deferred();
    var customerName = $('#firstName');
    var question = $('#question');
    var clientemail = $('#clientEmail');
    var username = "";
    $('input[type=radio]:checked').each(function () {
        username = this.value;
    });
    $.each([customerName[0], clientemail[0], question[0]], function () {
        if (!this.value) {
            $(this).css('border-color', 'red');
            isValid = false;
            $deferred.reject();
            return;
        } else {
            isValid = true;
        }
    })
    if (isValid == true) {
        if (!username) {
            $('<span class="errMsg">Please select option.</span><br style="clear:both">').insertAfter('.dvAgentDetails');
            isValid = false;
            $deferred.reject();
        } else {
            if (username == '4') {
                if ($('#agtName').val() != '') {
                    var nm = $('#agtName').val();
                    if (isValidEmailAddress(nm) == true) {
                        echk = nm;
                        $deferred.resolve();
                    } else {
                        $('#agtName').css("border-color", "red");
                        $('<span class="errMsg">Please type a valid email address.</span><br style="clear:both">').insertAfter('.dvAgentDetails');
                        isValid = false;
                        $deferred.reject();
                        return;
                    }
                } else {
                    $('<span class="errMsg">Please type the agent email.</span><br style="clear:both">').insertAfter('.dvAgentDetails')
                    isValid = false;
                    $deferred.reject();
                    return;
                }
            } else {
                if (isValidEmailAddress(clientemail.val()) == true) {
                    isValid = true;
                    $deferred.resolve();
                    $('#agtstatus').val('1');
                }
                else {
                    clientemail.css("border-color", "red");
                    $('<span class="errMsg">Please type a valid email address.</span><br style="clear:both">').insertAfter('.dvAgentDetails');
                    isValid = false;
                    $deferred.reject();
                }
            }
        }
    }

    return $deferred.promise(isValid);
}
//Function to get Agent Info
$.searchAgent = function getAgtInf(nm) {
    console.log("get agent info start")
    return $.ajax({
        type: "POST",
        url: "/WS_Library.asmx/GetChtInfo",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{email:"' + nm + '"}'
    }).promise();
}

//Check the agent details if we have it
function agtInfo() {
    var dfd = $.Deferred();
    var date = new Date();
    var weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (echk != '') {
        var getAgt = $.searchAgent(echk);
        getAgt.done(function (data) {
            var jsonData = JSON.parse(data.d);
            if (jsonData != null) {

                if (!$('.dvAgentDetails').is(":visible")) {
                    var inImg = '<img src="https://pictures.tripmasters.com/siteassets/m/' + jsonData.AgentID + '.jpg" alt="' + jsonData.FirstName + ' ' + jsonData.LastName + '" title="' + jsonData.FirstName + ' ' + jsonData.LastName + '" />';
                    $('.dvAgentDetails div:nth-child(1)').html(inImg);
                    $('#agtNa').text(jsonData.FirstName + ' ' + jsonData.LastName);
                    $('#agtEmail').text(jsonData.AgentEmail);
                    username = jsonData.AgentEmail;
                    $('#day').html('Today: <b>' + weekday[date.getDay()] + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '</b>');
                    wkSchedule(data);
                } else {
                    if ($('#agtEmail').text() != jsonData.AgentEmail) {
                        var inImg = '<img src="https://pictures.tripmasters.com/siteassets/m/' + jsonData.AgentID + '.jpg" alt="' + jsonData.FirstName + ' ' + jsonData.LastName + '" title="' + jsonData.FirstName + ' ' + jsonData.LastName + '" />';
                        $('.dvAgentDetails div:nth-child(1)').html('');
                        $('.dvAgentDetails div:nth-child(1)').html(inImg);
                        $('#agtNa').text('');
                        $('#agtEmail').text('');
                        $('#day').html('');
                        $('#agtNa').text(jsonData.FirstName + ' ' + jsonData.LastName);
                        $('#agtEmail').text(jsonData.AgentEmail);
                        username = jsonData.AgentEmail;
                        $('#day').html('Today: <b>' + weekday[date.getDay()] + ' ' + monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + '</b>');
                        wkSchedule(data);
                    }
                }
                var status = jsonData.AgentStatus;
                //status = "Available";
                switch (status) {
                    case "Available":
                        if (jsonData.CoontactType == null || jsonData.CoontactType == contactType) {
                            if (jsonData.ActiveChats < activeChats) {
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
                                    $('.submit').trigger('click');
                                    chkSts = 0;
                                }
                                isValid = true;
                                dfd.resolve();
                            } else {
                                $('#status').text("Not available");
                                $('#status').removeClass('available');
                                $('#status').addClass('offline');
                                $('#agtName').val('');
                                $('.dvAgtNa').hide();
                                $('input[type=radio][name=rdBtn]').prop('checked', '');
                                if (!$('.errMsg').is(":visible")) {
                                    $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgentDetails');
                                }
                                $('.dvFormDetails').hide();
                                $('.dvChatHeader span:nth-child(3)').hide();
                                $('.dvChatHeader span:nth-child(4)').hide();
                                $('.dvAgentDetails').show();
                                isValid = false;
                                dfd.reject();
                            }
                        } else {
                            $('#status').text("Not available");
                            $('#status').removeClass('available');
                            $('#status').addClass('offline');
                            $('#agtName').val('');
                            $('.dvAgtNa').hide();
                            $('input[type=radio][name=rdBtn]').prop('checked', '');
                            if (!$('.errMsg').is(":visible")) {
                                $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgentDetails')
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
                        $('input[type=radio][name=rdBtn]').prop('checked', '');
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
                            $('input[type=radio][name=rdBtn]').prop('checked', '');
                            $('#status').switchClass('available', 'offline').text('Not available');
                            $('#agtName').val('');
                            if (!$('.errMsg').is(":visible")) {
                                $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgentDetails');
                            }
                            $('.dvChatHeader span:nth-child(3)').hide();
                            $('.dvChatHeader span:nth-child(4)').hide();
                            $('.dvAgentDetails').hide().slideDown('slow');
                        }
                        isValid = false;
                        dfd.reject();
                        break;
                }
            } else {
                isValid = false;
                $('.dvAgentDetails').slideUp('slow');
                $('.dvFormDetails').slideUp("fast");
                $('input[type=radio][name=rdBtn]').prop('checked', '');
                clearInterval(interval);
                echk = '';
                if (!$('.errMsg').is(":visible")) {
                    $('<span class="errMsg">Agent is not available, please select other option or agent.</div>').insertAfter('.dvAgentDetails');
                }

                dfd.reject();
            }
        });
    } else {
        dfd.resolve();
    }
    return dfd.promise();
}

//Function work schedule
function wkSchedule(obj) {
    var weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var date = new Date();
    var jsonData = JSON.parse(obj.d);
    var hrs = "";
    var hre = "";
    var workDay = weekday[date.getDay()];
    $(".dvSchedule").html('');
    $.each(weekday, function (i, n) {
        $.each(jsonData, function (k, v) {
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
function successHandler(chatSession) {
    window.chatSession = chatSession;

    // chat connected

    $("#divSpinner").fadeOut(200);
    $('#chatWrapper').fadeIn(400);

    //Change the incoming data set
    chatSession.incomingItemDecorator = function (item) {
        if (["SYSTEM_MESSAGE"].indexOf(item.displayName) !== -1) {
            item.displayName = "System Message";
        }

        if (chatSession.transcript.length > 0) {
            var transcriptItem = chatSession.transcript[chatSession.transcript.length - 1];
            if (transcriptItem.transportDetails.direction === "Incoming") {
                var chatDescription = "Welcome to TripMasters";
                var name = transcriptItem.displayName;
                if (["prod", "$LATEST", "AI Assistant", "SYSTEM_MESSAGE", "System Message"].indexOf(name) === -1) {
                    chatDescription = "You are now chatting with " + name;
                }
                document.getElementById("chatDescription").innerHTML = chatDescription;
            }
        }

        return item;
    };

    chatSession.onIncoming(function (data) {
        console.log("incoming message:|| " + JSON.stringify(data));
        if (chatStart == undefined && data.ParticipantRole == "AGENT") {
            chatStart = new Date();
            console.log(chatStart);
        }
    });

    chatSession.onOutgoing(function (data) {
        //  console.log("outgoing message: " + JSON.stringify(data));
        chatEnd = new Date();
    });

    chatSession.onChatDisconnected(function (data) {
        resetForm();
        //$('#section-main').show('slide');
        var dif = chatEnd - chatStart;
        var sec = dif / 1000;
        elapsedTime = Math.round(Math.abs(sec));
        elapsedTime > 60 ? $('.section-survey').show('slide').delay(4500) : $('#section-main').show('slide');
        //$('.section-survey').show('slide').delay(4500);
    });

    connect.ChatInterface.init({
        containerId: 'root',
        headerConfig: {
            isHTML: true,
            render: () => {
                return (`
                            <div class="header-wrapper">
                                <img class="welcome-image" src="https://pictures.tripmasters.com/siteassets/d/ChatIcon.png" />
                                <span id="chatDescription">Welcome to TripMasters</span>
                            </div>
                        `)
            }
        }
    });
}



function failureHandler(error) {
    // chat failed
    console.log("failed", error);
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
    $('.dvFormDetails').show('slow');
    $('.dvChatHeader span:nth-child(3)').show();
    $('.dvChatHeader span:nth-child(4)').show();
    $('.dvAgentDetails').hide('slow');
    $('.dvAgtNa').hide();
    $('.errMsg').text('');
    $('.errMsg').remove();
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