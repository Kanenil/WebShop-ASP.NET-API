namespace WebShop.Models
{
    public class CategoryEditViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }
}
