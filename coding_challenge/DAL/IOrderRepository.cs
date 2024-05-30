using System;
using System.Collections.Generic;
using coding_challenge.Models;

namespace coding_challenge.DAL
{
    public interface IOrderRepository : IDisposable
    {
        Task<List<Order>> GetOrdersAsync();
        Task<List<Order>> GetOrdersByTaskAsync(OrderType type);
        Task<List<Order>> SearchOrdersAsync(string customerQuery);
        Task<(IEnumerable<Order> Orders, int totalCount)> FilterOrdersAsync(string? customerQuery, OrderType? type, int page, int pageSize);
        Order GetOrderById(Guid orderId);
        void InsertOrderAsync(Order order);
        Task<Order> DeleteOrderAsync(Guid orderId);
        void UpdateOrder(Order order);
        bool OrderExists(Guid id);
        void Save();
    }
}