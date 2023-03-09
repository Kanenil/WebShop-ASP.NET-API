using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop.Constants;
using WebShop.Data;
using WebShop.Data.Entities;
using WebShop.Models;
using WebShop.Models.Category;

namespace WebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class CategoriesController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(AppEFContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
        public async Task<IActionResult> Create([FromBody] CategoryCreateViewModel model)
        {
            var cat = _mapper.Map<CategoryEntity>(model);
            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] CategoryEditViewModel model)
        {
            var data = _context.Categories.SingleOrDefault(x=>x.Id == model.Id);

            if (!String.IsNullOrEmpty(data.Image) && data.Image != model.Image)
            {
                string imageDir = Path.Combine(Directory.GetCurrentDirectory(), "images", data.Image);
                System.IO.File.Delete(imageDir);
            }

            data.Image = model.Image;
            data.Name = model.Name;
            data.Description = model.Description;
            await _context.SaveChangesAsync();

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
