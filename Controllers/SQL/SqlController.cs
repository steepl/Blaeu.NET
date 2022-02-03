using Blaeu.NET.Controllers.SQL.GeoJSON.Features;
using Microsoft.AspNetCore.Mvc;

namespace Blaeu.NET.Controllers.SQL
{
    public class SqlController : Controller
    {
        private readonly SqlFeatureController sqlFeatureController;
        private readonly IWebHostEnvironment webHostEnvironment;

        // receive constructor parameters from service container
        public SqlController(SqlFeatureController sqlFeatureController, IWebHostEnvironment webHostEnvironment)
        {
            this.sqlFeatureController = sqlFeatureController;
            this.webHostEnvironment = webHostEnvironment;
        }

        public void DbSeed()
        {
            var json = "";
            // use feature controller to store data from Features.json in database
            using (var streamReader = new StreamReader(webHostEnvironment.ContentRootPath + "/Data/Features.json"))
            {
                json = streamReader.ReadToEnd();
            }
            sqlFeatureController.SaveFeaturesToDatabase(json);
            Console.WriteLine("Seeded database");
        }
    }
}