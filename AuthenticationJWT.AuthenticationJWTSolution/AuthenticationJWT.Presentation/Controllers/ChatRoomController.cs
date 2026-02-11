using AuthenticationJWT.Application.DTOs;
using AuthenticationJWT.Application.Interfaces;
using AuthenticationJWT.Domain.Entities;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public ChatRoomController(IChatRoomService chatRoomService, IChatRoomRepository chatRoomRepository, IMapper mapper)
        {
            _chatRoomService = chatRoomService;
            _chatRoomRepository = chatRoomRepository;
            _mapper = mapper;
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
        public async Task<ActionResult<ChatRoomDTO>> CreateChatRoom([FromBody] ChatRoomDTO chatRoom)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (response, createdChatRoom) = await _chatRoomService.CreateChatRoomAsync(chatRoom);
            if (!response.IsSuccess)
                return BadRequest(new { response.Message});

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
                return BadRequest(new { response.Message });

            return Ok(message);
        }
    }
}
