using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Attendee>> {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Attendee>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, IMapper mapper){
                _dataContext = dataContext;
                _mapper = mapper;
            }
            public async Task<Result<Attendee>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.ProjectTo<Attendee>(_mapper.ConfigurationProvider).SingleOrDefaultAsync(x=>x.UserName == request.UserName);

                if(user == null) return null;

                return Result<Attendee>.Success(user);
            }
        }
    }
}