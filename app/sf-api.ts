import axios from "axios";

const getApiInstance = () => {
    const token = process.env.SF_INSTANCE_TOKEN;

    const instanceUrl = process.env.INSTANCE;

    console.log(instanceUrl);

    const api = axios.create({
        baseURL: instanceUrl,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return api;
};

export const query = (soql: string) => {
    return getApiInstance()
        .get("/services/data/v55.0/query", {
            params: {
                q: soql,
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error.response.data);
        });
};

export const insert = (sobjectName: string, body: any) => {
    return getApiInstance()
        .post(`/services/data/v55.0/sobjects/${sobjectName}`, body)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error.response.data);
        });
};
