<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Untitled Document</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body>
<table width="60%" border="0" align="center" cellpadding="0" cellspacing="2">
  <tr>
    <td><table width="100%" border="0" cellspacing="0" cellpadding="3">
      <tr>
        <td bgcolor="#FFCC00" class="DarkYellCornerR"><font size="2"><strong>Quick
              Vacation Builder</strong></font></td>
      </tr>
      <tr>
        <td style="border:solid 1px #FFCC00" bgcolor="#FFFFCC">
          <%     
          iRegion=2919 'Request.QueryString("iRegion")
          'iDestCity=Request.QueryString("iDestCity")
          iDept=536 'Request.QueryString("iDept")
          iDesc="You selected "
          iProductItemID=Request.QueryString("iProductItemID")
          if iProductItemID="" then iProductItemID=0
          GeneralLoc=Request.Form("GeneralLoc")
          %>
          <FORM NAME="frmListQry" METHOD="post" style="margin:0;" >
            <table width="100%" border="0" align="center" cellpadding="3" cellspacing="0" bordercolor="#FFFFCC" bgcolor="#FFFFCC"  style="border:solid 1px #FFFFCC" >
              <!--<tr valign="middle">
                <td height="40" align="center" bgcolor="#FFFFCC" class="BluebosLcorn">&nbsp;</td>
                <td height="40" colspan="4" align="center" bgcolor="#0066FF" class="TD-TitleDialBox"><%=iDesc%></td>
                <td align="center" bgcolor="#0066FF" class="BluebosRcorn">&nbsp;</td>
              </tr>
              <tr align="left">
                <td width="100%">
				<fieldset style="border:solid 1 #cccccc">
				<legend><strong>Today :</strong></legend>
				 <table width="100%" border="0" cellpadding="5" cellspacing="0">
                  <tr>
                    <td></td>
                  </tr>
                </table></fieldset></td>
              </tr>-->
              <tr align="left">
                <td colspan="2"><font size="1" face="Verdana, Arial, Helvetica, sans-serif">
                  <script language="JavaScript1.2">
var months=new Array(13);
months[1]="January";
months[2]="February";
months[3]="March";
months[4]="April";
months[5]="May";
months[6]="June";
months[7]="July";
months[8]="August";
months[9]="September";
months[10]="October";
months[11]="November";
months[12]="December";
var time=new Date();
var lmonth=months[time.getMonth() + 1];
var date=time.getDate();
var year=time.getYear();
if (year < 2000)    // Y2K Fix, Isaac Powell
year = year + 1900; // http://onyx.idbsu.edu/~ipowell
document.write("<right>" + lmonth + " ");
document.write(date + ", " + year + "</right>");
                        </script>
                </font></td>
              </tr>
              <tr align="left">
                <td colspan="2"><legend><strong>From / Departure City :</strong></legend>
                </td>
              </tr>
              <tr align="left">
                <td colspan="2"><input  name=inputText1 class="BOX" onKeyUp="findItemA(1,'iDepCity');" size=8>
                    <select name="iDepCity" class="BOX" id=select style="WIDTH: 190px">
                      <option value=0>
                      <option value=2872>Aberdeen, SD
                      <option value=2874>Abilene,TX
                      <option value=1613>Akron-Canton, OH
                      <option value=2126>Alamosa, CO
                      <option value=2154>Albany, GA
                      <option value=1023>Albany, NY
                      <option value=86>Albuquerque, NM
                      <option value=2036>Alexandria, LA
                      <option value=1608>Allentown, PA
                      <option value=1610>Altoona, PA
                      <option value=2037>Amarillo, TX
                      <option value=2178>Anaheim, CA
                      <option value=87>Anchorage, AK
                      <option value=1657>Appleton,WI
                      <option value=1649>Ashville, NC
                      <option value=1680>Aspen, CO
                      <option value=1648>Athens, GA
                      <option value=1025>Atlanta, GA
                      <option value=1609>Atlantic City, NJ
                      <option value=1647>Augusta, GA
                      <option value=2495>Augusta, ME
                      <option value=1644>Austin, TX
                      <option value=2069>Bakersfield, CA
                      <option value=1076>Baltimore, MD
                      <option value=1588>Bangor, ME
                      <option value=2453>Bar Harbor, ME
                      <option value=1705>Baton Rouge, LA
                      <option value=2040>Beaumont, TX
                      <option value=2127>Beaver Creeck, CO
                      <option value=2457>Beckley, WV
                      <option value=2129>Bellingham, WA
                      <option value=1074>Billings, MO
                      <option value=1587>Binghamton, NY
                      <option value=1581>Birmingham, Al
                      <option value=2097>Bismarck , ND
                      <option value=2066>Bloomington, IL
                      <option value=2180>Bluefield/Princintn, WV
                      <option value=1975>Boca Raton, FL
                      <option value=1075>Boise, ID
                      <option value=2>Boston,MA
                      <option value=2397>Boulder City, Nv
                      <option value=2579>Bozeman, MT
                      <option value=1612>Bradford, PA
                      <option value=1518>Bradley, CA
                      <option value=2334>Breckenridge, CO
                      <option value=1585>Bridgeport, CT
                      <option value=2322>Brookings, SD
                      <option value=2242>Brownsville, TX
                      <option value=1027>Buffalo, NY
                      <option value=2068>Burbank, CA
                      <option value=2092>Burlington, IA
                      <option value=1519>Burlington, VT
                      <option value=3054>Butte,MT
                      <option value=2548>Casper, WY
                      <option value=1658>Cedar Rapids, IA
                      <option value=2317>Chadron, NE
                      <option value=1706>Champaign, IL
                      <option value=1688>Charleston, SC
                      <option value=1617>Charleston, WV
                      <option value=1029>Charlotte, NC
                      <option value=1615>Charlottesville,VA
                      <option value=1687>Chattanooga, TN
                      <option value=2098>Cheyenne,WY
                      <option value=1724>Chicago, IL (CHI All Airports)
                      <option value=1566>Chicago, IL O'Hare
                      <option value=1597>Chicago, IL Midway
                      <option value=1030>Cincinnati, OH
                      <option value=1616>Clarksburg, WV
                      <option value=1028>Cleveland, OH
                      <option value=2547>Cody, WY
                      <option value=2041>College Station, TX
                      <option value=1681>Colorado Springs, CO
                      <option value=1668>Columbia, SC
                      <option value=1689>Columbus, GA
                      <option value=1659>Columbus, OH
                      <option value=1982>Corpus Cristi, TX
                      <option value=2544>Crescent City, CA
                      <option value=1032>Dallas-Ft Worth, TX
                      <option value=1599>Dayton, OH
                      <option value=1707>Daytona Beach, FL
                      <option value=2303>Decatour IL.
                      <option value=1031>Denver, CO
                      <option value=1661>Des Moines, IA
                      <option value=2524>Detroit, MI (DTT All Airports)
                      <option value=1033>Detroit,MI Metropolitan
                      <option value=2538>Devils Lake, ND
                      <option value=1645>Dodge City, KS
                      <option value=1618>Dubois, PA
                      <option value=2064>Duluth, MN
                      <option value=2079>Durango, CO
                      <option value=2551>El Centro, CA
                      <option value=1981>El Paso, TX
                      <option value=1589>Elmira, NY
                      <option value=1619>Erie, PA
                      <option value=1574>Eugene, OR
                      <option value=1708>Evansville, IN
                      <option value=2325>Fargo, ND
                      <option value=1691>Fayetteville, NC
                      <option value=1693>Flint, MI
                      <option value=1692>Florence, SC
                      <option value=2336>Fort Collins, CO
                      <option value=1590>Fort Lauderdale, FL (airport)
                      <option value=1662>Fort Myers, FL (FMY All Airports)
                      <option value=1714>Fort Myers, FL (RSW Southwest)
                      <option value=2197>Fort Walton Beach, FL
                      <option value=1621>Fort Wayne, IN
                      <option value=1620>Franklin, PA
                      <option value=1640>Fresno, CA
                      <option value=2042>FT Smith, AR
                      <option value=2929>FT Yukon, AK
                      <option value=2294>Fulton Intl, OH
                      <option value=2326>Garden City, KS
                      <option value=3220>Gianesville,FL
                      <option value=2549>Gillette, WY
                      <option value=2156>Grand Forks, ND
                      <option value=2550>Grand Junction, AK
                      <option value=1652>Grand Rapids, MI
                      <option value=2157>Great Falls, MT
                      <option value=2308>Great Bend, KS
                      <option value=1663>Green Bay, WI
                      <option value=1653>Greensboro, NC
                      <option value=1694>Greenville, SC
                      <option value=2441>Greenville, NC
                      <option value=2107>Gulfport,Biloxi,MS
                      <option value=2081>Gunnison,CO
                      <option value=1622>Hagerstown, MD
                      <option value=2045>Harlingen, TX
                      <option value=2930>Harrisburg, (HAR) PA
                      <option value=1631>Harrisburg, PA
                      <option value=1979>Hartford Sprngfld, CT
                      <option value=2310>Hays, KS
                      <option value=2200>Helena, MT
                      <option value=1696>Hickory, NC
                      <option value=30>Honolulu,HI
                      <option value=2039>Houston, TX (HOU Hobby)
                      <option value=1078>Houston, TX (IAH Goerge Bush)
                      <option value=1623>Huntington, WV
                      <option value=1701>Huntsville, AL
                      <option value=2539>Huron, SD
                      <option value=1592>Hyannis, MA
                      <option value=3056>Idaho Falls,MT
                      <option value=1036>Indianapolis, IN
                      <option value=1576>Inyokern, CA
                      <option value=2312>Iron Mountain, MI
                      <option value=2313>Ironwood,MI
                      <option value=1594>Ithaca, NY
                      <option value=993>Jackson , WY
                      <option value=1718>Jackson, MS
                      <option value=1037>Jacksonville, FL
                      <option value=1711>Jacksonville, NC
                      <option value=1595>Jamestown, NY
                      <option value=2329>Jamestown, ND
                      <option value=1626>Johnstown, PA
                      <option value=2205>Kahului Maui, HI
                      <option value=1650>Kalamazoo, MI
                      <option value=3052>Kalispell,MT
                      <option value=1041>Kansas City, MO
                      <option value=1667>Kansas City, MO (All Airport)
                      <option value=3199>Kansas,KS
                      <option value=3030>Ketchikan, AK
                      <option value=1709>Key West, FL
                      <option value=2335>Keystone, CO
                      <option value=2046>Killeen, TX
                      <option value=3050>Klamath Falls,OR
                      <option value=1673>Knoxsville,TN
                      <option value=2062>Lacrosse, WI
                      <option value=2307>Lafayette, IN
                      <option value=2050>Lafayette, LA
                      <option value=2049>Lake Charles, LA
                      <option value=1628>Lancaster, PA
                      <option value=2067>Lansing, MI
                      <option value=2131>Laramie, WY
                      <option value=2051>Laredo Intl, TX
                      <option value=1038>Las Vegas, NV
                      <option value=1627>Latrobe, PA
                      <option value=2047>Lawton, OK
                      <option value=1596>Lebanon, NH
                      <option value=1629>Lewisburg, WV
                      <option value=3057>Lewiston Clarks,ID
                      <option value=1654>Lexington, KY
                      <option value=2331>Liberal, KS
                      <option value=1676>Lincoln, NE
                      <option value=1664>Little Rock, AR
                      <option value=2070>Long Beach, CA
                      <option value=2044>Longview, TX
                      <option value=1039>Los Angeles, CA
                      <option value=1656>Louisville, KY
                      <option value=2048>Lubbock, TX
                      <option value=1593>Long island MC Islip, NY
                      <option value=1630>Lynchburg, VA
                      <option value=2100>Macon, GA
                      <option value=1665>Madison, WI
                      <option value=1598>Manchester, NH
                      <option value=2034>Marathon, FL
                      <option value=1155>Marrakech, MA
                      <option value=1600>Martha's Vineyard, MA
                      <option value=2435>Massena, NY
                      <option value=1577>Medford, OR
                      <option value=1710>Melbourne, FL
                      <option value=1042>Memphis, TN
                      <option value=2553>Merced, CA
                      <option value=1043>Miami, FL
                      <option value=2052>Midland Odessa, TX
                      <option value=1044>Milwaukee, WI
                      <option value=1045>Minneapolis, MN
                      <option value=2244>Mobile, AL
                      <option value=2554>Modesto, CA
                      <option value=1666>Moline, IL
                      <option value=2468>Monroe, LA
                      <option value=1572>Monterey, CA
                      <option value=1699>Montgomery, AL
                      <option value=1632>Morgantown, WV
                      <option value=3040>Moses Lake,WA
                      <option value=2305>Mount Vernon IL.
                      <option value=2304>Mattoon, IL
                      <option value=2053>Mcallen, TX
                      <option value=2319>Mccook, NE
                      <option value=2742>Meknes, MA
                      <option value=2158>Missoula, MT
                      <option value=2243>Montrose, CO
                      <option value=1660>Mosinee, WI
                      <option value=2314>Muskegon, MI
                      <option value=1700>Myrtle Beach, FL
                      <option value=1646>Nantucket, MA
                      <option value=1704>Naples, FL
                      <option value=1651>Nashville, TN
                      <option value=1690>New Bern, NC
                      <option value=1562>New Haven, CT
                      <option value=1046>New Orleans, LA
                      <option value=1>New York, NY (NYC All Airports)
                      <option value=19>New York, NY (EWR Newark)
                      <option value=3422>New York, NY (LGA La Guardia)
                      <option value=3423>New York, NY (JFK J.F.Kennedy)
                      <option value=1634>Newport News, VA
                      <option value=1633>Norfolk, VA
                      <option value=3048>North Bend,OR
                      <option value=2318>North Platte, NE
                      <option value=1571>Oakland, CA
                      <option value=1601>Ogdensburg , NY
                      <option value=1677>Oklahoma City, OK
                      <option value=1678>Omaha, NE
                      <option value=1570>Ontario, CA
                      <option value=1568>Orange County, CA
                      <option value=1725>Orlando, FL (ORL All Airports)
                      <option value=1040>Orlando, FL (MCO Int'l Airport)
                      <option value=2301>Ottumwa, IA
                      <option value=1578>Oxnard, CA
                      <option value=1641>Palm Springs, CA
                      <option value=1712>Panama City, FL
                      <option value=1635>Parkersburg WV
                      <option value=3045>Pasco,WA
                      <option value=3047>Pendleton,OR
                      <option value=1713>Pensacola, FL
                      <option value=1670>Peoria, IL
                      <option value=1048>Philadelphia, PA
                      <option value=1049>Phoenix, AZ
                      <option value=2094>Pierre, SD
                      <option value=2463>Pinehurst Pines, NC
                      <option value=1050>Pittsburgh, PA
                      <option value=1603>Plattsburgh, NY
                      <option value=2159>Pocatello, ID
                      <option value=3037>Port Angeles,WA
                      <option value=1047>Portland, OR
                      <option value=1051>Portland, ME
                      <option value=2454>Poughkeepsie, NY
                      <option value=1604>Presque Isle, ME
                      <option value=2332>Pueblo, CO
                      <option value=3058>Pullman,WA
                      <option value=2306>Quincy, IL
                      <option value=1052>Raleigh-Durham, NC
                      <option value=992>Rapid City, IA
                      <option value=2445>Reading, PA
                      <option value=2556>Redding, CA
                      <option value=2557>Redmond, OR
                      <option value=1683>Reno, NV
                      <option value=2339>Rhinelander, WI
                      <option value=1567>Richmond, VA
                      <option value=2132>Riverton, WY
                      <option value=1636>Roanoke, VA
                      <option value=1582>Rochester, NY
                      <option value=2058>Rochester, MN
                      <option value=2133>Rock Springs, WY
                      <option value=2455>Rockland, ME
                      <option value=1671>Rockford, IL
                      <option value=2446>Rocky Mount, NC
                      <option value=1643>Sacramento, CA
                      <option value=2181>Sacrameto Exec, CA
                      <option value=1655>Saginaw, MI
                      <option value=2311>Salina, KS
                      <option value=1637>Salisbury, MD
                      <option value=1252>Salisbury, UK
                      <option value=1057>Salt Lake City, UT
                      <option value=2054>San Angelo, TX
                      <option value=1445>San Antonio, TX
                      <option value=1053>San Diego, CA
                      <option value=1055>San Francisco, CA
                      <option value=1569>San Jose, CA
                      <option value=1642>Santa Barbara, CA
                      <option value=2321>Santa Fe, NM
                      <option value=1682>Santa Maria, CA
                      <option value=1605>Saranac Lake, NY
                      <option value=1717>Sarasota, FL
                      <option value=1702>Savannah, GA
                      <option value=2316>Scottsbluff, NE
                      <option value=2409>Scrantn Wilkesbre, PA
                      <option value=1054>Seattle, WA
                      <option value=2134>Sheridan, WY
                      <option value=1716>Shreveport, LA
                      <option value=1674>Sioux Falls, SD
                      <option value=2059>South Bend, IN
                      <option value=1575>Spokane, WA
                      <option value=1715>Springfield, MO
                      <option value=2060>Springfield, IL
                      <option value=1058>St Louis, MO
                      <option value=1980>Syracuse Hancock Intl, NY
                      <option value=1672>Sheboygan, WI
                      <option value=1639>Shenandoah Valley, VA
                      <option value=2302>Spencer, IA
                      <option value=2278>St Maarten, NA
                      <option value=2558>St. George, UT
                      <option value=2155>ST. Petersburg, FL
                      <option value=1583>Stewart Newburgh, NY
                      <option value=2082>STMBT Springs, CO
                      <option value=3059>Sun Valley,ID
                      <option value=1793>Tallahassee, FL
                      <option value=1060>Tampa, FL
                      <option value=2340>Telluride, CO
                      <option value=2055>Texarkana, AR
                      <option value=1606>Toledo, OH
                      <option value=1719>Topeka, KS
                      <option value=2061>Traverse City, MI
                      <option value=1684>Tucson, AZ
                      <option value=1679>Tulsa, OK
                      <option value=2464>Tri City Arpt ,TN
                      <option value=2056>Tyler, TX
                      <option value=1607>Utica, NY
                      <option value=2562>Utila, HN
                      <option value=2080>Vail Eagle, CO
                      <option value=2333>Vail Van, CO
                      <option value=2559>Visalia, CA
                      <option value=2035>Waco, TX
                      <option value=3046>Walla Walla,WA
                      <option value=91>Washington, DC (WAS All Airports)
                      <option value=3417>Washingron, DC (DCA Reagan Nat)
                      <option value=3416>Washington, DC (IAD Dulles)
                      <option value=1076>Washington, DC (BWI Baltimore)
                      <option value=1586>Watertown, NY
                      <option value=3038>Wenatchee,WA
                      <option value=1669>West Palm Beach, FL
                      <option value=1675>Wichita, KS
                      <option value=2076>Whichita Falls, TX
                      <option value=1561>Westchester, NY
                      <option value=1625>Williamsport, PA
                      <option value=1624>Wilmington, NC
                      <option value=2328>Williston, ND
                      <option value=1602>Worcester, MA
                      <option value=1697>Wintson-Salem, NC
                      <option value=2135>Worland, WY
                      <option value=2136>Yakima, WA
                      <option value=2465>YoungsTown/ Warr, OH
                      <option value=1685>Yuma, AZ
                    </select>
                </td>
              </tr>
              <tr align="left">
                <td colspan="2"><legend><strong>To / Destination City :</strong></legend>
                </td>
              </tr>
              <tr align="left">
                <td colspan="2">
                  <p>
                    <select name="Destino" class="BOX" style="WIDTH: 190px">
                      <option value=0 selected>
                      <option value=0>MEXICO
                      <option value=0>-----------
                      <option value=1891>Acapulco
                      <option value=1890>Cancun/Hotel Zone
                      <option value=1925>Cancun/Riviera Maya-Playa del Carmen
                      <option value=1889>Cozumel
                      <option value=1983>Los Cabos
                      <option value=1881>Mazatlan
                      <option value=1882>Manzanillo
                      <option value=1926>Puerto Vallarta
                      <option value=1885>Ixtapa
                      <option value=1887>Huatulco
                      <option value=0>
                      <option value=0>CARIBBEAN
                      <option value=0>-----------
                      <option value=2277>Antigua
                      <option value=2275>Aruba
                      <option value=2348>Barbados
                      <option value=2372>Bahamas / Nassau
                      <option value=2384>Bahamas / Freeport
                      <option value=2384>Bahamas / Paradise Island
                      <option value=2349>Curacao, NA
                      <option value=2977>Dom.Rep. / Juan Dolio
                      <option value=2375>Dom.Rep. / Puerto Plata
                      <option value=2379>Dom.Rep. / Punta Cana
                      <option value=2368>Dom.Rep. / La Romana
                      <option value=3313>Jamaica / Negril
                      <option value=2370>Jamaica / Montego Bay
                      <option value=3312>Jamaica / Ocho Rios
                      <option value=3312>Jamaica / Runaway Bay
                      <option value=3312>Jamaica / Falmouth
                      <option value=1703>Puerto Rico
                      <!--<OPTION VALUE=3320>St Barth-->
                      <option value=2386>St. Lucia
                      <option value=2278>St Maarten, NA
                      <option value=2374>Turks and Caicos
                      <option value=2387>US Virgin Islands / St Croix
                      <option value=3314>US Virgin Islands / St John
                      <option value=2279>US Virgin Islands / St Thomas
                    </select>
                  </p>
                </td>
              </tr>
              <tr align="left">
                <td colspan="2"><legend><strong>Dates (mm/dd/yyyy): </strong></legend>
                </td>
              </tr>
              <tr align="left">
                <td align="left" >
                  <table width="100%" border="0" align="center" cellpadding="1" cellspacing="0">
                    <tr align="center">
                      <td colspan="2"><font arial, helvetica, sans-serif>Departure:</font></td>
                    </tr>
                    <tr>
                      <td align="right"><input 
                  name=iFromDate class="BOX"  id=iFromDate style="COLOR: blue" size=10 onClick="alert('*** PLEASE click on calendar to choose your travel date *** ')">
                      </td>
                      <td><a onClick="gfPop.fStartPop(document.frmListQry.iFromDate,'01/01/2050')" href="javascript:void(0)" ><img src="http://Travelxml.net/DefaultImages/Solar/BD/calendar.gif" border=0 ></a></td>
                    </tr>
                  </table>
                </td>
                <td align="left" ><table width="100%" border="0" align="center" cellpadding="1" cellspacing="0">
                    <tr align="center">
                      <td colspan="2"><font arial, helvetica, sans-serif 
                  >Return:</font></td>
                    </tr>
                    <tr>
                      <td align="right"><input 
                  name=iReturnDate class="BOX"  id=iReturnDate style="COLOR: blue" size=10>
                      </td>
                      <td><a onClick="gfPop.fEndPop(document.frmListQry.iFromDate,document.frmListQry.iReturnDate)" href="javascript:void(0)" ><img src="http://Travelxml.net/DefaultImages/Solar/BD/calendar.gif" border=0 ></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr align="left">
                <td colspan="2" align="left" >
                  <legend><strong>Passengers:</strong></legend>
                </td>
              </tr>
              <tr>
                <td align="left" ><font arial, helvetica, sans-serif>Adult(s):
                      <input name=iAdults class="BOX"  id=iAdults style="COLOR: blue" value=2 size=2>
                </font></td>
                <td align="left" ><font arial, helvetica, sans-serif>Children:
                      <select name="iChildren" class="BOX" id=select3 onChange="showChildText(this.value)">
                        <option value=0>0
                        <option value=1>1
                        <option value=2>2
                        <option value=3>3
                        <option value=4>4
                      </select>
                </font></td>
              </tr>
              <tr>
                <td colspan="2" align="left" ><table width="100%" border="0">
                  <tr align="center" valign="middle">
                    <td><div id=childText1 style="visibility:hidden"><font size="1" face="Verdana, Arial, Helvetica, sans-serif">Child
                          Age 1:
                              <select name=iChild1 class="BOX" id=iChild1 style="COLOR: blue" size=1>
                                <option  value="" selected>select
                                <option value="1">Less 1
                                <option value="1">1
                                <option value="2">2
                                <option value="3">3
                                <option value="4">4
                                <option value="5">5
                                <option value="6">6
                                <option value="7">7
                                <option value="8">8
                                <option value="9">9
                                <option value="10">10
                                <option value="11">11
                              </select>
                      </font></div>
                    </td>
                    <td><div id=childText2 style="visibility:hidden"><font size="1" face="Verdana, Arial, Helvetica, sans-serif">Child
                          Age 2:
                              <select name=iChild2 class="BOX" id=iChild2 style="COLOR: blue" size=1>
							   <option  value="" selected>select
                                <option value="1">Less 1
                                <option value="1">1
                                <option value="2">2
                                <option value="3">3
                                <option value="4">4
                                <option value="5">5
                                <option value="6">6
                                <option value="7">7
                                <option value="8">8
                                <option value="9">9
                                <option value="10">10
                                <option value="11">11
                              </select>
                      </font></div>
                    </td>
                    <td><div id=childText3 style="visibility:hidden"><font size="1" face="Verdana, Arial, Helvetica, sans-serif">Child
                          Age 3:
                              <select name=iChild3 class="BOX" id=iChild3 style="COLOR: blue" size=1>
							   <option  value="" selected>select
                                <option value="1">Less 1
                                <option value="1">1
                                <option value="2">2
                                <option value="3">3
                                <option value="4">4
                                <option value="5">5
                                <option value="6">6
                                <option value="7">7
                                <option value="8">8
                                <option value="9">9
                                <option value="10">10
                                <option value="11">11
                              </select>
                      </font></div>
                    </td>
                    <td><div id=childText4 style="visibility:hidden"><font size="1" face="Verdana, Arial, Helvetica, sans-serif">Child
                          Age 4:
                              <select name=iChild4 class="BOX" id=iChild4 style="COLOR: blue" size=1>
							    <option  value="" selected>select
                                <option value="1">Less 1
                                <option value="1">1
                                <option value="2">2
                                <option value="3">3
                                <option value="4">4
                                <option value="5">5
                                <option value="6">6
                                <option value="7">7
                                <option value="8">8
                                <option value="9">9
                                <option value="10">10
                                <option value="11">11
                              </select>
                      </font> </div>
                    </td>
                  </tr>
                </table></td>
              </tr>
              <tr>
                <td colspan="2" align="left" ><font size="1" face="Arial, Helvetica, sans-serif">Generally
                    Children are under 12 years of age.</font></td>
              </tr>
              <tr>
                <td colspan="2" align="left" ><font size="1" face="Arial, Helvetica, sans-serif">If
                    booking more than one room, each room needs a separate booking.</font></td>
              </tr>
              <tr align="center">
                <td colspan="2" ><img src="file:///C|/Inetpub/wwwroot/Test-XSL-Site/images/searchflight.gif" width="82" height="26" border=0 style="CURSOR: hand" onClick=getflights() ></td>
              </tr>
            </table>
            <br>
            <input type="hidden" name="iCity">
            <input type="hidden" name="iDestCity">
            <input type="hidden" name="iCity1">
            <input type="hidden" name="iDestCity1">
            <input type="hidden" name="iProductItemID" value=0>
            <input type="hidden" name="iDate1">
            <input type="hidden" name="cOutTime" value="0900">
            <input type="hidden" name="cInTime" value="0900">
            <input type="hidden" name="iChkVal" value='AH'>
			<input type="hidden" name="AirPref">
			<input type="hidden" name="tAlign">
		    <input type="hidden" name="PageNumbers" value="text">
			<input type="hidden" name="Continue" value="Button">
			<input type="hidden" name="MoreItems" value="Image">
            <input type="hidden" name="bFirst" value="1">
			<!-- colours -->
			<input type="hidden" name="ItemTitle">
			<input type="hidden" name="ItemDetails">
			<input type="hidden" name="AirDetails">
			<input type="hidden" name="ItemHeader" value="#D1DCF3">
			<input type="hidden" name="ItemText">
			<!-- next Arrival -->
			<input type="hidden" name="GetNextDay" value="No">
			<!-- systempick or cheapers -->
			<input type="hidden" name="DefaultorCheapest" value="Cheapest">
			<!-- Marketing -->
			<input type="hidden" name="CampaignCode">
	
			<INPUT Type=Hidden Name=IPAddresses Value="63.79.97.238-63.79.97.237">
            <INPUT type="hidden" Name=GeneralLoc Value="http://www.beachdestinations.com/General/Beach/BD-DefaultImages/">
           <!--<input type="hidden" name=SystemID value="12ADD4CF-5763-44F6-B145-B4007531F461">--><!--TEST-->
			 <INPUT Type="Hidden" Name=SystemID Value="B3E36AE7-0E39-4B3F-B892-4CE2446D83CD"><!--BEACH--> 
            <iframe id=gToday:normal:agenda.js 
            style="BORDER-RIGHT: 2px ridge; BORDER-TOP: 2px ridge; Z-INDEX: 999; LEFT: -500px; VISIBILITY: visible; BORDER-LEFT: 2px ridge; BORDER-BOTTOM: 2px ridge; POSITION: absolute; TOP: 0px" 
            name=gToday:normal:agenda.js 
            src="calendar/ipopeng.htm" frameborder=0 width=168 
            scrolling=no height=175> </iframe>
          </form>
          <script>
function getflights()
   {
     //document.frmListQry.iDept.value=<%=iDept%>
     //document.frmListQry.iRegion.value=<%=iRegion%>
     document.frmListQry.iCity.value=document.frmListQry.iDepCity.value
     document.frmListQry.iDate1.value=document.frmListQry.iReturnDate.value
     document.frmListQry.iDestCity.value=document.frmListQry.Destino.value
     document.frmListQry.iCity1.value=document.frmListQry.Destino.value
     document.frmListQry.iDestCity1.value=document.frmListQry.iCity.value  
     document.frmListQry.action="http://www.travelxml.net/TVLAPI/CityStay3/CS_CityStayLIST.ASP"
	//document.frmListQry.action="http://209.208.186.84/TVLAPI/CityStay3/CS_CityStayLIST.ASP"
     document.frmListQry.submit()
   }
   
  function findItemA(n,listType) 
   {

	eval("findVal = (new String(document.frmListQry.inputText" + n + ".value)).toLowerCase()");	
	eval("len=document.frmListQry." + listType + ".length");
 	 	 
	var findLength = findVal.length;
	
	for (count=0; count<len; count++) 
	   {
		eval("compVal = (new String(document.frmListQry." + listType + ".options[count].text)).toLowerCase()");
		var subStrin = compVal.substr(0, findLength);
		
		if (findVal == subStrin) 
		  {
			eval("document.frmListQry." + listType + ".options[count].selected = true");
			
			break; 
		  } 
       }
   } 
   
function hightlightdate(fdate,tdate)
   { 
     if (fdate!="")
     {
       ndays=toDate(fdate,tdate)
     
       for (i=0;i<=ndays;i++) 
        {
          var ndate=new Date(fdate) 
          var dateNew= new Date(ndate.setDate(ndate.getDate()+i));
          
          y=dateNew.getFullYear(); m=dateNew.getMonth()+1 ; d=dateNew.getDate()
          
          gfPop.fAddEvent(y,m,d,"","","lightblue","Black","","","");
        }
     }
   }
   function childTexttoArea()
{
	noChildAge1    = document.forms[0].iChild1.value
	noChildAge2    = document.forms[0].iChild2.value
	noChildAge3    = document.forms[0].iChild3.value
	noChildAge4    = document.forms[0].iChild4.value

	strChildren=""
	if (noChildAge1!="")
	   strChildren    =   strChildren + document.forms[0].iChild1.value
	if (noChildAge2!="")
	   strChildren    =   strChildren + "\n" +document.forms[0].iChild2.value 
	if (noChildAge3!="")
	   strChildren    =   strChildren + "\n" +document.forms[0].iChild3.value 
	if (noChildAge4!="")
	   strChildren    =   strChildren + "\n" + document.forms[0].iChild4.value 

	document.forms[0].iChildren.value=strChildren;
}   
function showChildText(n)
{
  for(i=1;i<=n;i++)
   eval("document.all['childText"+i+"'].style.visibility='visible'");
   
  for(;i<=4;i++)
  {
    eval("document.all['childText"+i+"'].style.visibility='hidden'"); 
    eval("document.frmListQry.iChild"+i+".value=''"); 
  }
}
          </script>
        </td>
      </tr>
    </table></td>
  </tr>
</table>
</body>
</html>
