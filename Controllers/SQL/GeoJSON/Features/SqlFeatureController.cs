using Blaeu.NET.Models.SQL;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NetTopologySuite.IO;
using Microsoft.EntityFrameworkCore;
using Blaeu.NET.Models.SQL.GeoJSON.Features;
using System.Net.Mime;

namespace Blaeu.NET.Controllers.SQL.GeoJSON.Features
{
    /***
     * controller used for storing/retrieving GeoJSON feature data from the database
     * class uses NetTopologySuite IO package to transform geometrical objects between GeoJSON and NTS
     */
    public class SqlFeatureController : Controller
    {
        private readonly SqlDbContext sqlDbContext;
        
        // receive db context from service container
        public SqlFeatureController(SqlDbContext sqlDbContext)
        {
            this.sqlDbContext = sqlDbContext;
        }

        private readonly JsonSerializer serializer = GeoJsonSerializer.Create();

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Produces(MediaTypeNames.Application.Json)]
        public IActionResult GetAllFeaturesFromDatabase()
        {
            try
            {
                SqlFeatureCollection sqlFeatureCollection = new();

                SqlFeatureModel[] featureModels = sqlDbContext.FeatureModels.Include(m => m.Properties).ToArray();
                sqlFeatureCollection.Features = featureModels;

                string geoJson;
                // create disposible text writers
                using (var stringWriter = new StringWriter())
                using (var jsonWriter = new JsonTextWriter(stringWriter))
                {
                    serializer.Serialize(jsonWriter, sqlFeatureCollection);
                    geoJson = stringWriter.ToString();
                }

                return CreatedAtAction("GetAllFeaturesFromDatabase", geoJson);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error thrown while storing data: '{0}'", e);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}