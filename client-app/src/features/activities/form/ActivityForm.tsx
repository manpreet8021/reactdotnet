import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoaderComponent from "../../../app/layout/LoaderComponent";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {id} = useParams();
    const navigation = useNavigate();
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        description:'',
        category:'',
        date:'',
        city:'',
        venue:''
    });

    useEffect(()=>{
        if(id) activityStore.loadActivity(id).then(activity => setActivity(activity!));
    }, [id, activityStore])

    function handleOnChange(event:ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setActivity({...activity, [name]: value})
    }

    function handleSubmit() {
        if(activity.id !== "") {
            activityStore.updateActivity(activity).then(() => {navigation(`/activities/${activity.id}`)})
        } else {
            activity.id = uuid();
            activityStore.createActivity(activity).then(()=>{navigation(`/activities/${activity.id}`)});
        }
    }

    return (
        <>
            {
                activityStore.loading ? <LoaderComponent /> :
                <Segment clearing>
                    <Form onSubmit={handleSubmit} autoComplete='off'>
                        <Form.Input placeholder='Title' value={activity?.title} name="title" onChange={handleOnChange}/>
                        <Form.Input placeholder='Description' value={activity?.description} name="description" onChange={handleOnChange}/>
                        <Form.Input placeholder='category' value={activity?.category} name="category" onChange={handleOnChange}/>
                        <Form.Input placeholder='Date' type="date" value={activity?.date} name="date" onChange={handleOnChange}/>
                        <Form.Input placeholder='City' value={activity?.city} name="city" onChange={handleOnChange}/>
                        <Form.Input placeholder='Venue' value={activity?.venue} name="venue" onChange={handleOnChange}/>
                        <Button loading={activityStore.buttonLoader} floated="right" positive type="submit" content='Submit' />
                        <Button as={Link} to='/activities' floated="right" type="button" content='Cancel'/>
                    </Form>
                </Segment>
            }
        </>
    )
})