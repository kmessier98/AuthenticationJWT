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

        public async Task<Response> AddProduct(Product product)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Name == product.Name);
            if (existingProduct is not null) 
                return new Response(false, "Product with the same name already exists.");

            var createdProduct = await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            if (createdProduct.Entity.Id == Guid.Empty)
                return new Response(false, "Failed to add the product.");

            return new Response(true, "Product added successfully.");

        }

        public async Task<IEnumerable<Product>> GetProducts()
        {
            return await _context.Products.AsNoTracking().ToListAsync();
        }
    }
}
