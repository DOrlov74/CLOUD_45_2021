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
    public class FamilyController : ControllerBase
    {
        private readonly StoreService _storeService;

        public FamilyController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<FamilyController>
        [HttpGet]
        public ActionResult<List<Family>> Get() => _storeService.GetFamilies();

        // GET api/<FamilyController>/5
        [HttpGet("{id}")]
        public ActionResult<Family> Get(string id)
        {
            var family = _storeService.GetFamily(id);
            if (family == null)
            {
                return NotFound();
            }
            return Ok(family);
        }

        // POST api/<FamilyController>
        [HttpPost]
        public ActionResult<Store> Create([FromBody] Family family)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreateFamily(family);
            return Ok(family);
        }

        // PUT api/<FamilyController>/5
        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] Family familyIn)
        {
            var family = _storeService.GetFamily(id);
            if (family == null)
            {
                return NotFound();
            }
            _storeService.UpdateFamily(id, familyIn);
            return NoContent();
        }

        // DELETE api/<FamilyController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var family = _storeService.GetFamily(id);
            if (family == null)
            {
                return NotFound();
            }
            _storeService.RemoveFamily(id);
            return NoContent();
        }
    }
}
