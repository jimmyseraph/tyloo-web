import Axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

export default function Request(config: AxiosRequestConfig, callback: (res : any) => any, pathParams? : any) {
    let url: string|undefined = config.url;
    if(pathParams != null){
        if(Object.keys(pathParams).length && url !== undefined){
            for(let key in pathParams){
                let reg = new RegExp(`{${key}}`);
                url = url?.replace(reg, pathParams[key]);
            }
        }
    }

    config.url = url;
    Axios(config)
    .then(res => {
        console.log(res.status);
        if(res.data.code !== 1000){
            toast(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            callback(res);
        }
    }).catch(err => {
        toast('request error', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        console.log(err);
    })
}