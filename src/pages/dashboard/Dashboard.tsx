import React from 'react';
import { PageHeader, Row, Col, Card, Statistic } from 'antd';
import Request from '../../utils/Request';
import { caseTotal, casePassPercent, caseCoverageOvertime, bugOvertime } from '../../api/ApiConfig';
import { Chart, Axis, Line, Point, Interval } from 'bizcharts';

interface DashboardState {
    caseTotal: number,
    casePassPercent: number,
    caseCoverageOvertime: [],
    bugOvertime: [],
};

class Dashboard extends React.Component<{}, DashboardState>{

    componentDidMount(){
        // 调用获取case总数量接口
        Request({
            url: caseTotal.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            }
        }, (res) => {
            this.setState({
                caseTotal: res.data.data,
            })
        });
        // 调用获取case总通过率接口
        Request({
            url: casePassPercent.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            }
        }, (res) => {
            this.setState({
                casePassPercent: res.data.data,
            })
        });
        // 调用获取case覆盖率接口
        Request({
            url: caseCoverageOvertime.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            }
        }, (res) => {
            this.setState({
                caseCoverageOvertime: res.data.data,
            })
        });
        // 调用获取bug趋势接口
        Request({
            url: bugOvertime.path,
            method: 'get',
            headers: {
                "Access-Token": sessionStorage.getItem("token"),
            }
        }, (res) => {
            this.setState({
                bugOvertime: res.data.data,
            })
        });
    }

    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    }

    render(){
        console.log(this.state);
        const caseTotal = this.state == null ? 0 : this.state.caseTotal;
        const cassPassPercent = this.state == null ? 0 : this.state.casePassPercent;
        const caseCoverageOvertime = this.state == null ? [] : this.state.caseCoverageOvertime;
        const bugOvertime = this.state == null ? [] : this.state.bugOvertime;
        const coverageScale = {
            coverage: {
                alias: '覆盖率',
                type: 'linear',
                min: 0,
                max: 100,
            },
        };
        const bugScale = {
            bugs: {
                alias: '缺陷数',
                type: 'linear',
                min: 0,
            },
        };
        return(
            <div>
                <PageHeader title='Dashboard' />
                <Row gutter={[16, 24]} justify="center">
                    <Col span={10}>
                        <Card>
                            <Statistic title='总案例数量' value={caseTotal} />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card>
                            <Statistic title='总通过率' value={cassPassPercent} precision={2} suffix={'%'} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 24]} justify="center">
                    <Col span={10}>
                        <Card>
                            <Chart scale={coverageScale} height={300} autoFit data={caseCoverageOvertime}>
                                <Axis name="coverage" title={true} />
                                <Line position='date*coverage' shape='smooth' label='coverage' />
                                <Point position='date*coverage' />
                            </Chart>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Chart scale={bugScale} height={300} autoFit data={bugOvertime}>
                            <Axis name="bugs" title={true} />
                            <Interval position='date*bugs' label='bugs' />
                        </Chart>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;