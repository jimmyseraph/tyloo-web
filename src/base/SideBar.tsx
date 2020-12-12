import React from 'react';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { PieChartOutlined, DesktopOutlined, GoldOutlined } from '@ant-design/icons';
import './SideBar.css';

class SideBar extends React.Component<{collapsed: boolean}, {}> {
    render() {
        return (
            <Layout.Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className='logo' />
                <Menu
                    defaultSelectedKeys={['1']}
                    mode='inline'
                    theme="dark"
                >
                    <Menu.Item key="1" icon={<PieChartOutlined />} className="menu_item">
                        <Link to='/dashboard'>Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined />} className="menu_item">
                        <Link to='/project'>Project</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<GoldOutlined />} className="menu_item">
                        <Link to='/case'>Case</Link>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
        );
    }
}

export default SideBar;