using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using coding_challenge.Models;
using System.Numerics;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Azure.Identity;
using coding_challenge.DAL;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Authorization;

namespace coding_challenge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository orderRepository;
        private readonly ILogger<OrdersController> logger;
        public OrdersController(IOrderRepository orderRepository, ILogger<OrdersController> logger)
        {
            this.orderRepository = orderRepository;
            this.logger = logger;
        }

        // GET: api/HandleOrders

        [HttpGet]
        public async Task<List<Order>> GetOrders()
        {
            return await orderRepository.GetOrdersAsync();
        }

        [HttpGet("SearchOrders/{customerQuery}")]
        public async Task<ActionResult<IEnumerable<Order>>> SearchOrders(string customerQuery)
        {
            return await orderRepository.SearchOrdersAsync(customerQuery);
        }

        // PUT: api/HandleOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> PutOrder(Guid id, int type, string customerName, string username)
        {
            var order = orderRepository.GetOrderById(id);
            if (order == null)
            {
                return NotFound();
            }

            Order newOrder = new Order(id, (OrderType)type, customerName, order.CreatedDate, username);
            orderRepository.UpdateOrder(newOrder);
            orderRepository.Save();

            Debug.Assert(orderRepository.GetOrderById(id).Type == (OrderType)type && orderRepository.GetOrderById(id).CustomerName == customerName);

            return Ok(newOrder);
        }

        public class NewOrderRequest
        {
            public int Type { get; set; }
            public string CustomerName { get; set; }
            public string Username { get; set; }
        }

        // POST: api/HandleOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder([FromBody] NewOrderRequest newOrder)
        {
            if (newOrder.Type < 0 || newOrder.Type > 4)
            {
                return BadRequest();
            }
            Guid guid = Guid.NewGuid();
            OrderType orderType = (OrderType)newOrder.Type;
            DateTime createdDate = DateTime.Now;
            string createdByUsername = newOrder.Username;

            Order order = new Order(guid, orderType, newOrder.CustomerName, createdDate, createdByUsername);

            orderRepository.InsertOrderAsync(order);
            orderRepository.Save();

            Debug.Assert(orderRepository.OrderExists(guid));

            return CreatedAtAction("GetOrders", new { id = order.Id }, order);
        }

        [HttpGet("ByType/{type}")]
        public async Task<ActionResult<IEnumerable<Order>>> ByType(OrderType type)
        {
            var OrdersByType = await orderRepository.GetOrdersByTaskAsync(type);
            Debug.Assert(OrdersByType.All(o => o.Type == type));
            return OrdersByType;
        }

        public class DeleteRequest
        {
            public List<string> Ids { get; set; }
        }

        [Authorize]
        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteRequest request)
        {
            var ids = request.Ids;
            Console.WriteLine(ids);
            foreach (string stringId in ids)
            {
                if (Guid.TryParse(stringId, out Guid id))
                {
                    if (!orderRepository.OrderExists(id))
                    {
                        continue;
                    }

                    await orderRepository.DeleteOrderAsync(id);
                    orderRepository.Save();
                    Debug.Assert(orderRepository.OrderExists(id) == false);
                }
                else
                {
                    return BadRequest($"Invalid ID format: {stringId}");
                }
            }

            return NoContent();
        }

        [Authorize]
        [HttpGet("Filter")]
        public async Task<ActionResult> Filter(
        string? customerQuery = null,
        OrderType? type = null,
        string? startDate = null,
        string? endDate = null,
        int page = 1,
        int pageSize = 10)
        {
            try
            {
                var (orders, totalCount) = await orderRepository.FilterOrdersAsync(customerQuery, type, startDate, endDate, page, pageSize);

                var response = new
                {
                    TotalCount = totalCount,
                    Orders = orders
                };
                Debug.Assert(response.Orders.Count() <= pageSize && response.Orders.Count() <= response.TotalCount && response.Orders.Count() >= 0);

                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while filtering orders");
                return StatusCode(500, "Internal server error");
            }
        }


    }
}
