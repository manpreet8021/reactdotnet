using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Detail
    {
        public class Query : IRequest<Result<ActivityDto>> {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private DataContext _dataContext;
            private IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper) {
                _dataContext = dataContext;
                _mapper = mapper;
            }
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x=>x.Id==request.Id);
                return Result<ActivityDto>.Success(activity); 
            }
        }
    }
}