import Mock from 'mockjs';
import { projectList, projectAdd, projectModify, projectRemove, projectDetail, caseSuiteUpdate } from '../api/ApiConfig';

const projectData: any[] = [];
for(let i: number = 0; i < 25; i++){
    projectData.push({
        projectId: i,
        projectName: `project-${i}`,
        description: `API自动化测试项目-${i}`,
        status: Mock.Random.pick(['Pass', 'Fail', 'Running', 'Ready']),
    });
}

const caseData: any[] = [];
for(let i: number = 0; i < 25; i++){
    caseData.push({
        caseId: i,
        caseName: `testcase-${i}`,
        description: `API自动化测试用例-${i}`,
        status: Mock.Random.pick(['Initial', 'Pass', 'Fail', 'Block']),
    })
}

const detailData: any[] = [];
for(let i: number = 0; i < 25; i++){
    detailData.push({
        ...projectData[i],
        caseList: [
            caseData[0],
            caseData[1],
            caseData[2],
        ]
    });
}

const projectListMock = Mock.mock(new RegExp(projectList.path), projectList.method, (option: any) => {
    return ({
        code: 1000,
        message: 'success',
        data: projectData,
    });
});

const projectAddMock = Mock.mock(new RegExp(projectAdd.path), projectAdd.method, (option: any) => {
    let data = JSON.parse(option.body);
    projectData.push({
        projectId: projectData.length,
        projectName: data.projectName,
        description: data.description,
        status: 'Ready',
    });
    return({
        code: 1000,
        message: 'success',
        data: null,
    });
});

const projectModifyMock = Mock.mock(new RegExp(projectModify.path), projectModify.method, (option: any) => {
    let data = JSON.parse(option.body);
    projectData[data.projectId].projectName = data.projectName;
    projectData[data.projectId].description = data.description;
    return({
        code: 1000,
        message: 'success',
        data: null,
    });
});

const projectRemoveMock = Mock.mock(new RegExp("/api/project/\\w+/remove"), projectRemove.method, (option: any) => {
    let url: string = option.url;
    let key = url.match(new RegExp("project/\\w+/remove"));
    if(key != null){
        let values: string[] = key[0].split("/");
        projectData.splice(parseInt(values[1]), 1);
    }
    return (
        {
            code: 1000,
            message: 'success',
            data: null,
        }
    );
});

const projectDetailMock = Mock.mock(new RegExp("/api/project/\\w+/detail"), projectDetail.method, (option: any) => {
    let url: string = option.url;
    let key = url.match(new RegExp("project/\\w+/detail"));
    let projectDetailInfo: any;
    if(key != null){
        let values: string[] = key[0].split("/");
        projectDetailInfo = detailData.find((project) => {
            return project.projectId === parseInt(values[1]);
        });
    }
    return({
        code: 1000,
        message: 'success',
        data: projectDetailInfo,
    });
});

const caseSuiteUpdateMock = Mock.mock(new RegExp("/api/suite/\\w+/update"), caseSuiteUpdate.method, (option: any) => {
    let url: string = option.url;
    let key = url.match(new RegExp("suite/\\w+/update"));
    let data = JSON.parse(option.body);
    
    if(key != null){
        let values: string[] = key[0].split("/");
        let i: number = parseInt(values[1]);
        detailData[i].caseList = [];
        data.forEach((item: number, index: number) => {
            detailData[i].caseList.push(caseData[item]);
        });
    }
    return({
        code: 1000,
        message: 'success',
        data: null,
    });
});

export {
    projectListMock,
    projectAddMock,
    projectModifyMock,
    projectRemoveMock,
    projectDetailMock,
    caseSuiteUpdateMock,
}