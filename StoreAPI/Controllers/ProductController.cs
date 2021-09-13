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
    public class ProductController : ControllerBase
    {
        private readonly StoreService _storeService;

        public ProductController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<ProductController>
        [HttpGet]
        public ActionResult<List<Product>> Get() => _storeService.GetProducts();

        // GET api/<ProductController>/5
        [HttpGet("{id}")]
        public ActionResult<Product> Get(int id)
        {
            var product = _storeService.GetProduct(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // POST api/<ProductController>
        [HttpPost]
        public ActionResult<Product> Create([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreateProduct(product);
            return Ok(product);
        }

        // PUT api/<ProductController>/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product productIn)
        {
            var product = _storeService.GetProduct(id);
            if (product == null)
            {
                return NotFound();
            }
            _storeService.UpdateProduct(id, productIn);
            return NoContent();
        }

        // DELETE api/<ProductController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _storeService.GetProduct(id);
            if (product == null)
            {
                return NotFound();
            }
            _storeService.RemoveProduct(id);
            return NoContent();
        }
    }
}
