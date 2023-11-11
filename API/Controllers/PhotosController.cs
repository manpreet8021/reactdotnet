using Application.Photos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add(IFormFile File) {
            return HandleResult(await Mediator.Send(new Add.Command{File = File}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> UpdateMain(string id) {
            return HandleResult(await Mediator.Send(new SetMain.Command{Id = id}));
        }
    }
}