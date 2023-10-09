using System.Security.Cryptography.X509Certificates;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>> {
            public Guid Id;
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private DataContext _dataContext;
            private IUserAccesser _userAccesser;
            private IMapper _mapper;

            public Handler(DataContext dataContext, IUserAccesser userAccesser, IMapper mapper)
            {
                _dataContext = dataContext;
                _userAccesser = userAccesser;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .Include(a=>a.Attendees)
                    .ThenInclude(a=>a.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if(activity == null) return null;

                var user = await _dataContext.Users.FirstOrDefaultAsync(a=>a.UserName == _userAccesser.GetUserName());

                if(user == null) return null;

                var hostName = activity.Attendees.FirstOrDefault(x=>x.IsHost).AppUser.UserName;
                var attendance = activity.Attendees.FirstOrDefault(x=>x.AppUser.UserName == user.UserName);

                if(hostName == user.UserName && attendance != null) {
                    activity.IsCancelled = !activity.IsCancelled;
                } else if(attendance != null){
                    activity.Attendees.Remove(attendance);
                } else {
                    attendance = new Domain.ActivityAttendee{
                        AppUser= user,
                        Activity= activity,
                        IsHost= false
                    };
                    activity.Attendees.Add(attendance);
                }

                var result = await _dataContext.SaveChangesAsync() > 0;

                if(result)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Faliure("Error occured while updating Attandance"); 
            }
        }
    }
}