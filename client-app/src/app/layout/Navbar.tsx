import { Button, Container, Dropdown, Image, Menu } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";

export default observer(function Navbar() {
    const {userStore:{user, logOut}} = useStore();
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={Link} to='/' header>
                    <img src="/assets/logo.png" alt="logo"/>
                    Reactivity
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities" />
                <Menu.Item as={NavLink} to='/error' name="Errors" />
                <Menu.Item>
                    <Button positive content="Create Activity" as={NavLink} to="/createActivity" />
                </Menu.Item>
                <Menu.Item position="right">
                    <Image src={user?.image || 'assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text='My Profile' icon='user'/>
                            <Dropdown.Item onClick={logOut} text='LogOut' icon='power'/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    );
})