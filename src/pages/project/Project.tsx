import React from 'react';
import { PageHeader, Row, Button, Table, Tag, Space, Form, Input, Modal } from 'antd';
import Request from '../../utils/Request';
import { projectList, projectAdd, projectModify, projectRemove, projectExecute } from '../../api/ApiConfig';
import { FormInstance } from 'antd/lib/form';
import { Link } from 'react-router-dom';

interface ProjectState {
    projectListData: [],
    isShow: boolean,
};

interface ProjectRecord {
    projectId: number,
    projectName: string,
    description: string,
    status: string,
};

interface ProjectInfoProp {
    projectData: ProjectRecord,
    visible: boolean,
    handleToggle: () => any,
}

class ProjectInfo extends React.Component<ProjectInfoProp, {}> {
    formRef = React.createRef<FormInstance>();

    handleOk = (e: any) => {
        let projectName = this.formRef.current?.getFieldValue("projectName");
        let description = this.formRef.current?.getFieldValue("description");
        let projectId = this.props.projectData.projectId;
        let payload = {
            projectId,
            projectName,
            description,
        };
        if(projectId !== -1){
            Request({
                url: projectModify.path,
                method: 'post',
                headers: {
                    "Access-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json; charset=utf-8",
                },
                data: payload,
            }, (res) => {
                this.props.handleToggle();
            });
        } else {
            Request({
                url: projectAdd.path,
                method: 'post',
                headers: {
                    "Access-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json; charset=utf-8",
                },
                data: payload,
            }, (res) => {
                this.props.handleToggle();
            });
        }
    }

    render(){
        return (
            <Modal
                title="项目信息"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.handleToggle}
                destroyOnClose={true}
            >
                <Form ref={this.formRef}>
                    <Form.Item label="项目名称" name='projectName' initialValue={this.props.projectData.projectName}>
                        <Input placeholder='请输入项目名称' />
                    </Form.Item>
                    <Form.Item label="描述" name='description' initialValue={this.props.projectData.description}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

class Project extends React.Component<{}, ProjectState>{

    projectData: ProjectRecord = {
        projectId: -1,
        projectName: "",
        description: "",
        status: 'Ready',
    };

    constructor(props: {}){
        super(props);
        this.state = {
            projectListData: [],
            isShow: false,
        };
    };

    initProjectData(){
        this.projectData = {
            projectId: -1,
            projectName: "",
            description: "",
            status: "Ready",
        };
    }

    componentDidMount() {
        this.getProjects();
    }

    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    }

    getProjects = () => {
        Request({
            url: projectList.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            },
        }, (res) => {
            this.setState({
                projectListData: res.data.data,
            });
        })
    };


    handleToggle = () => {
        this.setState({
            isShow: !this.state.isShow,
        });
        this.getProjects();
    };

    handleAdd = () => {
        this.initProjectData();
        this.handleToggle();
    };

    handleEdit = (record: any) => {
        this.projectData = {
            ...record,
        };
        this.handleToggle();
    };

    handleDelete = (record: any) => {
        Modal.confirm({
            content: '确定删除该项目？',
            onOk: () => {
                Request({
                    url: projectRemove.path,
                    method: 'delete',
                    headers: {
                        "Access-Token": sessionStorage.getItem("token"),
                    },
                }, (res) => {
                    this.getProjects();
                }, {
                    id: record.projectId,
                });
            },
        });
    };

    handleExecute = (record: any) => {
        Request({
            url: projectExecute.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            },
        }, (res) => {
            this.getProjects();
        }, {
            id: record.projectId,
        });
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'projectName',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status: string) => {
                let color: string = 'default';
                switch(status){
                    case 'Pass':
                        color = 'success';
                        break;
                    case 'Fail':
                        color = 'error';
                        break;
                    case 'Running':
                        color = 'geekblue';
                        break;
                    case 'Ready':
                        color = 'default';
                        break;
                }
                return (
                    <Tag color={color} key={status}>{status}</Tag>
                )
            },
        },
        {
            title: '操作',
            render: (text: string, record: any) => {
                return (
                    <Space size='middle'>
                        <Button size='small' type='primary' onClick={() => this.handleEdit(record)}>编辑</Button>
                        <Button size='small' type='primary' onClick={() => this.handleExecute(record)}>运行</Button>
                        <Button size='small' danger onClick={() => this.handleDelete(record)} >删除</Button>
                        <Link to={{
                            pathname: `/projectDetail/${record.projectId}/detail`,
                        }}>详情</Link>
                        <Link to={{
                            pathname: `/report/${record.projectId}`,
                        }} >查看测试报告</Link>
                    </Space>
                );
            }
        }
    ];

    render(){
        return(
            <div>
                <PageHeader title="项目列表" />
                <Row gutter={[16, 24]} justify='end'>
                    <Button type='primary' onClick={this.handleAdd} >添加项目</Button>
                </Row>
                <Row gutter={[16, 24]} justify='center' style={{marginTop: 16}}>
                    <Table
                        style={{width: '100%'}}
                        columns={this.columns}
                        dataSource={this.state?.projectListData}
                        rowKey='projectId'
                    />
                </Row>
                <ProjectInfo
                    projectData={this.projectData}
                    visible={this.state.isShow}
                    handleToggle={this.handleToggle}
                />
            </div>
        );
    }
}

export default Project;