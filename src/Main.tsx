import React from 'react';
import { Layout } from 'antd';
import SideBar from './base/SideBar';
import { Route, Redirect } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined, } from '@ant-design/icons';
import './Main.css';

import Dashboard from './pages/dashboard/Dashboard';
import Project from './pages/project/Project';
import Case from './pages/case/Case';
import ProjectDetail from './pages/projectDetail/ProjectDetail';
import Report from './pages/report/Report';

class Main extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }



    render() {
        return (
            <Layout>
                <SideBar collapsed={this.state.collapsed} />
                <Layout className="site-layout" >
                    <Layout.Header className="site-layout-background" style={{ padding: 0 }}>
                        {
                            React.createElement(
                                this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                                {
                                    className: 'trigger',
                                    onClick: this.toggle,
                                }
                            )
                        }
                    </Layout.Header>
                    <Layout.Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 500,
                        }}
                    >
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/project" component={Project} />
                        <Route path="/projectDetail/:id/detail" component={ProjectDetail} />
                        <Route path="/report/:id" component={Report} />
                        <Route path="/case" component={Case} />
                        <Redirect from='/' to='/dashboard' />
                    </Layout.Content>
                </Layout>
            </Layout>
        )
    }
}

export default Main;