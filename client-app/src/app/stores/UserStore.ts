import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Router";

export default class UserStore {
    user: User | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    get isLoggedInUser() {
        return !!this.user;
    }

    login = async(creds: UserFormValues) => {
        var user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        runInAction(()=>{
            this.user = user;
        })
        store.modalStore.closeModal();
        router.navigate('/activities');
    }

    register = async(creds: UserFormValues) => {
        var user = await agent.Account.register(creds);
        store.commonStore.setToken(user.token);
        runInAction(()=>{
            this.user = user;
        })
        store.modalStore.closeModal();
        router.navigate('/activities');
    }

    logOut = () => {
        this.user = null;
        store.commonStore.setToken(null);
        router.navigate('/');
    }

    getUser = async() => {
        try {
            const user = await agent.Account.current();
            runInAction(()=>this.user = user)
        } catch (error) {
            console.log(error);
        }
    }
}