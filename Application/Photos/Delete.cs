using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>{
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccesser _userAccessor;
            public Handler(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAccesser userAccesser){
                _dataContext = dataContext;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccesser;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                var photo = user.Photos.FirstOrDefault(x=>x.Id==request.Id);

                if(photo == null) return null;

                if(photo.IsMain) return Result<Unit>.Faliure("You cannot delete the main photo");

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if(result == null) return Result<Unit>.Faliure("Problem while deleting photo");

                user.Photos.Remove(photo);

                var success = await _dataContext.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Faliure("Problem deleting photo");
            }
        }
    }
}