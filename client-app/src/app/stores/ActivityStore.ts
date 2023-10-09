import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    buttonLoader: boolean =false;
    activityMap= new Map<string,Activity>();

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityMap.values()).sort((a, b)=>a.date!.getTime() - b.date!.getTime())
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy h:mm aa');
                activities[date!] = activities[date!] ? [...activities[date!],activity] : [activity];
                return activities;
            }, {} as {[key:string]: Activity[]})
        )
    }

    loadActivities = async() => {
        this.setLoading(true)
        try {
            const activities = await agent.Activities.list();
            runInAction(()=>{
                activities.map((activity: Activity) => {
                    this.setActivity(activity);
                });
                this.setLoading(false);
            })
        } catch (err) {
            runInAction(()=>{
                this.setLoading(false);
            })
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else{
            this.setLoading(true);
            try {
                activity = await agent.Activities.details(id);
                runInAction(()=>{
                    this.setActivity(activity!);
                    this.selectedActivity = activity;
                    this.setLoading(false);
                })
                return activity;
            } catch (error) {
                runInAction(()=>{
                    this.setLoading(false);
                })
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityMap.get(id);
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if(user) {
            activity.isGoing = activity.attendees?.some(a => a.userName === user.userName);
            activity.isHost = activity.hostUsername === user.userName;
            activity.host = activity.attendees?.find(a => a.userName === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityMap.set(activity.id, activity);
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(()=>{
                this.selectedActivity = newActivity;
            })
        } catch (err) {
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                if(activity.id) {
                    const updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityMap.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (err) {
        }
    }

    deleteActivity =async (id:string) => {
        this.buttonLoader = true;
        try{
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityMap.delete(id);
                this.buttonLoader = false;
            })
        } catch (err) {
            runInAction(()=>{
                this.buttonLoader = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.buttonLoader = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id)
            runInAction(()=>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.userName !== user?.userName);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityMap.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch(error) {
            console.log(error);
        } finally {
            runInAction(()=>{
                this.buttonLoader = false;
            })
        }
    }

    cancelActivityToggle = async () => {
        this.buttonLoader = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=> {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityMap.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch(error) {

        } finally{
            runInAction(()=> {
                this.buttonLoader = false;
            })
        }
    }
}