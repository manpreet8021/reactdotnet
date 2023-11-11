using System.Data;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>> {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> {
            public CommandValidator() {
                RuleFor(x=>x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccesser _userAccesser;
            public Handler(DataContext dataContext, IMapper mapper, IUserAccesser userAccesser){
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccesser = userAccesser;
            }
            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.ActivityId);

                if(activity == null) return null;

                var user = await _dataContext.Users.Include(p=>p.Photos).SingleOrDefaultAsync(x=> x.UserName == _userAccesser.GetUserName());

                var comment = new Comment {
                    Author = user,
                    Activity = activity,
                    Body = request.Body
                };

                activity.Comments.Add(comment);

                var success = await _dataContext.SaveChangesAsync() > 0;

                if(success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));

                return Result<CommentDto>.Faliure("Failed to add comment");
            }
        }
    }
}