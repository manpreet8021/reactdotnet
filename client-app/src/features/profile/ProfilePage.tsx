import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import LoaderComponent from "../../app/layout/LoaderComponent";
import { useEffect } from "react";

export default observer(function ProfilePage() {
    const {username} = useParams<{username: string}>();
    const {profileStore} = useStore();

    useEffect(()=>{
        if(username)
            profileStore.loadProfile(username);
    }, [username, profileStore.loadProfile])

    return(
        <>
            {profileStore.loadingProfile ? <LoaderComponent content="Loading profile" /> : 
                <Grid>
                    <Grid.Column width={16}>
                        {profileStore.profile &&
                            <>
                                <ProfileHeader profile={profileStore.profile}/>
                                <ProfileContent profile={profileStore.profile}/>
                            </>
                        }
                    </Grid.Column>
                </Grid>
            }
        </>
    )
})