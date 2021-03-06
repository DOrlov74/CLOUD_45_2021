using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreAPI.Models;
using StoreAPI.Services;
//using StorePOS;

namespace StoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly StoreService _storeService;

        public StoreController(StoreService storeService)
        {
            _storeService = storeService;
        }

        [HttpGet]
        public ActionResult<List<Store>> Get() => _storeService.GetStores();

        [HttpGet("{id}", Name = "GetStore")]
        public ActionResult<Store> Get(string id) 
        {
            var store = _storeService.GetStore(id);
            if(store==null)
            {
                return NotFound();
            }
            return Ok(store);
         }

        [HttpPost]
        public ActionResult<Store> Create([FromBody] Store store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            store.CreatedDate = DateTime.Now;
            _storeService.CreateStore(store);
            //return CreatedAtRoute("GetStore", new { id = store.Id.ToString() }, store);
            return Ok(store);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] Store storeIn)
        {
            var store = _storeService.GetStore(id);
            if (store == null)
            {
                return NotFound();
            }
            storeIn.ModifiedDate = DateTime.Now;
            _storeService.UpdateStore(id, storeIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var store = _storeService.GetStore(id);
            if (store == null)
            {
                return NotFound();
            }
            _storeService.RemoveStore(store.Id);
            return NoContent();
        }
    }
}
