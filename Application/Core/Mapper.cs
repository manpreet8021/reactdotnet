using AutoMapper;
using Domain;

namespace Application.Core
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Activity, Activity>();
        }
    }
}