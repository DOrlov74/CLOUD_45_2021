using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
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
        //[Authorize(Roles = "Admin")]
        public ActionResult<List<User>> Get()
        {
            //return _storeService.GetUsers();
            var header = Request.Headers[HeaderNames.Authorization].ToString();
            string[] accessToken = header.Split(' ');
            var user = _storeService.GetUserByToken(accessToken[1]);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("{id}", Name = "GetUser")]
        //[Authorize(Roles = "Admin")]
        public ActionResult<User> Get(string id)
        {
            Guid gId = Guid.Parse(id);
            var user = _storeService.GetUser(gId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("role")]
        public ActionResult<List<Role>> GetRoles()
        {
            return _storeService.GetRoles();
        }

        [HttpGet("role/{id}", Name = "GetRole")]
        //[Authorize(Roles = "Admin")]
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
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRole([FromBody] Role role)
        {
            if (ModelState.IsValid)
            {
                IdentityResult result = await _roleManager.CreateAsync(new Role() { Name = role.Name });
                if (result.Succeeded)
                {
                    return Ok(role);
                }
            }
            return BadRequest();
        }

        [HttpPost("role/{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRole(string id, [FromBody] Role role)
        {
            if (ModelState.IsValid)
            {
                Guid gId = Guid.Parse(id);
                var user = _storeService.GetUser(gId);
                if (user == null)
                {
                    return NotFound();
                }
                if (user.Roles.Find(r => r == role.Id) != Guid.Empty)
                {
                    return BadRequest();
                }
                user = _storeService.AddRole(user.Id, role );
                if (user.Roles.Find(r => r == role.Id) != Guid.Empty)
                {
                    return Ok(user);
                }
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] User userIn)
        {
            Guid gId = Guid.Parse(id);
            var user = _storeService.GetUser(gId);
            if (user == null)
            {
                return NotFound();
            }
            _storeService.UpdateUser(gId, userIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            Guid gId = Guid.Parse(id);
            var user = _storeService.GetUser(gId);
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
