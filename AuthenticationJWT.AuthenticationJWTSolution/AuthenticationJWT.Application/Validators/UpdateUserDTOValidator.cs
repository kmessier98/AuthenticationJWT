using AuthenticationJWT.Application.DTOs;
using FluentValidation;

namespace AuthenticationJWT.Application.Validators
{
    public class UpdateUserDTOValidator : AbstractValidator<UpdateUserDTO>
    {
        public UpdateUserDTOValidator() 
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("User ID is required.")
                .Must(id => id != Guid.Empty).WithMessage("User ID cannot be an empty GUID.");
            RuleFor(x => x.Username)
              .NotEmpty().WithMessage("Username is required.")
              .MinimumLength(3).WithMessage("Username must be at least 3 characters long.");
            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required.")
                .Must(role => role == "User" || role == "Admin")
                .WithMessage("Role must be either 'User' or 'Admin'.");
        }
    }
}
