import Mock from 'mockjs';
import { bugOvertime } from '../api/ApiConfig';

const bugOvertimeMock = Mock.mock(new RegExp(bugOvertime.path), bugOvertime.method, (option: any) => {
    return (
        {
            code: 1000,
            message: 'success',
            data: [
                {
                    date: '2020-12-01',
                    bugs: 45,
                },
                {
                    date: '2020-12-02',
                    bugs: 55,
                },
                {
                    date: '2020-12-03',
                    bugs: 32,
                },
                {
                    date: '2020-12-04',
                    bugs: 21,
                },
                {
                    date: '2020-12-05',
                    bugs: 36,
                },
            ]
        }
    );
});

export {
    bugOvertimeMock,
}