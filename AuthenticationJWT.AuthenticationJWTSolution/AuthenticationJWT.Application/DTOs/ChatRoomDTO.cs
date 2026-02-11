using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Application.DTOs
{
    public class ChatRoomDTO
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }  
        public string Description { get; set; }
        public bool IsDefault { get; set; } 
        public IEnumerable<MessageDTO> Messages { get; set; }
    }
}
