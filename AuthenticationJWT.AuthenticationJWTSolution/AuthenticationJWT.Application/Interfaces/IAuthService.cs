using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IAuthService
    {
        Task<Response> RegisterAsync(RegisterDTO registerDTO);
        Task<string> LoginAsync(LoginDTO loginDTO);
    }
}
