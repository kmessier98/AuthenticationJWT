using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace AuthenticationJWT.Infrastructure.Repositories
{
    public class ChatRoomRepository : IChatRoomRepository
    {
        private readonly AppDbContext _context;
        public ChatRoomRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChatRoom> GetChatRoomAsync(Guid id)
        {
            var chatRoom = await _context.ChatRooms.
                Include(m => m.Messages).
                FirstOrDefaultAsync(c => c.Id == id);

            return chatRoom!;
        }

        public async Task<IEnumerable<ChatRoom>> GetAllChatRoomAsync()
        {
            var chatRooms = _context.ChatRooms.AsNoTracking().ToList();

            return chatRooms;
        }

        public async Task<Message> AddMessageAsync(Message message)
        {
            var createdMessage = _context.Messages.Add(message).Entity;
            await _context.SaveChangesAsync();

            return createdMessage;
        }
    }
}
