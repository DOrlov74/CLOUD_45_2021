using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
using StoreAPI.Models;
using StoreAPI.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StoreAPI.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult AccessDenied()
        {
            return View();
        }

        [HttpGet("currentuser")]
        [Authorize]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return user;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]User user)
        {
            User appUser = await _userManager.FindByEmailAsync(user.Email);
            if (appUser == null)
            {
                return Unauthorized();
            }
            Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.PasswordSignInAsync(appUser, user.Password, false, false);
            if (result.Succeeded)
            {
                appUser.Token = _tokenService.CreateToken(appUser);
                var updateResult = await _userManager.UpdateAsync(appUser);
                if (updateResult.Succeeded)
                {
                    return Ok(appUser);
                }
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        { 
            if (_userManager.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest("Email is taken");
            }
            if (_userManager.Users.Any(u => u.UserName == user.UserName))
            {
                return BadRequest("Name is taken");
            }
            var appUser = new User
            {
                UserName = user.UserName,
                Email = user.Email
            };
            var result = await _userManager.CreateAsync(appUser, user.Password); 
            if (result.Succeeded)
            {
                var token = _tokenService.CreateToken(appUser);
                appUser.Token = token;
                result = await _userManager.UpdateAsync(appUser);
                if (result.Succeeded)
                {
                    return appUser;
                }
            }
            return BadRequest("Problem with registering user");
        }

        [HttpGet("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
    }
}
