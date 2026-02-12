using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Application.DTOs
{
    public class SendMessageRequest
    {
        [Required]
        public string Content { get; set; }
    }
}
