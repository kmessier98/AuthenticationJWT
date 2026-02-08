namespace AuthenticationJWT.Application.DTOs
{
    public class UpdateUserDTO
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; } 
    }
}
