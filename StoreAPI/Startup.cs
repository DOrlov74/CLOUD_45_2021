using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StoreAPI.Models;
using StoreAPI.Photos;
using StoreAPI.Services;

namespace StoreAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"myAppsettings.json", 
                    optional: true,
                    reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var settings = Configuration.GetSection(nameof(DatabaseSettings)).Get<DatabaseSettings>();
            // requires using Microsoft.Extensions.Options
            services.Configure<DatabaseSettings>(
                Configuration.GetSection(nameof(DatabaseSettings)));
            services.Configure<CollectionNames>(
                Configuration.GetSection(nameof(CollectionNames)));
            services.Configure<CloudinarySettings>(
                Configuration.GetSection(nameof(CloudinarySettings)));

            services.AddSingleton<IDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);

            services.AddSingleton<ICollectionNames>(sp =>
                sp.GetRequiredService<IOptions<CollectionNames>>().Value);

            services.AddSingleton<ICloudinarySettings>(sp =>
                sp.GetRequiredService<IOptions<CloudinarySettings>>().Value);

            services.AddSingleton<StoreService>();
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
                    //WithOrigins("http://localhost:3000");
                });
            });

            services.AddIdentity<User, Role>()
                .AddMongoDbStores<User, Role, Guid>
                (
                    settings.ConnectionString, settings.DatabaseName
                );
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            services.AddScoped<TokenService>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddControllers()
                .AddNewtonsoftJson(options => options.UseMemberCasing());
            //_dbConnectionString = Configuration["DatabaseSettings:ConnectionString"];

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "StoreAPI", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "StoreAPI v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
