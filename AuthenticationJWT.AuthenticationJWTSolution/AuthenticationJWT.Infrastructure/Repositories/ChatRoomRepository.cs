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

        public async Task<ChatRoom> GetChatRoomByIdAsync(Guid id)
        {
            var chatRoom = await _context.ChatRooms.
                Include(m => m.Messages).
                FirstOrDefaultAsync(c => c.Id == id);

            return chatRoom!;
        }
        
        public async Task<ChatRoom> GetChatRoomByNameAsync(string name)
        {
            var chatRoom = await _context.ChatRooms.
                Include(m => m.Messages).
                FirstOrDefaultAsync(c => c.Name == name);
            return chatRoom!;
        }

        public async Task<IEnumerable<ChatRoom>> GetAllChatRoomAsync()
        {
            var chatRooms = _context.ChatRooms.AsNoTracking().ToList();

            return chatRooms;
        }

        public async Task<ChatRoom> CreateChatRoomAsync(ChatRoom chatRoom)
        {
            var createdChatRoom = _context.ChatRooms.AddAsync(chatRoom).Result.Entity;
            await _context.SaveChangesAsync();

            return createdChatRoom;
        }

        public async Task<bool> DeleteChatRoomAsync(Guid id)
        {
            var chatRoomToDelete = _context.ChatRooms.FindAsync(id).Result;
            if (chatRoomToDelete is null)
                return false; 

            _context.ChatRooms.Remove(chatRoomToDelete);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Message> AddMessageAsync(Message message)
        {
            var createdMessage = _context.Messages.Add(message).Entity;
            await _context.SaveChangesAsync();

            return createdMessage;
        }
    }
}
