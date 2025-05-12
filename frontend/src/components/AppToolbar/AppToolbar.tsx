import {Container, Navbar} from "react-bootstrap";

const AppToolbar = () => {
    return (
        <Navbar style={{backgroundColor: '#808080'}}>
            <Container>
                <Navbar.Brand
                    href="#home"
                    style={{color: 'white'}}
                >Drawing</Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default AppToolbar;