namespace AuthenticationJWT.Application.DTOs
{
    public class ChatRoomDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }   
        public IEnumerable<MessageDTO> Messages { get; set; }
    }
}
