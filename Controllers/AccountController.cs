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
    [Route("api")]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;
        private readonly StoreService _storeService;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService, StoreService storeService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _storeService = storeService;
        }
        //public IActionResult Login()
        //{
        //    return View();
        //}

        //public IActionResult AccessDenied()
        //{
        //    return View();
        //}

        [HttpGet("account")]
        //[Authorize]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            if (User.FindFirstValue(ClaimTypes.Email) == null) 
            {
                return NotFound();
            }
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return Ok(user);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]User user)
        {
            User appUser = _storeService.GetUserByEmail(user.Email);
            //User appUser = await _userManager.FindByEmailAsync(user.Email);
            if (appUser == null)
            {
                return Unauthorized();
            }
            var result = appUser.UserName == user.UserName && appUser.Password == user.Password;
            //Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.PasswordSignInAsync(appUser, user.Password, false, false);
            //if (result.Succeeded)
            if(result)
            {
                var token = _tokenService.CreateToken(appUser);
                appUser.Token = token;
                //var updateResult = await _userManager.UpdateAsync(appUser);
                _storeService.UpdateUser(appUser.Id, appUser);
                //if (updateResult.Succeeded)
                if (_storeService.GetUserByEmail(user.Email).Token == token)
                {
                    return Ok(appUser);
                }
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        { 
            //if (_userManager.Users.Any(u => u.Email == user.Email))
            if(_storeService.GetUserByEmail(user.Email) != null)
            {
                return BadRequest("Email is taken");
            }
            //if (_userManager.Users.Any(u => u.UserName == user.UserName))
            if (_storeService.GetUserByName(user.UserName) != null)
            {
                return BadRequest("Name is taken");
            }
            var appUser = new User
            {
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password
            };
            //var result = await _userManager.CreateAsync(appUser, user.Password);
            _storeService.CreateUser(appUser);
            //if (result.Succeeded)
            if(_storeService.GetUserByEmail(user.Email) != null)
            {
                var token = _tokenService.CreateToken(appUser);
                appUser.Token = token;
                //var result = await _userManager.UpdateAsync(appUser);
                _storeService.UpdateUser(appUser.Id, appUser);
                //if (result.Succeeded)
                if(_storeService.GetUserByEmail(user.Email).Token == token)
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
