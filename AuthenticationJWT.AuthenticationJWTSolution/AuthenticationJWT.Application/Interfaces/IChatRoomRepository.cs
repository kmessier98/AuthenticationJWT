using AuthenticationJWT.Domain.Entities;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IChatRoomRepository
    {
        public Task<ChatRoom> GetChatRoomByIdAsync(Guid id);
        public Task<ChatRoom> GetChatRoomByNameAsync(string name);
        public Task<ChatRoom> CreateChatRoomAsync(ChatRoom chatRoom);
        public Task<bool> DeleteChatRoomAsync(Guid id);
        public Task<IEnumerable<ChatRoom>> GetAllChatRoomAsync();
        public Task<Message> AddMessageAsync(Message message);
    }
}
