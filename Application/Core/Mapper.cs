using Application.Activities;
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
            CreateMap<ActivityAttendee, Attendee>()
                .ForMember(d=>d.DisplayName, o=>o.MapFrom(s=>s.AppUser.DisplayName))
                .ForMember(d=>d.UserName, o=>o.MapFrom(s=>s.AppUser.UserName))
                .ForMember(d=>d.Bio, o=>o.MapFrom(s=>s.AppUser.Bio));

        }
    }
}