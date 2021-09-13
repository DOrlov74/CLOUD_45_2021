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
    public class SalesDetailController : ControllerBase
    {
        private readonly StoreService _storeService;

        public SalesDetailController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<SalesDetailController>
        [HttpGet]
        public ActionResult<List<SalesDetail>> Get() => _storeService.GetSalesDetails();

        // GET api/<SalesDetailController>/5
        [HttpGet("{id}")]
        public ActionResult<Store> Get(int id)
        {
            var salesDetail = _storeService.GetSalesDetail(id);
            if (salesDetail == null)
            {
                return NotFound();
            }
            return Ok(salesDetail);
        }

        // POST api/<SalesDetailController>
        [HttpPost]
        public ActionResult<Store> Create([FromBody] SalesDetail salesDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreateSalesDetail(salesDetail);
            return Ok(salesDetail);
        }

        // PUT api/<SalesDetailController>/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] SalesDetail salesDetailIn)
        {
            var salesDetail = _storeService.GetSalesDetail(id);
            if (salesDetail == null)
            {
                return NotFound();
            }
            _storeService.UpdateSalesDetail(id, salesDetailIn);
            return NoContent();
        }

        // DELETE api/<SalesDetailController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var salesDetail = _storeService.GetSalesDetail(id);
            if (salesDetail == null)
            {
                return NotFound();
            }
            _storeService.RemoveSalesDetail(id);
            return NoContent();
        }
    }
}
