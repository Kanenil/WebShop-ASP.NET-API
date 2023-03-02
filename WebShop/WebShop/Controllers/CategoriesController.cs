using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop.Data;
using WebShop.Data.Entities;
using WebShop.Models;

namespace WebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppEFContext _context;

        public CategoriesController(AppEFContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetList()
        {
            var list = _context.Categories
                .Select(x => new CategoryItemViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Image = x.Image,
                    Description = x.Description,
                })
                .ToList();
            return Ok(list);
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            
            string exp = Path.GetExtension(image.FileName);
            var imageName = Path.GetRandomFileName() + exp;
            string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
            using (var stream = System.IO.File.Create(dirSaveImage))
            {
                await image.CopyToAsync(stream);
            }
            return imageName;
        }

        [HttpGet("{id}")]
        public IActionResult GetCategory(int id) 
        {
            var model = _context.Categories.SingleOrDefault(x => x.Id == id);
            if (model == null)
                return NotFound();
            return Ok(new CategoryItemViewModel
            {
                Id = model.Id,
                Name = model.Name,
                Image = model.Image,
                Description = model.Description,
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CategoryCreateViewModel model)
        {
            string imageName = String.Empty;
            if (model.Image != null)
            {
                imageName = await SaveImage(model.Image);
            }
            var user = new CategoryEntity
            {
                Name = model.Name,
                Description = model.Description,
                Image = imageName,
            };
            _context.Categories.Add(user);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromForm] CategoryEditViewModel model)
        {
            var data = _context.Categories.SingleOrDefault(x=>x.Id == model.Id);

            if (model.File != null)
            {
                if (!String.IsNullOrEmpty(data.Image))
                {
                    string imageDir = Path.Combine(Directory.GetCurrentDirectory(), "images", data.Image);
                    System.IO.File.Delete(imageDir);
                }

                data.Image = await SaveImage(model.File);
            }

            data.Name = model.Name;
            data.Description = model.Description;
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var data = _context.Categories.SingleOrDefault(x => x.Id == id);

            if (!String.IsNullOrEmpty(data.Image))
            {
                string imageDir = Path.Combine(Directory.GetCurrentDirectory(), "images", data.Image);
                System.IO.File.Delete(imageDir);
                data.Image = string.Empty;
            }

            _context.Categories.Remove(data);
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
