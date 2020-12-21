import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Button, Card, Form, Input } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

interface DynamicInputGroupProp {
    formRef: React.RefObject<FormInstance<any>>,
    title: string,
    data: any[],
    handleAdd: () => any,
    handleRemove: (index: number) => any,
}

class DynamicInputGroup extends React.Component<DynamicInputGroupProp, {}> {

    handleAdd = () => {
        this.props.handleAdd();
        this.props.data.forEach((item: any, idx: number) => {
            for(let [key, value] of Object.entries(item)){
                this.props.formRef.current?.setFields([
                    {
                        name: `${key}-${idx}`,
                        value: value,
                    }
                ])
            }
        });
    };

    handleRemove = (index: number) => {
        this.props.data.splice(index, 1);
        this.props.data.forEach((item: any, idx: number) => {
            for(let [key, value] of Object.entries(item)){
                this.props.formRef.current?.setFields([
                    {
                        name: `${key}-${idx}`,
                        value: value,
                    }
                ]);
            }
        });
        this.props.handleRemove(index);
    };

    handleChange = (index: number, idx: number, name: string) => {
        let value = this.props.formRef.current?.getFieldValue(`${name}-${index}`);
        this.props.data[index][name] = value;
    };

    render() {
        return (
            <Card
                title={this.props?.title}
                extra={<Button type="primary" shape='circle' onClick={this.handleAdd} icon={<PlusOutlined />} />}
                style={{marginLeft: 50}}
            >
                {
                    this.props.data?.map((item: any, index: number) => {
                        return(
                            <Input.Group compact key={index}>
                                <Button danger icon={<MinusOutlined />} style={{marginRight: 10}} onClick={() => this.handleRemove(index)} />
                                {
                                    Object.entries(item).map((entry: [string, any], idx: number) => {
                                        return (
                                            <Form.Item name={`${entry[0]}-${index}`} initialValue={entry[1]} key={idx}>
                                                <Input addonBefore={entry[0]} onChange={() => this.handleChange(index, idx, `${entry[0]}`)} />
                                            </Form.Item>
                                        );
                                    })
                                }
                            </Input.Group>
                        );
                    })
                }
            </Card>
        );
    }
}

export default DynamicInputGroup;