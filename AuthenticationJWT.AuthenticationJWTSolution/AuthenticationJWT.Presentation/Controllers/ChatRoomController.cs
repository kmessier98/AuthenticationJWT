using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AuthenticationJWT.Presentation.Hubs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace AuthenticationJWT.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IChatRoomService _chatRoomService;
        private readonly IChatRoomRepository _chatRoomRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<ChatHub> _hubContext;
        public ChatRoomController(IChatRoomService chatRoomService, 
                                  IChatRoomRepository chatRoomRepository,
                                  IMapper mapper,
                                  IHubContext<ChatHub> hubContext)
        {
            _chatRoomService = chatRoomService;
            _chatRoomRepository = chatRoomRepository;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatRoomDTO>>> GetChatRooms()
        {
            var chatRooms = await _chatRoomRepository.GetAllChatRoomAsync();
            if (chatRooms == null || !chatRooms.Any())
                return NotFound("No chat rooms found");

            var chatRoomsDTO = _mapper.Map<IEnumerable<ChatRoomDTO>>(chatRooms);

            return Ok(chatRoomsDTO);
        }

        [Authorize]
        [HttpGet("{chatroomId}")]
        public async Task<ActionResult<ChatRoomDTO>> GetChatRoom(Guid chatRoomId)
        {
            var (response, chatRoom) = await _chatRoomService.GetChatRoomAsync(chatRoomId);
            if (!response.IsSuccess)
                return NotFound($"Chat room with id {chatRoomId} not found");

            return Ok(chatRoom);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ChatRoomDTO>> CreateChatRoom([FromBody] CreateChatRoomDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (response, createdChatRoom) = await _chatRoomService.CreateChatRoomAsync(request.Name, request.Description);
            if (!response.IsSuccess)
            {
                var message = response.Message;
                if (message.Contains("already exists"))
                    return Conflict(new { response.Message });

                return BadRequest(new { response.Message });
            }
               

            return Ok(createdChatRoom);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{chatRoomId}")]
        public async Task<ActionResult> DeleteChatRoom(Guid chatRoomId)
        {
            bool success = await _chatRoomRepository.DeleteChatRoomAsync(chatRoomId);
            if (!success)
                return BadRequest($"Failed to delete the chat room with id {chatRoomId}");

            return NoContent();
        }

        [Authorize]
        [HttpPost("{chatRoomId}/messages")]
        public async Task<ActionResult<MessageDTO>> SendMessage(Guid chatRoomId, [FromBody] SendMessageRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized("User ID not found in token");

            var _userId = new Guid(userId);
            var (response, message) = await _chatRoomService.SendMessageAsync(chatRoomId, _userId, request.Content);

            if (!response.IsSuccess)
                return BadRequest(new { response.Message });

            // Notification SignalR à tous les membres du groupe "chatRoomId"
            await _hubContext.Clients.Group(chatRoomId.ToString())
                .SendAsync("ReceiveMessage", message);

            return Ok(message);
        }
    }
}
