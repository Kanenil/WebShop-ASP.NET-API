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
        private readonly IMapper _mapper;

        public AccountController(UserManager<UserEntity> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
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
                    result = _userManager
                        .AddToRoleAsync(user, Roles.User)
                        .Result;

                    return Ok();
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
