using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.Infrastructure.Data;
using AuthenticationJWT.SharedLibrary.Responses;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationJWT.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;
        public AuthRepository(AppDbContext context) 
        {
            _context = context;
        }

        public async Task<Response> RegisterUser(User user)
        {
            var result = await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return result.Entity.Id != Guid.Empty ? new Response(true, $"User {user.Username} registered successfully.") :
                                                    new Response(false, "User registration failed.");
        }

        public async Task<User> GetUserByUserName(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return user!;
        }

        public async Task<User> GetUserById(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            return user!;
        }

        public async Task<User> ValidateUser(string username, string password)
        {
            var user = await GetUserByUserName(username);
            if (user is null)
                return null!;

            bool verifyPassword = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!verifyPassword)
                return null!;

            return user;
        }

        public async Task<Response> UpdateUser(User user)
        {
            var existingUser = await GetUserById(user.Id);
            if (existingUser is null)
                return new Response(false, $"User with ID {user.Id} not found.");

            _context.Entry(existingUser).State = EntityState.Detached;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new Response(true, $"User {user.Username} updated successfully.");
        }
    }
}
