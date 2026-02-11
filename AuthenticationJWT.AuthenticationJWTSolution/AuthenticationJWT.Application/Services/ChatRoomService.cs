using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;
using AutoMapper;

namespace AuthenticationJWT.Application.Services
{
    public class ChatRoomService : IChatRoomService
    {
        private readonly IChatRoomRepository _chatRoomRepository;
        private readonly IAuthRepository _authRepository;
        private IMapper _mapper;

        public ChatRoomService(IChatRoomRepository chatRoomRepository, IAuthRepository authRepository, IMapper mapper)
        {
            _chatRoomRepository = chatRoomRepository;
            _authRepository = authRepository;
            _mapper = mapper;
        }
        public async Task<(Response Response, IEnumerable<MessageDTO> Messages)> GetMessagesAsync(Guid chatRoomId)
        {
            throw new NotImplementedException();
        }

        public async Task<(Response Response, MessageDTO Message)> SendMessageAsync(Guid chatRoomId, Guid senderId, string content)
        {
            var chatRoom = await _chatRoomRepository.GetChatRoomAsync(chatRoomId);
            if (chatRoom == null)
            {
                return (new Response(false, "Chat room not found"), null!);
            }

            var user = await _authRepository.GetUserById(senderId);
            if (user == null)
            {
                return (new Response(false, "User not found"), null!);
            }

            var message = new Message
            {
                Content = content,
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                ChatRoomId = chatRoomId
            };

            var createdMessage = await _chatRoomRepository.AddMessageAsync(message);
            var messageDTO = _mapper.Map<MessageDTO>(createdMessage);

            return (new Response(true, "Message sent successfully"), messageDTO);
        }
    }
}
