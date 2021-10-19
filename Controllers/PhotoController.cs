using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StoreAPI.Models;
using StoreAPI.Photos;
using StoreAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly StoreService _storeService;
        private readonly IPhotoAccessor _photoAccessor;

        public PhotoController(UserManager<User> userManager, StoreService storeService, IPhotoAccessor photoAccessor)
        {
            _userManager = userManager;
            _storeService = storeService;
            _photoAccessor = photoAccessor;
        }

        // POST api/<PhotoController>
        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromForm] IFormFile file)
        {
            //var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            //if (user == null) return null;
            var result = await _photoAccessor.AddPhoto(file);
            //var photo = new Photo
            //{
            //    Url = photoUploadResult.Url,
            //    Id = photoUploadResult.PublicId,
            //    UserId = user.Id
            //};
            //var result =_storeService.CreatePhoto(photo);
            if (result != null) return Ok(result);
            return BadRequest();
        }

        // DELETE api/<PhotoController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(string id)
        {
            var photo = _storeService.GetPhoto(id);
            if (photo == null)
            {
                return NotFound();
            }
            _storeService.RemovePhoto(photo.Id);
            var result = await _photoAccessor.DeletePhoto(id);
            if (result == null) return BadRequest("Problem deleting photo from the service");
            return NoContent();
        }
        // GET: api/<PhotoController>
        [HttpGet]
        public ActionResult<List<Photo>> Get() => _storeService.GetPhotos();

        // GET api/<PhotoController>/5
        [HttpGet("{id}")]
        public ActionResult<Photo> Get(string id)
        {
            var photo = _storeService.GetPhoto(id);
            if (photo == null)
            {
                return NotFound();
            }
            return Ok(photo);
        }

        // POST api/<PhotoController>
        [HttpPost]
        public ActionResult<Photo> Create([FromBody] Photo photo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _storeService.CreatePhoto(photo);
            return Ok(photo);
        }

        // PUT api/<PhotoController>/5
        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] Photo photoIn)
        {
            var photo = _storeService.GetPhoto(id);
            if (photo == null)
            {
                return NotFound();
            }
            _storeService.UpdatePhoto(id, photoIn);
            return NoContent();
        }
    }
}
