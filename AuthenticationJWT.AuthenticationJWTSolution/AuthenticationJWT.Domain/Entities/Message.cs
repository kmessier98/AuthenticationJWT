namespace AuthenticationJWT.Domain.Entities
{
    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public Guid SenderId { get; set; }
        public Guid ChatRoomId { get; set; }
        public User Sender { get; set; }
        public ChatRoom ChatRoom { get; set; }
    }
}
