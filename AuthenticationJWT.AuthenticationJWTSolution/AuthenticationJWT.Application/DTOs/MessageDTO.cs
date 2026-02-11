namespace AuthenticationJWT.Application.DTOs
{
    public class MessageDTO
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public Guid SenderId { get; set; }
        public Guid ChatRoomId { get; set; }
    }
}
