import { Button, Container, Menu } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={Link} to='/' header>
                    <img src="/assets/logo.png" alt="logo"/>
                    Reactivity
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities" />
                <Menu.Item>
                    <Button positive content="Create Activity" as={NavLink} to="/createActivity" />
                </Menu.Item>
            </Container>
        </Menu>
    );
}