import { PageHeader, Descriptions, Row, Tag, Table, Button, Modal } from 'antd';
import React from 'react';
import Request from '../../utils/Request';
import { getReport, getExecDetail } from '../../api/ApiConfig';
import { Chart, Axis, Interval, Coordinate, Tooltip } from 'bizcharts';
import { SortOrder } from 'antd/lib/table/interface';

export interface CaseRecord {
    caseId: number,
    caseName: string,
    description: string,
    duration: number,
    status: string,
}

export interface ReportData{
    projectId: number,
    projectName: string,
    description: string,
    startTime: string,
    status: string,
    caseList: CaseRecord[],
}

interface ReportState{
    dataSource: ReportData,
}

interface ReportProp {
    match: any,
}

class Report extends React.Component<ReportProp, ReportState> {

    componentDidMount(){
        const { params } = this.props.match;
        Request({
            url: getReport.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            },
        }, (res) => {
            this.setState({
                dataSource: res.data.data,
            });
        }, {
            projectId: params.id,
        });
    };

    handleDetail = (record: any) => {
        const { params } = this.props.match;
        let payload = {
            projectId: params.id,
            caseId: record.caseId,
        };

        Request({
            url: getExecDetail.path,
            method: 'post',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
                "Content-Type": "application/json; charset=utf-8",
            },
            data: payload,
        }, (res) => {
            let data = res.data.data;
            Modal.info({
                content: (
                    <div>
                        <Descriptions title="Request" column={1}>
                            <Descriptions.Item label='URL'>{data.url}</Descriptions.Item>
                            <Descriptions.Item label='Method'>{data.method}</Descriptions.Item>
                            <Descriptions.Item label='Headers'>{data.requestHeaders}</Descriptions.Item>
                            <Descriptions.Item label='Body'>{data.requestBody}</Descriptions.Item>
                        </Descriptions>
                        <Descriptions title='Response' column={1}>
                            <Descriptions.Item label='Headers'>{data.responseHeaders}</Descriptions.Item>
                            <Descriptions.Item label='Body'>{data.responseBody}</Descriptions.Item>
                            <Descriptions.Item label='断言日志'>{data.message}</Descriptions.Item>
                            <Descriptions.Item label='执行状态'>{data.status}</Descriptions.Item>
                            <Descriptions.Item label='开始时间'>{data.startTime}</Descriptions.Item>
                            <Descriptions.Item label='执行时间(ms)'>{data.duration}</Descriptions.Item>
                        </Descriptions>
                    </div>
                ),
                title: '案例详情',
            });
        });
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
            title: '运行时间',
            dataIndex: 'duration',
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
                        color = 'default';
                        break;
                }
                return (
                    <Tag color={color} key={status}>{status}</Tag>
                )
            },
            filters: [
                {
                    text: 'Pass',
                    value: 'Pass',
                },
                {
                    text: 'Fail',
                    value: 'Fail',
                },
                {
                    text: 'Block',
                    value: 'Block',
                },
            ],
            onFilter: (value: any, record: any) => record.status === value,
            sorter: (a: any, b: any) => {
                // console.log(a,b);
                if(a.status > b.status){
                    return 1;
                }else if(a.status < b.status){
                    return -1;
                }else {
                    return 0;
                }
            },
            sortDirections: ['descend', 'ascend'] as SortOrder[],
        },
        {
            title: '操作',
            render: (text: string, record: any) => {
                return(
                    <Button size='small' type='primary' onClick={() => this.handleDetail(record)}>详情</Button>
                );
            }
        }
    ];

    render() {
        let projectName = this.state !== null && this.state.dataSource !== null ? this.state.dataSource.projectName : null;
        let projDesc = this.state !== null && this.state.dataSource !== null ? this.state.dataSource.description : null;
        let startTime = this.state !== null && this.state.dataSource !== null ? this.state.dataSource.startTime : null;
        let status = this.state !== null && this.state.dataSource !== null ? this.state.dataSource.status : 'Ready';
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

        let caseNum: number = 0;
        let casePass: number = 0;
        let caseFail: number = 0;
        let caseBlock: number = 0;

        if(this.state !== null && this.state.dataSource !== null && this.state.dataSource.caseList !== null){
            caseNum = this.state.dataSource.caseList.length;
            this.state.dataSource.caseList.forEach((item: CaseRecord) => {
                if(item.status === 'Pass'){
                    casePass++;
                } else if(item.status === 'Fail') {
                    caseFail++;
                } else if(item.status === 'Block') {
                    caseBlock++;
                }
            });
        }

        let pieData = [
            { item: '通过案例数', data: casePass, },
            { item: '失败案例数', data: caseFail, },
            { item: '阻塞案例数', data: caseBlock, },
        ];

        return(
            <div>
                <PageHeader title='测试报告' />
                {/* 基本信息 */}
                <Row gutter={16}>
                    <Descriptions title='基本信息' bordered style={{width: '100%'}}>
                        <Descriptions.Item span={3} label='项目名称'>{projectName}</Descriptions.Item>
                        <Descriptions.Item span={3} label='项目描述'>{projDesc}</Descriptions.Item>
                        <Descriptions.Item label='执行开始时间'>{startTime}</Descriptions.Item>
                        <Descriptions.Item span={2} label='执行状态'>
                            <Tag color={color} key={status}>{status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label='案例总数'>{caseNum}</Descriptions.Item>
                        <Descriptions.Item label='案例通过数'>{casePass}</Descriptions.Item>
                        <Descriptions.Item label='案例失败数'>{caseFail}</Descriptions.Item>
                        <Descriptions.Item label='案例阻塞数'>{caseBlock}</Descriptions.Item>
                    </Descriptions>
                </Row>
                {/* 图 */}
                <Row gutter={16} style={{marginTop: 24}}>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}>案例状态分布图</div>
                    <Chart height={400} data={pieData} autoFit interactions={['element-single-selected']}>
                        <Coordinate type='theta' radius={0.75} />
                        <Tooltip showTitle={false} />
                        <Axis visible={false} />
                        <Interval 
                            position="data" 
                            adjust="stack" 
                            color='item' 
                            style={{
                                lineWidth: 1, 
                                stroke: '#fff'
                            }} 
                            label={
                                ['*', {
                                    content: (data) => {
                                        return `${data.item}: ${data.data}`;
                                    }
                                }]
                            }
                        />
                    </Chart> 
                </Row>
                {/* 案例列表 */}
                <Row gutter={16} style={{marginTop: 24}}>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}>案例列表</div>
                    <Table
                        style={{width: '100%'}}
                        columns={this.columns}
                        dataSource={this.state !== null && this.state.dataSource !== null ? this.state.dataSource.caseList : undefined}
                    />
                </Row>
            </div>
        );
    }
}

export default Report;