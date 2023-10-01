import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function ActivityForm() {

    const {activityStore} = useStore();

    const initialState = activityStore.selectedActivity ?? {
        id: '',
        title: '',
        description:'',
        category:'',
        date:'',
        city:'',
        venue:''
    }

    const [activity, setActivity] = useState(initialState);

    function handleOnChange(event:ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setActivity({...activity, [name]: value})
    }

    function handleSubmit() {
        activity.id !== "" ? activityStore.updateActivity(activity) : activityStore.createActivity(activity);
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity?.title} name="title" onChange={handleOnChange}/>
                <Form.Input placeholder='Description' value={activity?.description} name="description" onChange={handleOnChange}/>
                <Form.Input placeholder='category' value={activity?.category} name="category" onChange={handleOnChange}/>
                <Form.Input placeholder='Date' type="date" value={activity?.date} name="date" onChange={handleOnChange}/>
                <Form.Input placeholder='City' value={activity?.city} name="city" onChange={handleOnChange}/>
                <Form.Input placeholder='Venue' value={activity?.venue} name="venue" onChange={handleOnChange}/>
                <Button loading={activityStore.buttonLoader} floated="right" positive type="submit" content='Submit' />
                <Button floated="right" type="button" content='Cancel' onClick={activityStore.closeForm}/>
            </Form>
        </Segment>
    )
})