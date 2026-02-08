using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> GetUserById(Guid id);
        Task<User> GetUserByUserName(string username);
        Task<User> ValidateUser(string username, string password);
        Task<Response> RegisterUser(User user);
        Task<Response> UpdateUser(User user);
    }
}
