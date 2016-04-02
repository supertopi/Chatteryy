using Microsoft.AspNet.SignalR;

namespace Chatteryy
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            Clients.All.broadcastMessage( string.Concat(name, ": ", message) );
        }
    }
}