
const userLogin = {
    path: '/api/account/login',
    method: 'post',
};

const caseTotal = {
    path: '/api/case/total',
    method: 'get',
};

const casePassPercent = {
    path: '/api/case/pass',
    method: 'get',
};

const caseCoverageOvertime = {
    path: '/api/case/coverage_overtime',
    method: 'get',
};

const bugOvertime = {
    path: '/api/bug/overtime',
    method: 'get',
};

const caseList = {
    path: '/api/case/list',
    method: 'get',
};

const caseAdd = {
    path: '/api/case/add',
    method: 'post',
};

const caseModify = {
    path: '/api/case/modify',
    method: 'post',
};

const caseRemove = {
    path: '/api/case/{id}/remove',
    method: 'delete',
};

const projectList = {
    path: '/api/project/list',
    method: 'get',
};

const projectAdd = {
    path: '/api/project/add',
    method: 'post',
};

const projectModify = {
    path: '/api/project/modify',
    method: 'post',
};

const projectRemove = {
    path: '/api/project/{id}/remove',
    method: 'delete',
};

const projectDetail = {
    path: '/api/project/{id}/detail',
    method: 'get',
};

const caseSuiteUpdate = {
    path: '/api/suite/{projectId}/update',
    method: 'post',
}

export {
    userLogin,
    caseTotal,
    casePassPercent,
    caseCoverageOvertime,
    bugOvertime,
    caseList,
    caseAdd,
    caseModify,
    caseRemove,
    projectList,
    projectAdd,
    projectModify,
    projectRemove,
    projectDetail,
    caseSuiteUpdate,
}