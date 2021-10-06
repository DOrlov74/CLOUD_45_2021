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
    public class SaleController : ControllerBase
    {
        private readonly StoreService _storeService;

        public SaleController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<SaleController>
        [HttpGet]
        public ActionResult<List<Sale>> Get() => _storeService.GetSales();

        // GET api/<SaleController>/5
        [HttpGet("{id}")]
        public ActionResult<Sale> Get(string id)
        {
            var sale = _storeService.GetSale(id);
            if (sale == null)
            {
                return NotFound();
            }
            return Ok(sale);
        }

        // POST api/<SaleController>
        [HttpPost]
        public ActionResult<Sale> Create([FromBody] Sale sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreateSale(sale);
            return Ok(sale);
        }

        // PUT api/<SaleController>/5
        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] Sale saleIn)
        {
            var sale = _storeService.GetSale(id);
            if (sale == null)
            {
                return NotFound();
            }
            _storeService.UpdateSale(id, saleIn);
            return NoContent();
        }

        // DELETE api/<SaleController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var sale = _storeService.GetSale(id);
            if (sale == null)
            {
                return NotFound();
            }
            _storeService.RemoveSale(id);
            return NoContent();
        }
    }
}
