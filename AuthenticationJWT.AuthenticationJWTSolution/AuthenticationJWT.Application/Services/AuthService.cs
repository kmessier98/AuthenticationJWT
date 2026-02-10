using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthenticationJWT.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;

        public AuthService(IAuthRepository authRepository, IConfiguration config) 
        { 
            _authRepository = authRepository;
            _config = config;
        }

        public async Task<Response> RegisterAsync(RegisterDTO registerDTO)
        {
            var userExists = await _authRepository.GetUserByUserName(registerDTO.Username);
            if (userExists != null)
                return new Response(false, $"User {registerDTO.Username} already exists");

            var user = new User
            {
                Username = registerDTO.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                Role = registerDTO.Role
            };
            return await _authRepository.RegisterUser(user);
        }

        public async Task<(UserDTO, string)> LoginAsync(LoginDTO loginDTO)
        {
            var user = await _authRepository.ValidateUser(loginDTO.Username, loginDTO.Password);
            if (user is null)
                return (null!, null!);

            var token = GenerateToken(user);
            return (new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            }, token);
        }

        public async Task<(Response, string)> UpdateUserAsync(UpdateUserDTO updateUserDTO)
        {
            var user = await _authRepository.GetUserById(updateUserDTO.Id);
            if (user is null)
                return (new Response(false, $"User with id {updateUserDTO.Id} not found"), null!);

            if (updateUserDTO.Username != user.Username)
            {
                var userExists = await _authRepository.GetUserByUserName(updateUserDTO.Username);
                if (userExists != null)
                    return (new Response(false, $"Username {updateUserDTO.Username} is already taken"), null!);
            }

            var updateUser = new User
            {
                Id = user.Id,
                Username = updateUserDTO.Username,
                PasswordHash = user.PasswordHash,
                Role = updateUserDTO.Role
            };

            var token = GenerateToken(updateUser);
            var response = await _authRepository.UpdateUser(updateUser);

            return (response, token);
        }

        private string GenerateToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config.GetSection("JWT:Key").Value!);
            var securityKey = new SymmetricSecurityKey(key);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.Role, user.Role)
            };
            var token = new JwtSecurityToken(
                issuer: _config.GetSection("JWT:Issuer").Value,
                audience: _config.GetSection("JWT:Audience").Value,
                claims: claims,
                expires: DateTime.Now.AddMinutes(int.Parse(_config["JWT:TokenLifetimeMinutes"]!)), // TODO integrer refresh token
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
