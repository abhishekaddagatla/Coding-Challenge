using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using coding_challenge.Models;
using Microsoft.EntityFrameworkCore;

namespace coding_challenge.DAL
{
    public class OrderRepository : IOrderRepository, IDisposable
    {
        private OrderContext context;
        private readonly ILogger<OrderRepository> logger;

        public OrderRepository(OrderContext context, ILogger<OrderRepository> logger)
        {
            this.context = context;
            this.logger = logger;
        }

        // implementing IOrderRepository

        public bool OrderExists(Guid id)
        {
            return context.Orders.Any(e => e.Id == id);
        }

        public async Task<Order> DeleteOrderAsync(Guid orderId)
        {
            Order order = await context.Orders.FindAsync(orderId);
            context.Orders.Remove(order);
            return order;
        }

        public Order GetOrderById(Guid orderId)
        {
            return context.Orders.Find(orderId);
        }

        public async Task<List<Order>> GetOrdersAsync()
        {
            var orders = await context.Orders.ToListAsync();
            return orders;
        }

        public async Task<List<Order>> GetOrdersByTaskAsync(OrderType type)
        {
            return await context.Orders.Where(x => x.Type == type).ToListAsync();
        }


        public async Task<List<Order>> SearchOrdersAsync(string customerQuery)
        {
            return await context.Orders.Where(e => e.CustomerName.Contains(customerQuery)).ToListAsync();
        }

        public async void InsertOrderAsync(Order order)
        {
            await context.Orders.AddAsync(order);
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public async void UpdateOrder(Order order)
        {
            // Get the existing entity from the database
            var existingOrder = await context.Orders.FindAsync(order.Id);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            // Update the properties of the existing entity with the values from the updated entity
            context.Entry(existingOrder).CurrentValues.SetValues(order);
        }

        public async Task<(IEnumerable<Order> Orders, int totalCount)> FilterOrdersAsync(
        string? customerQuery = null,
        OrderType? type = null,
        string? startDate = null,
        string? endDate = null,
        int page = 1,
        int pageSize = 10)
        {
            try
            {
                var query = context.Orders.AsQueryable();

                if (startDate != null && endDate != null)
                {
                    DateTime start = DateTime.Parse(startDate);
                    DateTime end = DateTime.Parse(endDate);
                    query = query.Where(o => o.CreatedDate >= start && o.CreatedDate <= end);
                }

                if (!string.IsNullOrEmpty(customerQuery))
                {
                    query = query.Where(o => o.CustomerName.Contains(customerQuery));
                }

                if (type.HasValue)
                {
                    query = query.Where(o => o.Type == type.Value);
                }

                var totalCount = await query.CountAsync();

                var orders = await query
                    .OrderByDescending(o => o.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (orders, totalCount);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while filtering orders");
                throw;
            }
        }


        // implementing IDisposable

        private bool disposed = false;

        public void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}