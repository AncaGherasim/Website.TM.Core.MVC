
<%
		'Dim x
		'for each x in Request.ServerVariables
		 'response.write("<b>"& x & " = </b>" & request.ServerVariables(x) &"<br/>")
		'next
		'response.End()

Dim sCampaignCode
Dim sReferer
Dim URLTCamp
Dim item
Dim sURL
	
	sURL = request.ServerVariables("URL")
	
	URLTCamp= Trim(request.ServerVariables("QUERY_STRING"))

	if InStr(sURL,".aspx") > 0 OR sURL ="" then
	    Response.Cookies("utmcampaign")("a") = ""
	
	end if
	
	If InStr(URLTCamp, "utm_campaign") > 0 Then
	
		sCampaignCode = Replace(URLTCamp, Mid(URLTCamp, 1, InStr(URLTCamp, "utm_campaign=") - 1), "")

		If InStr(sCampaignCode, "&") > 0 Then
			sCampaignCode = Mid(sCampaignCode, InStr(sCampaignCode, "=") + 1, Len(sCampaignCode))
			sCampaignCode = Mid(sCampaignCode, 1, InStr(sCampaignCode, "&") - 1)
		Else
			sCampaignCode = Mid(sCampaignCode, InStr(sCampaignCode, "=") + 1, Len(sCampaignCode))
		End If
		
		    'response.Write(sCampaignCode &" = 1<br>")
		
	Else 
			sCampaignCode = Request.Cookies("utmcampaign")("a")
			'response.Write(sCampaignCode &" = 2<br>")
					
	End If
		
        If  sCampaignCode = "" Then
            sCampaignCode = "Direct"
        End If
				
			Response.Cookies("utmcampaign")("a") = sCampaignCode
			Response.Cookies("utmcampaign").Expires=cstr(dateadd("d", 365, now()))
		
%>

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-71558-6");
pageTracker._initData();
pageTracker._trackPageview();
</script>
<script src="/SO_Library.js"></script>
<link href="/SO_Style.css" rel="stylesheet" type="text/css">

<SCRIPT LANGUAGE="JavaScript">
<!-- Hide from older browsers

   function onHome() {
      document.images["homeMouseOver"].src = "/images/Nav_header/tab_Home_on.jpg";
   }

   function offHome() {
      document.images["homeMouseOver"].src = "/images/Nav_header/tab_Home_off.jpg";
   }

   function onAsia() {
      document.images["asiaMouseOver"].src = "/images/Nav_header/tab_Asia_on.jpg";
   }

   function offAsia() {
      document.images["asiaMouseOver"].src = "/images/Nav_header/tab_Asia_off.jpg";
   }

    function onBeaches() {
      document.images["beachesMouseOver"].src = "/images/Nav_header/tab_Beaches_on.jpg";
   }

   function offBeaches() {
      document.images["beachesMouseOver"].src = "/images/Nav_header/tab_Beaches_off.jpg";
   }

   function onEurope() {
      document.images["europeMouseOver"].src = "/images/Nav_header/tab_Europe_on.jpg";
   }

   function offEurope() {
      document.images["europeMouseOver"].src = "/images/Nav_header/tab_Europe_off.jpg";
   }

   function onLatin() {
      document.images["latinMouseOver"].src = "/images/Nav_header/tab_Latin_on.jpg";
   }

   function offLatin() {
      document.images["latinMouseOver"].src = "/images/Nav_header/tab_Latin_off.jpg";
   }
   
function PageChange(a){
//var URL = a;
var goURL = a

if (goURL.indexOf('Latin_') > 0){
	goURL = 'http://latin.tripmasters.com'
}
if (goURL.indexOf('Asia') > 0){
	goURL = 'http://asia.tripmasters.com'
}
if (goURL.indexOf('Europe') > 0){
	goURL = 'http://europe.tripmasters.com'
}
window.location.href = goURL //URL

}   

// End script hiding -->
</SCRIPT>

<style type="text/css">
<!--
body {
	margin-top: 0px;
}
-->
</style>
<table width="980" height="120" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr height="50px" valign="middle">
    <td align="left" width="350px"><img src="/images/Nav_header/Header_Logo.jpg" width="344" height="45" border="0" usemap="#HeaderMap"></td>
	<td width="630px"><table width="99%" border="0" align="center" cellpadding="3" cellspacing="0">
        <tr>
		  <td align="left" valign="middle" style="padding-left:50px; "><img src="/images/head_feedb.gif"></td>
		  <td align="right"><span class="Text_18_GrayBold">1-800-430-0484</span><br />
		  <span class="Text_10_Gray" style="line-height:1em; "> Mon-Fri 9am - 2:30am ET<br />Sat-Sun 10am - 7:30pm ET</span></td>

	    </tr>
      	</table> 
	</td>
  </tr>
   <tr>
      <td colspan="2" height="40px"><table width="100%"  border="0" cellpadding="0" cellspacing="0" class="Nav_off">
      <tr align="center">

	    <td width="150px"><img style="cursor:hand" onClick="PageChange('http://www.tripmasters.com')" src="/images/Nav_header/tab_Home_on.jpg" name="homeMouseOver"></td>
		<td width="150px"> <img onMouseOver="onAsia()" onMouseOut="offAsia()" style="cursor:hand" onClick="PageChange('http://asia.tripmasters.com')"src="/images/Nav_header/tab_Asia_off.jpg" name="asiaMouseOver"></td>
        <td width="150px"><img onMouseOver="onBeaches()" onMouseOut="offBeaches()" style="cursor:hand" onClick="PageChange('http://beaches.tripmasters.com')"src="/images/Nav_header/tab_Beaches_off.jpg" name="beachesMouseOver"></td>
        <td width="150px"><img onMouseOver="onEurope()" onMouseOut="offEurope()"style="cursor:hand" onClick="PageChange('http://europe.tripmasters.com')" src="/images/Nav_header/tab_Europe_off.jpg" name="europeMouseOver"></td>
		<td width="150px"><img onMouseOver="onLatin()" onMouseOut="offLatin()"style="cursor:hand" onClick="PageChange('http://latin.tripmasters.com')" src="/images/Nav_header/tab_Latin_off.jpg" name="latinMouseOver"></td>
		<td width="230px"><img align="left" src="/images/Nav_header/tab_off.jpg"></td>
		</tr>
    </table></td>
  </tr>
    <tr>
    <td height="30" colspan="2" valign="middle" style="padding-left:18px; padding-bottom:3px;" class="Nav_sub Nav_light_blue_16">
	<A href="http://www.solartours.com" class="a1">Home</A> &nbsp;| &nbsp;
	<A href="/About_Us.asp" class="a1">About us</A> &nbsp;|&nbsp;
	<A href="/Contact_Us.asp" class="a1">Contact us</A> &nbsp;|&nbsp;
	<A href="/FAQ.asp" class="a1">FAQ</A> &nbsp;|&nbsp;
	<A href="/Insurance.asp" class="a1">Travel Insurance</A> &nbsp;|&nbsp;
	<A href="/Terms.asp" class="a1">Terms &amp; Conditions</A> &nbsp;|&nbsp;
	<A href="/CreditCard.asp" class="a1">Credit Card Form</A> &nbsp;|&nbsp;
	<A href="/Payment_Options.asp" class="a1">Payments </A>
	</td>
  </tr>
</table>
<div align="center"><img src="/images/spacer.gif" width="4" height="4"><br>
</div>
