using Microsoft.AspNetCore.Mvc.ModelBinding;
using FluentValidation.Results;

namespace AuthenticationJWT.Application.Extensions
{
    public static class ModelValidationExtension
    {
        public static void AddToModelState(this ValidationResult result, ModelStateDictionary modelState)
        {
            foreach (var error in result.Errors)
            {
                modelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }
        }
    }
}
