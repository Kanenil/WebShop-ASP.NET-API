using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using static System.Net.Mime.MediaTypeNames;
using WebShop.Models;
using WebShop.Data;
using Microsoft.AspNetCore.Identity;
using WebShop.Constants;
using WebShop.Data.Entities.Identity;
using AutoMapper;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace WebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly SignInManager<UserEntity> _signInManager;
        private readonly IMapper _mapper;

        public AccountController(UserManager<UserEntity> userManager, IMapper mapper, SignInManager<UserEntity> signInManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            try
            {
                var user = _mapper.Map<UserEntity>(model);

                if (model.ProviderKey != null)
                {
                    await _userManager.CreateAsync(user);
                    await _userManager.AddToRoleAsync(user, Roles.User);
                    await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", model.ProviderKey, "Google"));
                    return Ok();
                }
                else
                {
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        result = await _userManager.AddToRoleAsync(user, Roles.User);



                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
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
                if (model.ProviderKey != null)
                {
                    var user = await _userManager.FindByLoginAsync("Google", model.ProviderKey);

                    if (user == null)
                        return BadRequest();

                    return Ok();
                }
                else
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);

                    if (user == null) 
                        return BadRequest();

                    var res = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

                    if (res.Succeeded)
                        return Ok();

                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("upload")]
        public async Task <IActionResult> Upload([FromForm] IFormFile image)  
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image file was uploaded.");
            }

            string exp = Path.GetExtension(image.FileName);
            var imageName = Path.GetRandomFileName() + exp;
            string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
            using (var stream = System.IO.File.Create(dirSaveImage))
            {
                await image.CopyToAsync(stream);
            }
            return Ok(new UploadImageViewModel() { Image = imageName });
        }
    }
}
