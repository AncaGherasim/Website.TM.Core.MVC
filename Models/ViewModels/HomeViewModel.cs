using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TM.Models;

namespace MVC_TM.Models.ViewModels
{
    public class HomeViewModel
    {
        public List<allDestinations> TMCty = new List<allDestinations>();
        public List<MostPopItineraries> managerPop = new List<MostPopItineraries>();
        public List<FeatItins> managerItineraries = new List<FeatItins>();
        public List<FeatItins> TMSeq2 = new List<FeatItins>();
        public List<FeatItins> TMEDitin = new List<FeatItins>();
        public List<FeatItins> TMLDitin = new List<FeatItins>();
        public List<FeatItins> TMASitin = new List<FeatItins>();
        public List<FeatItins> TMStarted = new List<FeatItins>();
        public List<FeatItins> TMPop = new List<FeatItins>();
        public List<string> TMDest = new List<string>();
        public List<SpotLight> TMSpot = new List<SpotLight>();
        public List<FeatItins> objAllItineraries = new List<FeatItins>();
        public List<NoteWorthy> TMNoteWorthy = new List<NoteWorthy>();

        public Int32 NumComments;
        public decimal Score;
        public List<CustCommentsUserId> listReviews = new List<CustCommentsUserId>();
        public List<SpotLight> listSpotLights = new List<SpotLight>();
        public Dictionary<string, string> ctyDictionary = new Dictionary<string, string>();
        public List<ExploreDest> listexploreDest = new List<ExploreDest>();
        public List<Highlights> listHighlights = new List<Highlights>();
        public List<string> spotLightBann;
        public List<string> spotLightCities;
        
    }
}
