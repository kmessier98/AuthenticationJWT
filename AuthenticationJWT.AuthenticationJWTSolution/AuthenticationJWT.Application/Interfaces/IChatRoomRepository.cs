using AuthenticationJWT.Domain.Entities;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IChatRoomRepository
    {
        public Task<ChatRoom> GetChatRoomAsync(Guid id);
        public Task<IEnumerable<ChatRoom>> GetAllChatRoomAsync();
        public Task<Message> AddMessageAsync(Message message);
    }
}
