using coding_challenge.DAL;
using coding_challenge.Models;
using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                      });
});
// Add services to the container.
builder.Services.AddDbContext<OrderContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MyDbContext")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddDbContext<OrderContext>(opt =>
//     opt.UseInMemoryDatabase("Orders"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
