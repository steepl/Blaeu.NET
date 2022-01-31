using Microsoft.EntityFrameworkCore;
using Blaeu.NET.Models.SQL.GeoJSON.Features;

namespace Blaeu.NET.Models.SQL
{
    /***
     * EF class used for connecting to SQL Server and store/retrieve data using DbSet objects
     * class is managed by .NET service container (see Program.cs), connection string is set in appsettings
     */
    public class SqlDbContext : DbContext
    {
        public DbSet<SqlFeatureModel> FeatureModels { get; set; }
        public DbSet<SqlFeaturePropertiesModel> FeaturePropertiesModels { get; set; }
        public SqlDbContext(DbContextOptions<SqlDbContext> options) : base(options) { }
    }
}
