using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Application.MappingProfiles;
using AuthenticationJWT.Application.Services;
using AuthenticationJWT.Application.Validators;
using AuthenticationJWT.Infrastructure.Data;
using AuthenticationJWT.Infrastructure.Repositories;
using AuthenticationJWT.Presentation.Hubs;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR(); // Ajout de SignalR pour les WebSockets (chat en temps réel multi-usager)
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
builder.Services.AddScoped<IChatRoomService, ChatRoomService>();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<ProductMappingProfile>());
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<ChatRoomMappingProfile>());
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<UserMappingProfile>());
builder.Services.AddValidatorsFromAssemblyContaining<RegisterDTOValidator>();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//source: https://antondevtips.com/blog/authentication-and-authorization-best-practices-in-aspnetcore
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!))
    };
});

//Ajout de cors pour autoriser les requetes depuis le frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Url de mon front end!!
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // REQUIS pour les websockets (SignalR) sinon on aura une erreur de type "Access-Control-Allow-Origin" dans la console du navigateur
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AngularPolicy"); // Utilisation de la politique CORS
app.MapHub<ChatHub>("/chathub"); // Mapping du Hub SignalR pour les WebSockets. L'URL utilisée dans startConnection() d'Angular
app.UseAuthentication(); // Important de mettre avant Authorization
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles(); // Pour pouvoir recuperer image dans le frontend

app.Run();

