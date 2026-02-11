using System.ComponentModel.DataAnnotations;

namespace AuthenticationJWT.Application.DTOs
{
    public class CreateChatRoomDTO
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
