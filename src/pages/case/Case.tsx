import React from 'react';
import { PageHeader, Row, Card, Button, Table, Space, Form, Input, Modal, Select, Descriptions } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { caseList, caseAdd, caseRemove, caseModify, runDebug } from '../../api/ApiConfig';
import Request from '../../utils/Request';
import DynamicInputGroup from '../../components/DynamicInputGroup';

interface CaseState {
    caseListData: [],
    isShow: boolean,
};

interface Header {
    name: string,
    value: string,
};

interface Assertion {
    actual: string,
    op: string,
    expected: string,
};

interface CaseInfoRecord {
    caseId: number,
    caseName: string,
    description: string,
    url: string,
    method: string,
    headers: Header[],
    body: string,
    assertions: Assertion[],
};

interface CaseInfoProp {
    visible: boolean,
    caseData: CaseInfoRecord,
    handleToggle: () => any,
};

interface CaseInfoState {
    headerNumber: number,
    assertionNumber: number,
};

class CaseDetail extends React.Component<CaseInfoProp, CaseInfoState> {
    formRef = React.createRef<FormInstance>();

    constructor(props: CaseInfoProp) {
        super(props);
        this.state = {
            headerNumber: 0,
            assertionNumber: 0,
        };
    };

    static getDerivedStateFromProps(props: CaseInfoProp, state: CaseInfoState){
        return {
            headerNumber: props.caseData?.headers.length,
            assertionNumber: props.caseData?.assertions.length,
        }
    }

    handleOk = (e: any) => {
        let payload: CaseInfoRecord = {
            caseId: this.props.caseData.caseId,
            caseName: this.formRef.current?.getFieldValue("caseName"),
            description: this.formRef.current?.getFieldValue("description"),
            url: this.formRef.current?.getFieldValue("url"),
            method: this.formRef.current?.getFieldValue("method"),
            headers: this.props.caseData.headers,
            body: this.formRef.current?.getFieldValue("body"),
            assertions: this.props.caseData.assertions,
        };
        let url: string = payload.caseId !== -1 ? caseModify.path : caseAdd.path;
        Request({
            url,
            method: 'post',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
                "Content-Type": "application/json; charset=utf-8",
            },
            data: payload,
        }, (res) => {
            this.props.handleToggle();
        });
    };

    handleAddHeader = () => {
        this.props.caseData.headers.push({
            name: "",
            value: "",
        });
        this.setState({
            headerNumber: this.state.headerNumber + 1,
        });
    };

    handleRemoveHeader = () => {
        this.setState({
            headerNumber: this.state.headerNumber - 1,
        });
    };

    handleAddAssertion = () => {
        this.props.caseData.assertions.push({
            actual: "",
            op: "",
            expected: "",
        });
        this.setState({
            assertionNumber: this.state.assertionNumber + 1,
        });
    };

    handleRemoveAssertion = () => {
        this.setState({
            assertionNumber: this.state.assertionNumber - 1,
        });
    };

    handleDebug = () => {
        let payload: CaseInfoRecord = {
            caseId: this.props.caseData.caseId,
            caseName: this.formRef.current?.getFieldValue("caseName"),
            description: this.formRef.current?.getFieldValue("description"),
            url: this.formRef.current?.getFieldValue("url"),
            method: this.formRef.current?.getFieldValue("method"),
            headers: this.props.caseData.headers,
            body: this.formRef.current?.getFieldValue("body"),
            assertions: this.props.caseData.assertions,
        };
        Request({
            url: runDebug.path,
            method: 'post',
            headers: {
                "Content-Type": 'application/json; charset=UTF-8',
                "Access-Token": sessionStorage.getItem("token"),
            },
            data: payload,
        }, (res) => {
            console.log(res.data.data);
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
                title: '调试结果',
            });
        });
    };

    render() {
        const { caseData } = this.props;
        return (
            <Modal
                title='用例详情'
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.handleToggle}
                destroyOnClose={true}
                width={900}
            >
                <Form ref={this.formRef} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                    <Form.Item label="用例名称" name="caseName" initialValue={caseData.caseName} >
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="描述" name="description" initialValue={caseData.description} >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="URL" name="url" initialValue={caseData.url} >
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="Method" name="method" initialValue={caseData.method} >
                        <Select>
                            <Select.Option value="GET">GET</Select.Option>
                            <Select.Option value="POST">POST</Select.Option>
                            <Select.Option value="PUT">PUT</Select.Option>
                            <Select.Option value="DELETE">DELETE</Select.Option>
                        </Select>
                    </Form.Item>
                    <DynamicInputGroup 
                        formRef={this.formRef}
                        title="Headers"
                        data={caseData.headers}
                        handleAdd={this.handleAddHeader}
                        handleRemove={this.handleRemoveHeader}
                    />
                    <Form.Item label="Body" name="body" initialValue={caseData.body} style={{marginTop: 20}} >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    {/* Assertions: 自定义控件 */}
                    <DynamicInputGroup 
                        formRef={this.formRef}
                        title="Assertions"
                        data={caseData.assertions}
                        handleAdd={this.handleAddAssertion}
                        handleRemove={this.handleRemoveAssertion}
                    />
                </Form>
                <div style={{textAlign: 'end', marginTop: 10}}>
                    <Button type='default' onClick={this.handleDebug}>调试</Button>
                </div>
                
            </Modal>
        );
    };
}

class Case extends React.Component<{}, CaseState>{

    formRef = React.createRef<FormInstance>();

    caseData: CaseInfoRecord = {
        caseId: -1,
        caseName: "",
        description: "",
        url: "",
        method: "GET",
        headers: [],
        body: "",
        assertions: [],
    };

    constructor(props: {}){
        super(props);
        this.state = {
            caseListData: [],
            isShow: false,
        };
    };

    initCaseData(){
        this.caseData = {
            caseId: -1,
            caseName: "",
            description: "",
            url: "",
            method: "GET",
            headers: [],
            body: "",
            assertions: [],
        };
    }

    componentDidMount() {
        this.getCases();
    }

    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    }

    getCases = (key? : string) => {
        Request({
            url: caseList.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            },
            params: {
                key,
            },
        }, (res) => {
            this.setState({
                caseListData: res.data.data,
            });
        })
    };

    handleToggle = () => {
        this.setState({
            isShow: !this.state.isShow,
        });
        this.getCases();
    };

    handleAdd = () => {
        this.initCaseData();
        this.handleToggle();
    };

    handleEdit = (record: any) => {
        this.caseData = {
            ...record,
        };
        this.handleToggle();
    };

    handleDelete = (record: any) => {
        Modal.confirm({
            content: "确定删除该用例？",
            onOk: () => {
                Request({
                    url: caseRemove.path,
                    method: 'delete',
                    headers: {
                        "Access-Token": sessionStorage.getItem("token"),
                    }
                }, (res) => {
                    this.getCases();
                }, {
                    id: record.caseId,
                });
            }
        })
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'caseName',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '操作',
            render: (text: string, record: any) => {
                return (
                    <Space size='middle'>
                        <Button size='small' type='primary' onClick={() => this.handleEdit(record)}>编辑</Button>
                        <Button size='small' danger onClick={() => this.handleDelete(record)}>删除</Button>
                    </Space>
                );
            },
        }
    ]

    render(){
        return(
            <div>
                <PageHeader title="用例列表" />
                <Card>
                    <Form ref={this.formRef} layout='inline'>
                        <Form.Item label='关键字' name='keyword'>
                            <Input placeholder='请输入搜素关键字' />
                        </Form.Item>
                        <Button type='primary' onClick={() => this.getCases(this.formRef.current?.getFieldValue('keyword'))}>搜索</Button>
                    </Form>
                </Card>
                <Card style={{marginTop: 16}}>
                    <Row gutter={[16, 24]} justify='end'>
                        <Button type='primary' onClick={this.handleAdd} >添加用例</Button>
                    </Row>
                    <Row gutter={[16, 24]} justify='center' style={{marginTop: 16}}>
                        <Table
                            style={{width: '100%'}}
                            columns={this.columns}
                            dataSource={this.state?.caseListData}
                            rowKey='caseId'
                        />
                    </Row>
                </Card>
                <CaseDetail
                    visible={this.state.isShow}
                    caseData={this.caseData}
                    handleToggle={this.handleToggle}
                />
            </div>
        );
    }
}

export default Case;