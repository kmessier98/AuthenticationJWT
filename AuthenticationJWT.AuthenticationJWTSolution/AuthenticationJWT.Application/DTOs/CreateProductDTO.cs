using Microsoft.AspNetCore.Http;

namespace AuthenticationJWT.Application.DTOs
{
    public class CreateProductDTO
    {
        public string Name { get; set; }
        private string? _description;
        public string Description
        {
            get => _description ?? string.Empty; // Si c'est null, renvoie ""
            set => _description = value;
        }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public IFormFile? File { get; set; }
    }
}
