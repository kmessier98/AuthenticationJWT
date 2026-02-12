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
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        public ProductController(IMapper mapper, 
                                IProductRepository productRepository,
                                IProductService productService)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _productService = productService;
        }

        [Authorize] //Doit etre connecté pour pouvoir accéder 
        [HttpGet("GetProducts")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts([FromQuery] string name = "")
        {
            var products = await _productRepository.GetProducts(name);

            var productsDTO = _mapper.Map<IEnumerable<ProductDTO>>(products);
            return productsDTO.Any() ? Ok(productsDTO) : NoContent();
        }

        [Authorize(Roles = "Admin")] // Doit etre connecté et avoir le role admin pour créer produit
        [HttpPost("AddProduct")]
        public async Task<ActionResult> AddProduct([FromForm] CreateProductDTO productDTO) //[FromForm] pour indiquer que les données proviennent d'un formulaire, notamment pour gérer les fichiers téléchargés (IFormFile)
                                                                                           // Utilise pour pouvoir recuperer le fichier envoyé dans le formulaire et le traiter correctement dans l'action du contrôleur.
        {
            var data = await _productService.AddProduct(productDTO);
            if (!data.Response.IsSuccess)
            {
                var response = data.Response;
                if (response.Message.Contains("already exists"))
                {
                    return Conflict(new { response.Message });
                }

                return BadRequest(new { response.Message });
            }  
            
            return Ok(data.Product);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteProduct/{id}")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            var response = await _productRepository.DeleteProduct(id);
            if (!response.IsSuccess)
                return NotFound(response.Message);
            return Ok(new { response.Message});
        }
    }
}
