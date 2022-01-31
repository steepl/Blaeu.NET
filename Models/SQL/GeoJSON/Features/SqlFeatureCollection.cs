using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blaeu.NET.Models.SQL.GeoJSON.Features
{
    /***
     * class used for parsing GeoJSON feature collection data
     * class is makerd as "not mapped", meaning it should not be stored in the database
     * use FeatureModel class to store actual data
     */
    [NotMapped]
    public class SqlFeatureCollection
    {
        [JsonRequired]
        public readonly string type = "FeatureCollection";

        [JsonRequired]
        [JsonProperty("features")]
        public SqlFeatureModel[] Features { get; set; }
    }
}
