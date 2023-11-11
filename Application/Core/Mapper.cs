using Application.Activities;
using Application.Comments;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d=>d.HostUsername, o=>o.MapFrom(s=>s.Attendees.FirstOrDefault(x=>x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d=>d.DisplayName, o=>o.MapFrom(s=>s.AppUser.DisplayName))
                .ForMember(d=>d.UserName, o=>o.MapFrom(s=>s.AppUser.UserName))
                .ForMember(d=>d.Bio, o=>o.MapFrom(s=>s.AppUser.Bio))
                .ForMember(d=>d.Image, o=>o.MapFrom(s=>s.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url));
            // d is the Attendee and s is AppUser
            CreateMap<AppUser, Attendee>()
                .ForMember(d=>d.Image, o=>o.MapFrom(s=>s.Photos.FirstOrDefault(x=>x.IsMain).Url));

            CreateMap<Comment, CommentDto>()
                .ForMember(d=>d.DisplayName, o=>o.MapFrom(s=>s.Author.DisplayName))
                .ForMember(d=>d.UserName, o=>o.MapFrom(s=>s.Author.UserName))
                .ForMember(d=>d.Image, o=>o.MapFrom(s=>s.Author.Photos.FirstOrDefault(x=>x.IsMain).Url));

        }
    }
}