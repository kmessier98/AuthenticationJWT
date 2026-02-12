using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IProductService
    {
        Task<(Response Response, ProductDTO Product)> AddProduct(CreateProductDTO product);
    }
}
