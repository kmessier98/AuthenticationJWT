using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IChatRoomService
    {
        Task<(Response Response, MessageDTO Message)> SendMessageAsync(Guid chatRoomId, Guid senderId, string content);
        Task<(Response Response, IEnumerable<MessageDTO> Messages)> GetMessagesAsync(Guid chatRoomId);
    }
}
