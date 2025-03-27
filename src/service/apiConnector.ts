import axios from "axios";

// making axiosInstance
export const axiosInstance = axios.create({});

// apiConnectorTypes
// interface apiConnectorParams {
//     method: Method,
//     url: string,
//     bodyData?: Record<string, any>; // Optional body data for POST/PUT requests
//     headers?: Record<string, string>; // Optional headers
//     params?: Record<string, any>; // Optional query parameters
// }

// apiConnector
export const apiConnector = (method: string, url:string,bodyData?:Record<string,any>,headers?:Record<string,string>,params?:Record<string,any>)=> {
    const config = {
        method: method,
        url: url,
        data: bodyData ? bodyData : undefined,
        headers: headers ? headers : undefined,
        params: params ? params : undefined
    }
    return axiosInstance(config)
}
