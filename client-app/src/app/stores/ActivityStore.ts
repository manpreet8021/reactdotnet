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

    loadActivity = async() => {
        this.setLoading(true)
        try {
            const activities = await agent.Activities.list();
            runInAction(()=>{
                activities.map((element: Activity) => {
                    element.date = element.date.split('T')[0];
                    this.activityMap.set(element.id, element);
                });
                this.setLoading(false);
            })
        } catch (err) {
            runInAction(()=>{
                this.setLoading(false);
            })
        }
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityMap.get(id);
        this.editMode = false;
    }

    cancelActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
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
                if(this.selectedActivity?.id === id) this.cancelActivity();
            })
        } catch (err) {
            runInAction(()=>{
                this.buttonLoader = false;
            })
        }
    }
}