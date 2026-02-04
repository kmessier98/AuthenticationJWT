using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;

namespace AuthenticationJWT.Application.MappingProfiles
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            CreateMap<Product, CreateProductDTO>().ReverseMap();
            CreateMap<Product, ProductDTO>().ReverseMap();
        }
    }
}
