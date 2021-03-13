import Mock from 'mockjs';
import { getReport, getExecDetail } from '../api/ApiConfig';
import { CaseRecord, ReportData } from '../pages/report/Report';

const caseListData: CaseRecord[] = [];
for(let i = 1; i <= 25; i++){
    caseListData.push({
        caseId: i,
        caseName: `DemoCase-${i}`,
        description: `Mock演示用的测试案例${i}`,
        duration: 500,
        status: Mock.Random.pick(['Pass', 'Fail', 'Block']),
    });
}

const projectData: ReportData = {
    projectId: 1,
    projectName: 'Demo Project',
    description: 'Mock演示用的测试项目，请在开发完成后删除',
    startTime: new Date().toLocaleString(),
    status: Mock.Random.pick(['Pass', 'Fail']),
    caseList: caseListData,
}

const execCaseDetailData = {
    caseId: 1,
    projectId: 1,
    requestHeaders: "[Content-Type: application/json; charset=utf-8]",
    url: 'http://www.baidu.com/a/b',
    method: 'POST',
    requestBody: '{"username": "liudao", "password":"123456"}',
    responseHeaders: '[Content-Type: application/json; charset=utf-8]',
    responseBody: '{"code": 1, "message": "success", "data": "hello world"}',
    status: "Pass",
    message: '[expected: 1, op: eq, actual: code() -> true]',
    duration: 50,
    startTime: "2021-3-12 12:12:12",
};

const getReportMock = Mock.mock(new RegExp("/api/report/\\w+/query"), getReport.method, (option: any) => {
    return ({
        code: 1000,
        message: 'success',
        data: projectData,
    });
});

const getExecDetailMock = Mock.mock(new RegExp(getExecDetail.path), getExecDetail.method, (option: any) => {
    return ({
        code: 1000,
        message: "success",
        data: execCaseDetailData,
    });
});

export {
    getReportMock,
    getExecDetailMock,
}
