import React from 'react';
import { PageHeader, Row, Button, Table, Tag, Space, Modal } from 'antd';
import Request from '../../utils/Request';
import { projectDetail, caseList, caseSuiteUpdate } from '../../api/ApiConfig';

interface DetailProp {
    match: any,
};

interface DetailState {
    projectDetail: any,
    isShow: boolean,
};

interface CaseSuiteState {
    caseListData: [],
    selectedRows: number[],
};

interface CaseSuiteProp {
    visible: boolean,
    projectId: number,
    initSelectedRows: number[],
    handleToggle: () => any,
};

class CaseSuite extends React.Component<CaseSuiteProp, CaseSuiteState> {
    selectedRows: number[] = [];

    constructor(props: CaseSuiteProp){
        super(props);

        Request({
            url: caseList.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            },
        }, (res) => {
            this.setState({
                caseListData: res.data.data,
            });
        });
    };

    componentWillReceiveProps(){
        this.selectedRows = this.props.initSelectedRows;
    }

    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    };

    handleOk = (e: any) => {
        let payload = this.selectedRows;
        Request({
            url: caseSuiteUpdate.path,
            method: 'post',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
                "Content-Type": "application/json; charset=utf-8",
            },
            data: payload,
        }, (res) => {
            this.props.handleToggle();
        }, {
            projectId: this.props.projectId,
        });
    };

    rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            this.selectedRows = selectedRowKeys;
            this.setState({
                selectedRows: this.selectedRows,
            });
        },
    };

    columns = [
        {
            title: '案例名称',
            dataIndex: 'caseName',
        },
        {
            title: '案例描述',
            dataIndex: 'description',
        },
    ];

    render() {
        return (
            <Modal
                title="编辑案例集"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.handleToggle}
                destroyOnClose={true}
            >
                <Table 
                    style={{width: '100%'}}
                    columns={this.columns}
                    dataSource={this.state?.caseListData}
                    rowKey='caseId'
                    rowSelection={{
                        type: 'checkbox',
                        ...this.rowSelection,
                        selectedRowKeys: this.selectedRows,
                    }}
                />
            </Modal>
        );
    }
}

class ProjectDetail extends React.Component<DetailProp, DetailState> {

    selectedRows: number[] = [];

    constructor(props: DetailProp){
        super(props);
        this.state = {
            projectDetail,
            isShow: false,
        };
    }

    componentDidMount() {
        const { params } = this.props.match;
        this.getDetail(params.id);
    };

    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    };

    getDetail = (id: number) => {
        Request({
            url: projectDetail.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            },
        }, (res) => {
            this.setState({
                projectDetail: res.data.data,
            });
            this.selectedRows = [];
            res.data.data.caseList.forEach((item: any, index: number) => {
                this.selectedRows.push(item.caseId);
            });
        }, {id: id,})
    };

    handleToggle = () => {
        const { params } = this.props.match;
        this.setState({
            isShow: !this.state.isShow,
        });
        this.getDetail(params.id);
    };

    columns = [
        {
            title: '案例名称',
            dataIndex: 'caseName',
        },
        {
            title: '案例描述',
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
                    case 'Block':
                        color = 'geekblue';
                        break;
                    case 'Initial':
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
                    <Space size="middle">
                        <Button size="small" type="primary">运行</Button>
                    </Space>
                );
            },
        },
    ];

    render() {
        const projectDetailInfo = this.state?.projectDetail;
        
        return(
            <div>
                <PageHeader title={projectDetail == null ? null : projectDetailInfo.projectName} />
                <Row gutter={[16, 24]} justify='end'>
                    <Button type='primary' onClick={this.handleToggle} >编辑案例集</Button>
                </Row>
                <Row gutter={[16, 24]} justify='center' style={{marginTop: 16}}>
                    <Table
                        style={{width: '100%'}}
                        columns={this.columns}
                        dataSource={projectDetailInfo.caseList}
                        rowKey='caseId'
                    />
                </Row>
                <CaseSuite 
                    visible={this.state.isShow}
                    initSelectedRows={this.selectedRows}
                    handleToggle={this.handleToggle}
                    projectId={projectDetailInfo.projectId}
                />
            </div>
        );
    }
}

export default ProjectDetail;