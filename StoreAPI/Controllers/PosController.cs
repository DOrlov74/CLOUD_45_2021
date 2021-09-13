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
    public class PosController : ControllerBase
    {
        private readonly StoreService _storeService;

        public PosController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<PosController>
        [HttpGet]
        public ActionResult<List<Pos>> Get() => _storeService.GetPos();

        // GET api/<PosController>/5
        [HttpGet("{id}")]
        public ActionResult<Pos> Get(int id)
        {
            var pos = _storeService.GetPos(id);
            if (pos == null)
            {
                return NotFound();
            }
            return Ok(pos);
        }

        // POST api/<PosController>
        [HttpPost]
        public ActionResult<Pos> Create([FromBody] Pos pos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreatePos(pos);
            return Ok(pos);
        }

        // PUT api/<PosController>/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Pos posIn)
        {
            var pos = _storeService.GetPos(id);
            if (pos == null)
            {
                return NotFound();
            }
            _storeService.UpdatePos(id, posIn);
            return NoContent();
        }

        // DELETE api/<PosController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var pos = _storeService.GetPos(id);
            if (pos == null)
            {
                return NotFound();
            }
            _storeService.RemovePos(pos);
            return NoContent();
        }
    }
}
