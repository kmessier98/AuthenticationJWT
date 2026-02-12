namespace AuthenticationJWT.Domain.Entities
{
    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
        public Guid SenderId { get; set; }
        public Guid ChatRoomId { get; set; }
        public User Sender { get; set; }
        public ChatRoom ChatRoom { get; set; }
    }
}
