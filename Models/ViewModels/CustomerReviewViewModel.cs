using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class CustomerReviewViewModel
    {
        public List<Models.BookingTest> bookingTest = new List<BookingTest>();
        public List<BookingService> bookServices = new List<BookingService>();
        public List<CustomerComment_Prepublished> bookReview = new List<CustomerComment_Prepublished>();
        public List<int> srvToDelete = new List<int>();
        public List<BookingService> services = new List<BookingService>();
        public bool feedReceived = false;
        public bool feedProcessed = false;
        public string clientName;
        public Int32 bookingId;
        public string email;
        public Int32 rate;
    }
}
