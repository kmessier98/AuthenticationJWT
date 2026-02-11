namespace AuthenticationJWT.Domain.Entities
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<Message> Messages { get; set; }
    }
}
