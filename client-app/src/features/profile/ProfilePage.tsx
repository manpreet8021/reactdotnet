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
    const {profileStore:{loadProfile,profile,loadingProfile}} = useStore();

    useEffect(()=>{
        if(username)
            loadProfile(username);
    }, [username, loadProfile])

    return(
        <>
            {loadingProfile ? <LoaderComponent content="Loading profile" /> : 
                <Grid>
                    <Grid.Column width={16}>
                        {profile &&
                            <>
                                <ProfileHeader profile={profile}/>
                                <ProfileContent profile={profile}/>
                            </>
                        }
                    </Grid.Column>
                </Grid>
            }
        </>
    )
})