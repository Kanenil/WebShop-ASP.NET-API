using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using WebShop.Constants;
using WebShop.Data.Entities.Identity;
using AutoMapper;
using WebShop.Abstract;
using WebShop.Models.Account;

namespace WebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<UserEntity> userManager, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("google/login")]
        public async Task<IActionResult> GoogleLogin([FromBody] string googleToken)
        {
            var payload = await _jwtTokenService.VerifyGoogleToken(googleToken);

            if (payload == null) 
                return BadRequest();

            string provider = "Google";
            var info = new UserLoginInfo(provider, payload.Subject, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
                return BadRequest();

            var token = await _jwtTokenService.CreateToken(user);
            return Ok(new { token });
        }

        [HttpPost("google/register")]
        public async Task<IActionResult> GoogleRegister([FromBody] GoogleRegisterViewModel model)
        {
            var payload = await _jwtTokenService.VerifyGoogleToken(model.Token);

            if (payload == null)
                return BadRequest();

            string provider = "Google";
            var info = new UserLoginInfo(provider, payload.Subject, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new UserEntity
                    {
                        Email = payload.Email,
                        FirstName = model.FirstName,
                        UserName = payload.Email,
                        LastName = model.LastName,
                        Image = model.Image
                    };

                    var resultCreate = await _userManager.CreateAsync(user);
                    if (!resultCreate.Succeeded)
                        return BadRequest();
                    await _userManager.AddToRoleAsync(user, Roles.User);
                }

                var resultUserLogin = await _userManager.AddLoginAsync(user, info);
                if (!resultUserLogin.Succeeded)
                    return BadRequest();
            }

            var token = await _jwtTokenService.CreateToken(user);
            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            try
            {
                var user = _mapper.Map<UserEntity>(model);

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    result = await _userManager.AddToRoleAsync(user, Roles.User);

                    var token = await _jwtTokenService.CreateToken(user);
                    return Ok(new { token });
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.Email);

                if (user == null)
                    return NotFound();


                if(!await _userManager.CheckPasswordAsync(user, model.Password))
                    return BadRequest();

                var token = await _jwtTokenService.CreateToken(user);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
