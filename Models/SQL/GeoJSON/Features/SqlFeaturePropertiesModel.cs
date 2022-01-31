using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blaeu.NET.Models.SQL.GeoJSON.Features
{
    /***
     * EF code-first model used for storing GeoJSON feature properties in SQL Server
     * class properties should match feature properties in order to work
     */
    public class SqlFeaturePropertiesModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int FeatureId { get; set; }

        [Required]
        [JsonIgnore]
        public SqlFeatureModel FeatureModel { get; set; }

        public string? Layer { get; set; }

        public string? Description { get; set; }
    }
}
