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

        public OrderRepository(OrderContext context)
        {
            this.context = context;
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
            int page = 1,
            int pageSize = 10)
        {
            IQueryable<Order> query = context.Orders;

            // Apply filters
            if (customerQuery != null)
            {
                query = query.Where(o => o.CustomerName.Contains(customerQuery));
            }
            if (type != null)
            {
                query = query.Where(o => o.Type == type);
            }

            // Get the total count of items before applying pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var orders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (orders, totalCount);
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