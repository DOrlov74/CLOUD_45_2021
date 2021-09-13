using Microsoft.AspNetCore.Mvc;
using StoreAPI.Models;
using StoreAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly StoreService _storeService;

        public StockController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<StockController>
        [HttpGet]
        public ActionResult<List<Stock>> Get() => _storeService.GetStocks();

        // GET api/<StockController>/5
        [HttpGet("{id}")]
        public ActionResult<Stock> Get(int id)
        {
            var stock = _storeService.GetStock(id);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock);
        }

        // POST api/<StockController>
        [HttpPost]
        public ActionResult<Stock> Create([FromBody] Stock stock)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreateStock(stock);
            return Ok(stock);
        }

        // PUT api/<StockController>/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Stock stockIn)
        {
            var stock = _storeService.GetStock(id);
            if (stock == null)
            {
                return NotFound();
            }
            _storeService.UpdateStock(id, stockIn);
            return NoContent();
        }

        // DELETE api/<StockController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var stock = _storeService.GetStock(id);
            if (stock == null)
            {
                return NotFound();
            }
            _storeService.RemoveStock(id);
            return NoContent();
        }
    }
}
