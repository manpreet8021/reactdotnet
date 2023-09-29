using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private DataContext _dataContext;
            private ILogger _logger;
            public Handler(DataContext dataContext, ILogger<List> logger){
                _dataContext = dataContext;
                _logger = logger;
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                try {
                    cancellationToken.ThrowIfCancellationRequested();
                    _logger.LogInformation("here it is");
                } catch (System.Exception) {
                    _logger.LogInformation("Task was cancelled");
                }
                return await _dataContext.Activities.ToListAsync();
            }
        }
    }
}