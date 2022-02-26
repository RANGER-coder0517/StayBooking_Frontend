import { Layout, Dropdown, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import HostHomePage from "./components/HostHomePage";
import GuestHomePage from "./components/GuestHomePage";
 
// deconstructure of Layout;
// equals to:
// const Header = Layout.Header;
// const Content = Layout.Content;
const { Header, Content } = Layout;
 
// the variable 'authed' should be positioned in the component at the highest level because it is a global variable that will be used by all other components;
// the similar condition for the variable 'asHost';
class App extends React.Component {
  state = {
    authed: false,
    asHost: false,
  };
 
  // componentDidMount happens at the end of the first component life cycle - mounting stage, we can put some actions in it to fulfil some other customized functions;
  // localStorage is the place where web stores some data, it is in the form of key map; first, it has more access authorities than cookie; second, it has larger storage volume for more than 1Mb; third, it will not be cleaned after closing the tab or the browser;
  // another place for web browser to store data is the cookie, its space volume is very small comparing with the localStorage;
  // in token-based authentication, cookie maintains the token sent from the backend; and the flag http-only is set as true, which means it cannot be read or writen by JavaScript; this measurement could prevent the CSRF (Cross-Site Request Forgery);
  // but in this project, we don't need to care about CSRF, so we have the localStorage get the token and use it to fulfil other features;
  // in session-based authentication, cookie stores the session ID in the response from the beckend;
  componentDidMount() {
    const authToken = localStorage.getItem("authToken");
    const asHost = localStorage.getItem("asHost") === "true";
    this.setState({
      authed: authToken !== null,
      asHost,
    });
  }
 
  handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };
 
  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };
 
  // for those components with complex content, we should extract them out from the JSX module; in this project, the component 'Content' is suitable for this idea;
  // to avoid verbose if-else expressions, we should return result as soon as possible after making the final judgement instead of returning the result at last;
  renderContent = () => {
    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />;
    }
 
    if (this.state.asHost) {
      return <HostHomePage />;
    }
 
    return <GuestHomePage />;
  };
 
  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );
  
  // Dropdown: provided by antd, it pops out a downward list displaying the content in the object 'overlay';
  // the component Content has the characteristic of complexity, so it should be extracted out as a function;
  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
            Stays Booking
          </div>
          {this.state.authed && (
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content
          style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}
        >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}
 
export default App;