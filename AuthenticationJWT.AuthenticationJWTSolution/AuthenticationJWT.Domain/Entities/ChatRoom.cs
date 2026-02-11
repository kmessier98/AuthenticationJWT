namespace AuthenticationJWT.Domain.Entities
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Message> Messages { get; set; }
    }
}
