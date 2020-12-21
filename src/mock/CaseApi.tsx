import Mock from 'mockjs';
import { caseTotal, casePassPercent, caseCoverageOvertime, caseList, caseAdd, caseModify, caseRemove } from '../api/ApiConfig';

const caseData: any[] = [];
for(let i: number = 0; i < 25; i++){
    caseData.push({
        caseId: i,
        caseName: `testcase-${i}`,
        description: `API自动化测试用例-${i}`,
        url: 'http://www.testops.vip',
        method: Mock.Random.pick(['GET', 'POST', 'DELETE', 'PUT']),
        headers: [
            {
                name: 'User-Agent',
                value: 'Chrome',
            },
            {
                name: 'Accept',
                value: '*/*',
            },
        ],
        body: '{"username": "liudao"}',
        assertions: [
            {
                actual: 'code()',
                op: 'eq',
                expected: '200'
            }
        ]
    })
}


const caseTotalMock = Mock.mock(new RegExp(caseTotal.path), caseTotal.method, (option: any) => {
    return (
        {
            code: 1000,
            message: 'success',
            data: 2756,
        }
    );
});

const casePassPercentMock = Mock.mock(new RegExp(casePassPercent.path), casePassPercent.method, (option: any) => {
    return (
        {
            code: 1000,
            message: 'success',
            data: 87.57,
        }
    );
});

const caseCoverageOvertimeMock = Mock.mock(new RegExp(caseCoverageOvertime.path), caseCoverageOvertime.method, (option: any) => {
    return (
        {
            code: 1000,
            message: "success",
            data: [
                {
                    date: '2020-12-01',
                    coverage: 74.1,
                },
                {
                    date: '2020-12-02',
                    coverage: 66.5,
                },
                {
                    date: '2020-12-03',
                    coverage: 71.8,
                },
                {
                    date: '2020-12-04',
                    coverage: 82.4,
                },
                {
                    date: '2020-12-05',
                    coverage: 90.7,
                },
            ]
        }
    );
});

const caseListMock = Mock.mock(new RegExp(caseList.path + '.*'), caseList.method, (option: any) => {
    let cases = caseData;
    let strs: string[] = option.url.split("?");
    if(strs.length === 2){
        let key = strs[1].split("=")[1];
        cases = cases.filter((item: any) => {
            return item.caseName.includes(key) || item.description.includes(key);
        });
    }
    return(
        {
            code: 1000,
            message: 'success',
            data: cases,
        }
    );
});

const caseAddMock = Mock.mock(new RegExp(caseAdd.path), caseAdd.method, (option: any) => {
    let data = JSON.parse(option.body);
    let id: number = caseData.length;
    caseData.push({
        caseId: id,
        caseName: data.caseName,
        description: data.description,
        url: data.url,
        method: data.method,
        headers: data.headers,
        body: data.body,
        assertions: data.assertions,
    });
    return (
        {
            code: 1000,
            message: 'success',
            data: null,
        }
    );
});

const caseRemoveMock = Mock.mock(new RegExp("/api/case/\\w+/remove"), caseRemove.method, (option: any) => {
    let url: string = option.url;
    let key = url.match(new RegExp("case/\\w+/remove"));
    if(key != null){
        let values: string[] = key[0].split("/");
        caseData.splice(parseInt(values[1]), 1);
    }
    return (
        {
            code: 1000,
            message: 'success',
            data: null,
        }
    );
});

const caseModifyMock = Mock.mock(new RegExp(caseModify.path), caseModify.method, (option: any) => {
    let data = JSON.parse(option.body);
    caseData[data.caseId] = {
        caseId: data.caseId,
        caseName: data.caseName,
        description: data.description,
        url: data.url,
        method: data.method,
        headers: data.headers,
        body: data.body,
        assertions: data.assertions,
    };
    return (
        {
            code: 1000,
            message: 'success',
            data: null,
        }
    );
});


export {
    caseTotalMock,
    casePassPercentMock,
    caseCoverageOvertimeMock,
    caseListMock,
    caseAddMock,
    caseRemoveMock,
    caseModifyMock,
}