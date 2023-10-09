using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>> {
            public Activity Activity { set; get; }
        }

        public class Validate : AbstractValidator<Command> {
            public Validate()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private DataContext _dataContext;
            private IUserAccesser _userAccesser;
            public Handler(DataContext dataContext, IUserAccesser userAccesser) {
                _dataContext = dataContext;
                _userAccesser = userAccesser;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == _userAccesser.GetUserName());

                var Attendee = new ActivityAttendee{
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                request.Activity.Attendees.Add(Attendee);

                _dataContext.Activities.Add(request.Activity);

                var result = await _dataContext.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Faliure("Failed to load activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}