using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Extensions;
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

        public AuthController(IValidator<RegisterDTO> registerValidator, IValidator<LoginDTO> loginValidator)
        {
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
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

            return Ok();
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {

            return Ok();
        }
    }
}
