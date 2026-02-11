using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthenticationJWT.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IChatRoomService _chatRoomService;
        private readonly IChatRoomRepository _chatRoomRepository;

        public ChatRoomController(IChatRoomService chatRoomService, IChatRoomRepository chatRoomRepository)
        {
            _chatRoomService = chatRoomService;
            _chatRoomRepository = chatRoomRepository;
        }

        //[Authorize]
        //[HttpGet]
        //public async Task<>

        [Authorize]
        [HttpPost("{chatRoomId}/messages")]
        public async Task<ActionResult<MessageDTO>> SendMessage(Guid chatRoomId, [FromBody] string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return BadRequest("Message content cannot be empty");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized("User ID not found in token");

            var _userId = new Guid(userId);
            var (response, message) = await _chatRoomService.SendMessageAsync(chatRoomId, _userId, content);

            if (!response.IsSuccess)
                return BadRequest(response.Message);

            return Ok(message);
        }
    }
}
