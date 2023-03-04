using AutoMapper;
using WebShop.Data.Entities;
using WebShop.Data.Entities.Identity;
using WebShop.Models;

namespace WebShop.Mapper
{
    public class AppMapProfile : Profile
    {
        public AppMapProfile()
        {
            CreateMap<RegisterViewModel, UserEntity>()
                .ForMember(x => x.UserName, dto => dto.MapFrom(x => x.Email));
            CreateMap<CategoryCreateViewModel, CategoryEntity>();
        }
    }
}
