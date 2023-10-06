using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController 
    {
        private ILogger<ActivitiesController> _logger;

        public ActivitiesController(ILogger<ActivitiesController> logger)
        {
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> GetActivities(CancellationToken cancellationToken) {
            return HandleResult(await Mediator.Send(new List.Query(), cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id){
            return HandleResult(await Mediator.Send(new Detail.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid Id, Activity activity) {
            activity.Id = Id;
            _logger.LogInformation("Here");
            return HandleResult(await Mediator.Send(new Edit.Command{Activity=activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid Id) {
            return HandleResult(await Mediator.Send(new Delete.Command{Id=Id}));
        }
    }
}