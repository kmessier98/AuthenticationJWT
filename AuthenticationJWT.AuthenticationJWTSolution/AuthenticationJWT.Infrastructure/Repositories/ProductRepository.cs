using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.Infrastructure.Data;
using AuthenticationJWT.SharedLibrary.Responses;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationJWT.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(Response, Product)> AddProduct(Product product)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Name == product.Name);
            if (existingProduct is not null) 
                return (new Response(false, "Product with the same name already exists."), null!);

            var createdProduct = await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            if (createdProduct.Entity.Id == Guid.Empty)
                return (new Response(false, "Failed to add the product."), null!);

            return (new Response(true, "Product added successfully."), createdProduct.Entity);

        }

        public async Task<IEnumerable<Product>> GetProducts()
        {
            return await _context.Products.AsNoTracking().ToListAsync();
        }

        public async Task<Response> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null)
                return new Response(false, "Product not found.");
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return new Response(true, "Product deleted successfully.");
        }
    }
}
