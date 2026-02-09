using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationJWT.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        public ProductController(IMapper mapper, IProductRepository productRepository) 
        {
            _mapper = mapper;
            _productRepository = productRepository;        
        }

        [Authorize] //Doit etre connecté pour pouvoir accéder 
        [HttpGet("GetProducts")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        
        {
            var products = await _productRepository.GetProducts();

            var productsDTO = _mapper.Map<IEnumerable<ProductDTO>>(products);
            return productsDTO.Any() ? Ok(productsDTO) : NoContent();
        }

        [Authorize(Roles = "Admin")] // Doit etre connecté et avoir le role admin pour créer produit
        [HttpPost("AddProduct")]
        public async Task<ActionResult> AddProduct([FromBody] CreateProductDTO productDTO)
        {
            var product = _mapper.Map<Product>(productDTO);
            var response = await _productRepository.AddProduct(product);
            if (!response.IsSuccess)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

    }
}
