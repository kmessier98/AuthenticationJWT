using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;

namespace AuthenticationJWT.Application.MappingProfiles
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile() 
        {
            CreateMap<User, UserDTO>().ReverseMap();
        }
    }
}
