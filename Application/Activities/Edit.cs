using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>{
            public Activity Activity { get; set; }
        }

        public class Validate : AbstractValidator<Command>{
            public Validate()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>> {
            private DataContext _dataContext;
            private IMapper _mapper;
            private ILogger<Edit> _logger;
            public Handler(DataContext dataContext, IMapper mapper, ILogger<Edit> logger) { 
                _dataContext = dataContext;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Activity.Id);
                
                if(activity == null) {
                    return null;
                }

                _mapper.Map(request.Activity, activity);

                var result = await _dataContext.SaveChangesAsync() > 0;

                if(!result) Result<Unit>.Faliure("Unable to update the activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}