using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using API.DTOs;
using API.Service;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        public UserManager<AppUser> _userManager;
        public TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if(user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if(result) {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> register(RegisterDto registerDto) {
            if(await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName)) {
                ModelState.AddModelError("username", "Username is already taken");
            }
            if(await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email)) {
                ModelState.AddModelError("email", "Email is already taken");
            }

            if(ModelState.Count > 0){
                return ValidationProblem();
            }

            var user = new AppUser{
                DisplayName= registerDto.DisplayName,
                Email= registerDto.Email,
                UserName= registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);
            }
            ModelState.AddModelError("error", "Error Occured");
            return ValidationProblem();
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                UserName = user.UserName,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser() {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserObject(user);
        }
    }
}