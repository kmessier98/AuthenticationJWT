using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Extensions;
using AuthenticationJWT.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IValidator<RegisterDTO> _registerValidator;
        private readonly IValidator<LoginDTO> _loginValidator;
        private readonly IAuthService _authService;

        public AuthController(IValidator<RegisterDTO> registerValidator, 
                              IValidator<LoginDTO> loginValidator, 
                              IAuthService authService)
        {
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _authService = authService;
        }

        [HttpGet("Test")]
        public async Task<IActionResult> Test()
        {
            return Ok(new { message = "Bravo, vous avez reussis!"});
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request)
        {
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                validationResult.AddToModelState(ModelState);
                return UnprocessableEntity(ModelState);
            }

            var response = await _authService.RegisterAsync(request);
            if (!response.IsSuccess)
            {
                return Conflict(new { response.Message });
            }

            return Ok(new { response.Message });
        }


        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDTO request)
        {
            var validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                validationResult.AddToModelState(ModelState);
                return UnprocessableEntity(ModelState);
            }

            string token = string.Empty;
            UserDTO user = null!;
            try
            {
                var data = await _authService.LoginAsync(request);
                if (data.User is null || string.IsNullOrEmpty(data.Token))
                {
                    return Unauthorized(new { message = "Invalid credentials." });
                }
                user = data.Item1;
                token = data.Item2;
            } 
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }

            return Ok(new { user, token });
        }
    }
}
