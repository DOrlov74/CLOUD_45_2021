using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StoreAPI.Models;
using StoreAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly StoreService _storeService;

        public UserController(UserManager<User> userManager, RoleManager<Role> roleManager, StoreService storeService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _storeService = storeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public ActionResult<List<User>> Get()
        {
            return _storeService.GetUsers();
        }

        [HttpGet("{id}", Name = "GetUser")]
        [Authorize(Roles = "Admin")]
        public ActionResult<User> Get(Guid id)
        {
            var user = _storeService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("role/{id}", Name = "GetRole")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Role>> GetRoleAsync(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                User appUser = new User
                {
                    UserName = user.UserName,
                    Email = user.Email
                };
                IdentityResult result = await _userManager.CreateAsync(appUser, user.Password);

                //Add role
                await _userManager.AddToRoleAsync(appUser, "Admin");

                if (result.Succeeded)
                {
                    return Ok(user);
                } 
            }
            return BadRequest();
        }

        [HttpPost("role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRole([FromBody] Role role)
        {
            if (ModelState.IsValid)
            {
                IdentityResult result = await _roleManager.CreateAsync(new Role() { Name = role.RoleName });
                if (result.Succeeded)
                {
                    return Ok(role);
                }
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] User userIn)
        {
            var user = _storeService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            _storeService.UpdateUser(id, userIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var user = _storeService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            _storeService.RemoveUser(user.Id);
            return NoContent();
        }

        [HttpDelete("role/{id}")]
        public async Task<IActionResult> DeleteRoleAsync(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            await _roleManager.DeleteAsync(role);
            return NoContent();
        }
    }
}
