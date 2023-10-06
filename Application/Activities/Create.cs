using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
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
            public Handler(DataContext dataContext) {
                _dataContext = dataContext;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _dataContext.Activities.Add(request.Activity);

                var result = await _dataContext.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Faliure("Failed to load activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}