using Microsoft.AspNetCore.SignalR;

namespace AuthenticationJWT.Presentation.Hubs
{
    public class ChatHub : Hub
    {
        // Appelé automatiquement quand le client fait .start()
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var roomId = httpContext.Request.Query["roomId"];

            if (!string.IsNullOrEmpty(roomId))
            {
                // On groupe les connexions par salle pour ne pas polluer les autres
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            }

            await base.OnConnectedAsync();
        }
    }
}
