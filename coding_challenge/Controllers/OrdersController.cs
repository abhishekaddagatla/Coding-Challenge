using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using coding_challenge.Models;
using System.Numerics;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Azure.Identity;
using coding_challenge.DAL;

namespace coding_challenge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository orderRepository;

        public OrdersController(OrderContext context, IOrderRepository orderRepository)
        {
            this.orderRepository = orderRepository;
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
            return Ok(newOrder);
        }

        // POST: api/HandleOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(int type, string customerName, string username)
        {
            if (type < 0 || type > 4)
            {
                return BadRequest();
            }
            Guid guid = Guid.NewGuid();
            OrderType orderType = (OrderType)type;
            DateTime createdDate = DateTime.Now;
            string createdByUsername = username;

            Order order = new Order(guid, orderType, customerName, createdDate, createdByUsername);

            orderRepository.InsertOrderAsync(order);
            orderRepository.Save();

            return CreatedAtAction("GetOrders", new { id = order.Id }, order);
        }

        [HttpGet("ByType/{type}")]
        public async Task<ActionResult<IEnumerable<Order>>> ByType(OrderType type)
        {
            return await orderRepository.GetOrdersByTaskAsync(type);
        }

        [HttpPost("Delete/{ids}")]
        public async Task<IActionResult> Delete(string ids)
        {
            var idArray = ids.Split(',');
            foreach (string stringId in idArray)
            {
                if (Guid.TryParse(stringId, out Guid id))
                {
                    if (!orderRepository.OrderExists(id))
                    {
                        continue;
                    }

                    await orderRepository.DeleteOrderAsync(id);
                    orderRepository.Save();
                }
                else
                {
                    return BadRequest($"Invalid ID format: {stringId}");
                }
            }

            return NoContent();
        }

        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<Order>>> Filter(string? customerQuery = null, OrderType? type = null)
        {
            if (customerQuery == null && type == null)
            {
                return await GetOrders();
            }
            else if (customerQuery != null && type == null)
            {
                return await SearchOrders(customerQuery);
            }
            else if (customerQuery == null && type != null)
            {
                return await ByType((OrderType)type);
            }
            else
            {
                return await orderRepository.FilterOrdersAsync(customerQuery, (OrderType)type);
            }
        }
    }
}
