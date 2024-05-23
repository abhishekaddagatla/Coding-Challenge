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

namespace coding_challenge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrderContext _context;

        public OrdersController(OrderContext context)
        {
            _context = context;
        }

        // GET: api/HandleOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        [HttpGet("SearchOrders/{id}")]
        public async Task<ActionResult<IEnumerable<Order>>> SearchOrders(string id)
        {
            return await _context.Orders.Where(e => e.Id.Equals(Guid.Parse(id))).ToListAsync();
        }

        // PUT: api/HandleOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutOrder(Guid id, int type, string customerName, string username)
        {
            var order = _context.Orders.FirstOrDefault(e => e.Id.Equals(id));

            if (order == null)
            {
                return NotFound();
            }

            order.Type = (OrderType)type;
            order.CustomerName = customerName;
            order.CreatedByUsername = username;

            await _context.SaveChangesAsync();
            return Ok(order);
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

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrders", new { id = order.Id }, order);
        }

        [HttpGet("ByType/{type}")]
        public async Task<ActionResult<IEnumerable<Order>>> ByType(OrderType type)
        {
            return await _context.Orders.Where(x => x.Type == type).ToListAsync();
        }

        [HttpPost("Delete/{ids}")]
        public async Task<IActionResult> Delete(string ids)
        {
            var idArray = ids.Split(',');
            foreach (string stringId in idArray)
            {
                if (Guid.TryParse(stringId, out Guid id))
                {
                    if (!OrderExists(id))
                    {
                        continue;
                    }

                    Order deletingOrder = await _context.Orders.FirstOrDefaultAsync(e => e.Id == id);
                    if (deletingOrder != null)
                    {
                        _context.Orders.Remove(deletingOrder);
                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    return BadRequest($"Invalid ID format: {stringId}");
                }
            }

            return NoContent();
        }


        private bool OrderExists(Guid id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
