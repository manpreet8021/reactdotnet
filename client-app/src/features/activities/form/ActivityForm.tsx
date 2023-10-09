import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity, ActivityFormValues } from "../../../app/models/activity";
import LoaderComponent from "../../../app/layout/LoaderComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MytextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { CategoryOption } from "../../../app/common/options/CategoryOption";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {id} = useParams();
    const navigation = useNavigate();
    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required(),
        description: Yup.string().required(),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

    useEffect(()=>{
        if(id) activityStore.loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, activityStore]);

    function handleSubmit(activity: ActivityFormValues) {
        if(!activity.id) {
            console.log("here");
            let newActivity = {
                ...activity, id: uuid()
            }
            activityStore.createActivity(newActivity).then(() => {navigation(`/activities/${newActivity.id}`)})
        } else {
            activityStore.updateActivity(activity).then(()=>{navigation(`/activities/${activity.id}`)});
        }
    }

    return (
        <>
            {
                activityStore.loading ? <LoaderComponent /> :
                <Segment clearing>
                    <Header content='Activity Details' sub color="teal" />
                    <Formik enableReinitialize initialValues={activity} onSubmit={values => handleSubmit(values)} validationSchema={validationSchema}>
                        {({ handleSubmit, isSubmitting, dirty, isValid }) => (
                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                <MyTextInput name='title' placeholder="Title" /> 
                                <MyTextArea rows={3} placeholder='Description' name="description"/>
                                <MySelectInput options={CategoryOption} placeholder='category' name="category"/>
                                <MyDateInput placeholderText='Date' name="date" showTimeSelect timeCaption="time" dateFormat='MMMM d, yyyy h:mm aa'/>
                                <Header content='Location Details' sub color="teal" />
                                <MyTextInput placeholder='City' name="city"/>
                                <MyTextInput placeholder='Venue' name="venue"/>
                                <Button 
                                    disabled={isSubmitting || !dirty || !isValid}
                                    loading={isSubmitting} floated="right" positive type="submit" content='Submit' />
                                <Button as={Link} to='/activities' floated="right" type="button" content='Cancel'/>
                            </Form>
                        )}
                    </Formik>
                    
                </Segment>
            }
        </>
    )
})