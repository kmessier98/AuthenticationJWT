using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> GetUserByUserName(string username);
        Task<User> ValidateUser(string username, string password);
        Task<Response> RegisterUser(User user);
    }
}
