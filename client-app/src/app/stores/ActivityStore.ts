import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

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
        return Array.from(this.activityMap.values()).sort((a, b)=>Date.parse(a.date) - Date.parse(b.date))
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
        if(activity) this.selectedActivity = activity
        else{
            this.setLoading(true);
            try {
                activity = await agent.Activities.details(id);
                runInAction(()=>{
                    this.setActivity(activity);
                    this.setLoading(false);
                    this.selectedActivity = activity;
                })
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

    private setActivity = (activity: Activity | undefined) => {
        if(activity) {
            activity.date = activity.date.split('T')[0];
            this.activityMap.set(activity.id, activity);
        }
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    createActivity = async (activity: Activity) => {
        this.buttonLoader = true;
        activity.id=uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityMap.set(activity.id, activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.buttonLoader = false;
            })
        } catch (err) {
            runInAction(()=>{
                this.buttonLoader = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.buttonLoader = true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activityMap.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.buttonLoader = false;
            })
        } catch (err) {
            runInAction(()=>{
                this.buttonLoader = false;
            })
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
}