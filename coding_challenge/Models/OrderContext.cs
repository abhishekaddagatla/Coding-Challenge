using Microsoft.EntityFrameworkCore;
namespace coding_challenge.Models;

public class OrderContext : DbContext
{
    public OrderContext(DbContextOptions<OrderContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Orders { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Provide a default connection string for development purposes
            optionsBuilder.UseSqlServer("MyDbContext");
        }
    }
}