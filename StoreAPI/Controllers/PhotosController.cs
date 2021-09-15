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
    public class PhotosController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly StoreService _storeService;
        private readonly IPhotoAccessor _photoAccessor;

        public PhotosController(UserManager<User> userManager, StoreService storeService, IPhotoAccessor photoAccessor)
        {
            _userManager = userManager;
            _storeService = storeService;
            _photoAccessor = photoAccessor;
        }

        // POST api/<PhotosController>
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] IFormFile file)
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return null;
            var photoUploadResult = await _photoAccessor.AddPhoto(file);
            var photo = new Photo
            {
                Url = photoUploadResult.Url,
                Id = photoUploadResult.PublicId,
                UserId = user.Id
            };
            var result =_storeService.CreatePhoto(photo);
            if (result != null) return Ok(photo);
            return BadRequest();
        }

        // DELETE api/<PhotosController>/5
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
    }
}
