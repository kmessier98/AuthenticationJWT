using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;

namespace AuthenticationJWT.Application.MappingProfiles
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            CreateMap<CreateProductDTO, Product>().ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.File == null ? null : src.File.FileName));
            CreateMap<Product, CreateProductDTO>();
            CreateMap<Product, ProductDTO>().ReverseMap();
        }
    }
}
