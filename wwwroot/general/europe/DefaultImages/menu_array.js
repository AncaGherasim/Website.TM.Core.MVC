


menunum=0;
menus=new Array();
_d=document;

function addmenu()
 {
 menunum++;menus[menunum]=menu;
 }

function dumpmenus()
 { 
  mt="<script language=javascript>";
   for(a=1;a<menus.length;a++)
    {
     mt+=" menu"+a+"=menus["+a+"];"
    }
   mt+="<\/script>";_d.write(mt)
 }


   effect = "Fade(duration=0.2);Alpha(style=0,opacity=88);Shadow(color='#777777', Direction=135, Strength=5)"


   timegap=500	                // The time delay for menus to remain visible
   followspeed=5		// Follow Scrolling speed
   followrate=40		// Follow Scrolling Rate
   suboffset_top=10;	       // Sub menu offset Top position 
   suboffset_left=10;	       // Sub menu offset Left position
   closeOnClick = true

style1=[			// style1 is an array of properties. You can have as many property arrays as you need. This means that menus can have their own style.
         "white",	    // Mouse Off Font Color
         "7eb1b3",		// Mouse Off Background Color
         "000000",		// Mouse On Font Color
         "d7e7e7",		// Mouse On Background Color
         "ffffff",		// Menu Border Color 
         12,			// Font Size in pixels
         "normal",		// Font Style (italic or normal)
         "bold",		// Font Weight (bold or normal)
         "Verdana, Arial",	// Font Name
         4,			// Menu Item Padding
         "http://63.141.109.77/travelknowhow/travelknowhow/arrow.gif",		// Sub Menu Image (Leave this blank if not needed)
         ,			// 3D Border & Separator bar
         "66ffff",		// 3D High Color
         "000099",		// 3D Low Color
         "Purple",		// Current Page Item Font Color (leave this blank to disable)
         "pink",		// Current Page Item Background Color (leave this blank to disable)
         "http://63.141.109.77/travelknowhow/travelknowhow/arrowdn.gif",		// Top Bar image (Leave this blank to disable)
         "ffffff",		// Menu Header Font Color (Leave blank if headers are not needed)
         "000099",		// Menu Header Background Color (Leave blank if headers are not needed)
         "white",		// Menu Item Separator Color
        ]


addmenu(menu=[    		// This is the array that contains your menu properties and details
                "mainmenu",	// Menu Name - This is needed in order for the menu to be called
                105,		// Menu Top Top position
                120,		// Menu Left  position 
		101,		// Menu Width 
		1,		// Menu Border Width 
		,	// Screen Position - here you can use "center;left;right;middle;top;bottom" or a combination of "center:middle"
		style1,		// Properties Array - this is set higher up, as above
		1,		// Always Visible - allows the menu item to be visible at all time (1=on/0=off)
		"center",	// Alignment - sets the menu elements text alignment, values valid here are: left, right or center
		,		// Filter - Text variable for setting transitional effects on menu activation - see above for more info
		,		// Follow Scrolling - Tells the menu item to follow the user down the screen (visible at all times) (1=on/0=off)
		1, 		// Horizontal Menu - Tells the menu to become horizontal instead of top to bottom style (1=on/0=off)
		,		// Keep Alive - Keeps the menu visible until the user moves over another menu or clicks elsewhere on the page (1=on/0=off)
		,		// Position of TOP sub image left:center:right
		,		// Set the Overall Width of Horizontal Menu to 100% and height to the specified amount (Leave blank to disable)
		,		// Right To Left - Used in Hebrew for example. (1=on/0=off)
		,		// Open the Menus OnClick - leave blank for OnMouseover (1=on/0=off)
		,		// ID of the div you want to hide on MouseOver (useful for hiding form elements)
		,		// Background image for menu when BGColor set to transparent.
		,		// Scrollable Menu
		,		// Reserved for future use
        ,"Home","http://209.208.186.85/travelknowhow/travelknowhow/prodtype/",,"Home",1 // "Description Text", "URL", "Alternate URL", "Status", "Separator Bar"
	,"City Stays","show-menu=packages",,"Tour Packages options",1 
//      ,"Air","http://63.79.97.251/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=TravelKnowhow*&iProductType=2&iRegion=7",,"Flight Booking",1 
         ,"Air Only","http://209.208.186.85/travelknowhow/travelknowhow/prodtype/aironly.htm",,"Flight Booking",1 
//        ,"Air Only","show-menu=air",,"Air options",1
	,"Hotel Only","show-menu=hotels",,"Hotels options",1
	,"SightSeeing","show-menu=sights",,"sightSeeing options ",1
	,"Transfer","show-menu=transfers",,"Transfer options",1
	,"Car Rental","show-menu=cars",,"Car Rental options",1
        ,"Cruise","show-menu=cruises",,"Cruise Package options",1
	,"My Stuff","show-menu=mystuff",,"Your Itinerary details",1
            
	 ])


      addmenu(menu=["specials",
	               ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
	               ,"Europe","show-menu=pkgeurope",,,0
	               ,"Central America","show-menu=pkglatin",,,0
	             ])


          addmenu(menu=["air",
	               ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
	               ,"Central America","http://10.1.1.22/TKHAPI/AIR/AIR_QUERYFORM_Q.ASP?iDept=202&iRegion=CA&iRegionId=1813",,,0
	               ,"Europe","http://10.1.1.22/TKHAPI/AIR/AIR_QUERYFORM_Q.ASP?iDept=202&iRegion=EU&iRegionId=7",,,0
		       ,"Latin America","http://10.1.1.22/TKHAPI/AIR/AIR_QUERYFORM_Q.ASP?iDept=202&iRegion=LA&iRegionId=1915",,,0
 		       ,"Mexico","http://10.1.1.22/TKHAPI/AIR/AIR_QUERYFORM_Q.ASP?iDept=202&iRegion=MX&iRegionId=1836",,,0
  	               ,"South America","http://10.1.1.22/TKHAPI/AIR/AIR_QUERYFORM_Q.ASP?iDept=202&iRegion=SA&iRegionId=1814",,,0
	             ])


	   addmenu(menu=["hotels",
	               ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
//	               ,"Asia","http://209.208.186.85/travelknowhow/travelknowhow/Air/AIR_QUERYFORM_Q.ASP?iDept=206&iRegion=ASI&iRegionId=1813",,,0
//	               ,"Caribbean","http://209.208.186.85/travelknowhow/travelknowhow/Air/AIR_QUERYFORM_Q.ASP?iDept=206&iRegion=WCA&iRegionId=1813",,,0
	               ,"Central America","http://10.1.1.22/TKHAPI/HotelMCity/HOTEL_QUERYFORM_Q.ASP?iDept=206&iRegion=CA&iRegionId=1813",,,0
	               ,"Europe","http://10.1.1.22/TKHAPI/HotelMCity/HOTEL_QUERYFORM_Q.ASP?iDept=206&iRegion=EU&iRegionId=7",,,0
		       ,"Latin America","http://10.1.1.22/TKHAPI/HotelMCity/HOTEL_QUERYFORM_Q.ASP?iDept=206&iRegion=LA&iRegionId=1915",,,0
 		       ,"Mexico","http://10.1.1.22/TKHAPI/HotelMCity/HOTEL_QUERYFORM_Q.ASP?iDept=206&iRegion=MX&iRegionId=1836",,,0
  	               ,"South America","http://10.1.1.22/TKHAPI/HotelMCity/HOTEL_QUERYFORM_Q.ASP?iDept=206&iRegion=SA&iRegionId=1814",,,0
//	               ,"South Pacific","http://209.208.186.85/travelknowhow/travelknowhow/Air/AIR_QUERYFORM_Q.ASP?iDept=206&iRegion=SP&iRegionId=3022",,,0
//                     ,"U.S.A","http://209.208.186.85/travelknowhow/travelknowhow/Air/AIR_QUERYFORM_Q.ASP?iDept=206&iRegion=USA&iRegionId=3137",,,0
// 		       ,"World Regions","http://209.208.186.85/travelknowhow/travelknowhow/Air/AIR_QUERYFORM_Q.ASP?iDept=206&iRegion=WORLD&iRegionId=2919",,,0
	             ])

       addmenu(menu=["sights",
		      ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
//                      ,"Europe","http://208.252.83.22/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=139&iRegion=7",,,0
		      ,"Central America","http://63.79.97.251/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=152&iRegion=1813",,,0
		
		     ])
	
     addmenu(menu=["cars",
		      ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
//                      ,"Europe","http://208.252.83.22/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=32&iRegion=7",,,0
	               ,"Hawaii","http://209.208.186.89/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=costco&Group=Tkh*&iProductType=32&iRegion=3137",,,0
		      ,"Central America","http://63.79.97.251/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=32&iRegion=1813",,,0
	
		     ])

       addmenu(menu=["transfers",
	              ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
//                      ,"Europe","http://208.252.83.22/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=223&iRegion=7",,,0
	               ,"Mexico","http://209.208.186.89/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=costco&Group=Tkh*&iProductType=60&iRegion=1836",,,0
		      ,"Central America","http://63.79.97.251/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=149&iRegion=1813",,,0
	
		    ])

       addmenu(menu=["cruises",
		      ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
//		      ,"Europe","http://208.252.83.22/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=24&iRegion=7",,,0
		      ,"South America","http://63.79.97.251/Ti02/reservations/Rsv_ExternalUserLogin.asp?Register=tournet&Group=Tkh*&iProductType=24&iRegion=1814",,,0
		    ])

       addmenu(menu=["mystuff",
		      ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
	 	      ,"My Bookings","http://209.208.186.89/Ti02/Portal/Prt_ExternalUserLogin.asp?Register=tournet&Group=Tkh*",,,0
		      ,"My Itinerary","http://209.208.186.89/Ti02/Portal/Prt_Itinerary.asp",,,0
		    ])

       addmenu(menu=["pkgeurope",
		      ,,125,1,"",style1,,"left",effect,,,,,,,,,,,,
		      ,"Austria","http://travelknowhow.com",,,0
	 	      ,"France","http://travelknowhow.com",,,0
	 	      ,"Germany","http://travelknowhow.com",,,0
		      ,"Italy","http://travelknowhow.com",,,0
 		      ,"Spain","http://travelknowhow.com",,,0
	 	      ,"Swiss","http://travelknowhow.com",,,0
	 	      ,"England","http://travelknowhow.com",,,0
		      ,"Europe Multi-City","http://travelknowhow.com",,,0
		    ])

     addmenu(menu=["pkglatin",
		      ,,120,1,"",style1,,"left",effect,,,,,,,,,,,,
		      ,"Belize","http://travelknowhow.com",,,0
	 	      ,"Brazil","http://travelknowhow.com",,,0
	 	      ,"Costa Rica","http://travelknowhow.com",,,0
		      ,"Argentina","http://travelknowhow.com",,,0
 		      ,"Mexico","http://travelknowhow.com",,,0
	 	      ,"Panama","http://travelknowhow.com",,,0
	 	      ,"Peru","http://travelknowhow.com",,,0
		    ])



	
	
	

dumpmenus()