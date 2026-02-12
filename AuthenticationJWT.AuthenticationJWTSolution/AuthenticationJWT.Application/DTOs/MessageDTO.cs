namespace AuthenticationJWT.Application.DTOs
{
    public class MessageDTO
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public Guid ChatRoomId { get; set; }
        public UserDTO Sender { get; set; }
    }
}
