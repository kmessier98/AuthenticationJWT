namespace AuthenticationJWT.Domain.Entities
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; } = false;
        public IEnumerable<Message> Messages { get; set; }
    }
}
