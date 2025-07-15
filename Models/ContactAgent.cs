using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models
{
    public class ContactAgent
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string AgentEmail { get; set; }
        public int AgentId { get; set; }
        public string AgentStatus { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string ContactType { get; set; }
        public int ActiveChats { get; set; }
        public DateTime? MondayIn { get; set; }
        public DateTime? MondayOut { get; set; }
        public DateTime? TuesdayIn { get; set; }
        public DateTime? TuesdayOut { get; set; }
        public DateTime? WednesdayIn { get; set; }
        public DateTime? WednesdayOut { get; set; }
        public DateTime? ThursdayIn { get; set; }
        public DateTime? ThursdayOut { get; set; }
        public DateTime? FridayIn { get; set; }
        public DateTime? FridayOut { get; set; }
        public DateTime? SaturdayIn { get; set; }
        public DateTime? SaturdayOut { get; set; }
        public DateTime? SundayIn { get; set; }
        public DateTime? SundayOut { get; set; }
    }
    public class CheckStatus
    {
        public string email { get; set; }
        public Int32 id { get; set; }
    }
    public class CallCustomer
    {
        public string email { get; set; }
        public string phone { get; set; }
        public string name { get; set; }
    }
    public class Survey
    {
        public bool transcript { get; set; }
        public string politeness { get; set; }
        public string proficiency { get; set; }
        public string resolve { get; set; }
        public string firstTime { get; set; }
        public string rating { get; set; }
        public string comments { get; set; }
        public string contactId { get; set; }
    }
    public class ChatMessage
    {
        public string name { get; set; }
        public string email { get; set; }
        public string message { get; set; }
        public Int32 bookingId { get; set; }
    }
    public class PostSurvey
    {
        public Int64 BookingId { get; set; }
        public string EmailAddress {get; set; }
        public Boolean FindEverything { get; set; }
        public Boolean EasyWebsite { get; set; }
        public Boolean DidYouContactUs { get; set; }
        public Int32 ExperienceScore { get; set; }
        public string Comments { get; set; }
    }
}
