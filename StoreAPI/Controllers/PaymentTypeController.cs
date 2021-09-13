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
    public class PaymentTypeController : ControllerBase
    {
        private readonly StoreService _storeService;

        public PaymentTypeController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<PaymentTypeController>
        [HttpGet]
        public ActionResult<List<PaymentType>> Get() => _storeService.GetPaymentTypes();

        // GET api/<PaymentTypeController>/5
        [HttpGet("{id}")]
        public ActionResult<PaymentType> Get(int id)
        {
            var paymentType = _storeService.GetPaymentType(id);
            if (paymentType == null)
            {
                return NotFound();
            }
            return Ok(paymentType);
        }

        // POST api/<PaymentTypeController>
        [HttpPost]
        public ActionResult<PaymentType> Create([FromBody] PaymentType paymentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreatePaymentType(paymentType);
            return Ok(paymentType);
        }

        // PUT api/<PaymentTypeController>/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] PaymentType paymentTypeIn)
        {
            var paymentType = _storeService.GetPaymentType(id);
            if (paymentType == null)
            {
                return NotFound();
            }
            _storeService.UpdatePaymentType(id, paymentTypeIn);
            return NoContent();
        }

        // DELETE api/<PaymentTypeController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var paymentType = _storeService.GetPaymentType(id);
            if (paymentType == null)
            {
                return NotFound();
            }
            _storeService.RemovePaymentType(id);
            return NoContent();
        }
    }
}
