using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.SharedLibrary.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace AuthenticationJWT.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<(Response Response, ProductDTO Product)> AddProduct(CreateProductDTO productDTO)
        {
            var existingProduct = await _productRepository.GetProductByName(productDTO.Name);
            if (existingProduct != null)
            {
                return (new Response(false, "Product with the same name already exists."), null!);
            }

            if (productDTO.File != null)
            {
                var fileExtension = Path.GetExtension(productDTO.File.FileName).ToLower();
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return (new Response(false, "Invalid file type. Only image files are allowed."), null!);
                }
                AddImageFileToDirectory(productDTO.File);
            }

            var product = _mapper.Map<Product>(productDTO);
            var data = await _productRepository.AddProduct(product);
            if (!data.Response.IsSuccess)
            {
                return (data.Response, null!);
            }

            var productDto = _mapper.Map<ProductDTO>(data.Product);
            return (data.Response, productDto);
        }

        private void AddImageFileToDirectory(IFormFile file)
        {
            // 1. Définir le chemin du répertoire 
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // 2. Créer le répertoire s'il n'existe pas
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // 3. Combiner le chemin avec le nom du fichier original
            var filePath = Path.Combine(uploadsFolder, file.FileName);

            // 4. Créer le fichier et y copier le contenu (les octets envoyés par Angular)
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }
        }
    }
}
