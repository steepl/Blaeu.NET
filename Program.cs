using Blaeu.NET.Controllers.SQL;
using Blaeu.NET.Models.SQL;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add MVC controllers to the container as well.
builder.Services.AddMvcCore().AddControllersAsServices();

builder.Services.AddDbContext<SqlDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.UseNetTopologySuite().EnableRetryOnFailure())
);

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var sqlDbContext = services.GetRequiredService<SqlDbContext>();
    sqlDbContext.Database.EnsureCreated();

    var sqlController = services.GetRequiredService<SqlController>();

    // Seed database if it's empty.
    if (!sqlDbContext.FeatureModels.Any())
    {
        sqlController.DbSeed();
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
