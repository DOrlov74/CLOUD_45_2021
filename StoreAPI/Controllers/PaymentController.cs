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
    public class PaymentController : ControllerBase
    {
        private readonly StoreService _storeService;

        public PaymentController(StoreService storeService)
        {
            _storeService = storeService;
        }
        // GET: api/<PaymentController>
        [HttpGet]
        public ActionResult<List<Payment>> Get() => _storeService.GetPayments();

        // GET api/<PaymentController>/5
        [HttpGet("{id}")]
        public ActionResult<Payment> Get(int id)
        {
            var payment = _storeService.GetPayment(id);
            if (payment == null)
            {
                return NotFound();
            }
            return Ok(payment);
        }

        // POST api/<PaymentController>
        [HttpPost]
        public ActionResult<Payment> Create([FromBody] Payment payment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreatePayment(payment);
            return Ok(payment);
        }

        // PUT api/<PaymentController>/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Payment paymentIn)
        {
            var payment = _storeService.GetPayment(id);
            if (payment == null)
            {
                return NotFound();
            }
            _storeService.UpdatePayment(id, paymentIn);
            return NoContent();
        }

        // DELETE api/<PaymentController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var payment = _storeService.GetPayment(id);
            if (payment == null)
            {
                return NotFound();
            }
            _storeService.RemovePayment(id);
            return NoContent();
        }
    }
}
