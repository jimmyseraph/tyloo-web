import Mock from 'mockjs';
import { userLogin } from '../api/ApiConfig';

const userLoginMock = Mock.mock(new RegExp(userLogin.path), userLogin.method, function(option: any) {
    let response;
    const reqBody = JSON.parse(option.body);

    if(reqBody.email === 'liudao@163.com' && reqBody.password === '123456'){
        response = {
            code: 1000,
            message: 'Login Success',
            data: {
                username: 'liudao',
                token: 'mock token',
            }
        };
    } else {
        response = {
            code: 2000,
            message: 'Login Failed',
        };
    }
    return response;
});

export {
    userLoginMock,
}