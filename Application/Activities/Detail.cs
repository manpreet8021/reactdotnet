using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Detail
    {
        public class Query : IRequest<Activity> {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
             private DataContext _dataContext;
            public Handler(DataContext dataContext) {
                _dataContext = dataContext;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _dataContext.Activities.FindAsync(request.Id);
            }
        }
    }
}