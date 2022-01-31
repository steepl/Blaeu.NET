using NetTopologySuite.Geometries;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blaeu.NET.Models.SQL.GeoJSON.Features
{
    /***
     * EF code-first model used for storing GeoJSON feature data in SQL Server
     * class uses NetTopologySuite Geometry data type to storing feature geometry
     * feature properties are stored using FeaturePropertiesModel (FK relationship)
     */ 
    public class SqlFeatureModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int Id { get; set; }

        [JsonRequired]
        public readonly string type = "Feature";

        [Required]
        [JsonRequired]
        [JsonProperty("geometry")]
        public Geometry Geometry { get; set; }

        [ForeignKey("FeatureId")]
        [JsonRequired]
        [JsonProperty("properties")]
        public SqlFeaturePropertiesModel Properties { get; set; }
    }
}
