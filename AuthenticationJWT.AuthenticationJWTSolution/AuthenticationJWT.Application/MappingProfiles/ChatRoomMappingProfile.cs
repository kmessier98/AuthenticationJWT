using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;

namespace AuthenticationJWT.Application.MappingProfiles
{
    public class ChatRoomMappingProfile : Profile
    {
        public ChatRoomMappingProfile()
        {
            CreateMap<ChatRoom, ChatRoomDTO>().ReverseMap();
            CreateMap<Message, MessageDTO>().ReverseMap();
        }
    }
}
