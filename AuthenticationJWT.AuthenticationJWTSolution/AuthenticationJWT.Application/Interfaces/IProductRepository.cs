using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;

namespace AuthenticationJWT.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<(Response Response, Product Product)> AddProduct(Product product);
        Task<IEnumerable<Product>> GetProducts();
        Task<Response> DeleteProduct(Guid id);
    }
}
