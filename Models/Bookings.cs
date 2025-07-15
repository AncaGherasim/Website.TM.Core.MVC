using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models
{
    public class BookingService
    {
        public Int32 Id { get; set; }
        public string Name { get; set; }
        public string Rating { get; set; }
    }

    public class BookingTest
    {
        public string Agency { get; set; }
        public string Txt1 { get; set; }
        public string Dept { get; set; }
    }

    public class BookingSurvey
    {
        public Int64 BookingId { get; set; }
        public string EmailAddress { get; set; }
        public Int32 RSV_Active { get; set; }
    }
    public class PostBookingSurvey
    {
        public Int32 CAPSID { get; set; }
        public Int32 CAPS_Active { get; set; }
        public Int32 CAPS_BookingID { get; set; }
        public string CAPS_EmailAddress { get; set; }
        public DateTime CAPS_SurveyReceived { get; set; }  
        public Int16 CAPS_FindEverything { get; set; }
        public Int16 CAPS_EasyWebsite { get; set; }
        public Int16 CAPS_DidYouContactUs { get; set; }
        public Int16 CAPS_ExperienceScore { get; set; }
        public string CAPS_Comment { get; set; }
    }

    public class CustomerComment_Prepublished
    {
        public Decimal ID { get; set; }
        public Decimal BookingID { get; set; }
        public string EmailAddress { get; set; }
        public string CustomerComment { get; set; }
        public Int32 OverallScore { get; set; }
        public Boolean UseUsAgain { get; set; }
        public Int32 CustomerServiceScore { get; set; }
        public Int32 WSandBPScore { get; set; }
        public Int32 FlightsScore { get; set; }
        public Int32 HotelsScore { get; set; }
        public Int32 TransfersScore { get; set; }
        public Int32 ActivitiesScore { get; set; }
        public Int32 CarRentalScore { get; set; }
        public Int32 TrainsScore { get; set; }
        public Int32 FerriesScore { get; set; }
        public Boolean FeedbackProcessed { get; set; }
        public Boolean FeedbackReceived { get; set; }
    }

    public class CheckBookingParams
    {
        public string bookingId { get; set; }
        public string email { get; set; }
    }

    public class ReviewCenterParams
    {
        public string userBooking { get; set; }
        public string userEmail { get; set; }
        public string userRate { get; set; }
        public string userUsing { get; set; }
        public string userReview { get; set; }
        public string serviceScore { get; set; }
        public string sitebpScore { get; set; }
        public string flightScore { get; set; }
        public string hotelScore { get; set; }
        public string transferScore { get; set; }
        public string ssScore { get; set; }
        public string carrentalScore { get; set; }
        public string trainScore { get; set; }
        public string ferryScore { get; set; }

    }
}
