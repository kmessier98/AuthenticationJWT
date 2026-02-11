using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;

namespace AuthenticationJWT.Application.MappingProfiles
{
    public class ChatRoomMappingProfile : Profile
    {
        public ChatRoomMappingProfile()
        {
            CreateMap<ChatRoom, ChatRoomDTO>()    
                .ForMember(dest => dest.Messages, opt => opt.MapFrom(src => src.Messages))
                .ReverseMap();
            CreateMap<Message, MessageDTO>().ReverseMap();
        }
    }
}
