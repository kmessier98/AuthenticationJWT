using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<Response> AddProduct(Product product);
        Task<IEnumerable<Product>> GetProducts();
    }
}
