using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private DataContext _dataContext;
            private ILogger _logger;
            private IMapper _mapper;
            public Handler(DataContext dataContext, ILogger<List> logger, IMapper mapper){
                _dataContext = dataContext;
                _logger = logger;
                _mapper = mapper;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try {
                    cancellationToken.ThrowIfCancellationRequested();
                    _logger.LogInformation("here it is");
                } catch (System.Exception) {
                    _logger.LogInformation("Task was cancelled");
                }
                var activities = await _dataContext.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}