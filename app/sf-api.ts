import axios from "axios";

const getApiInstance = () => {
    const token = process.env.SF_INSTANCE_TOKEN;

    const instanceUrl = process.env.INSTANCE;

    console.log(`Instance: ${instanceUrl}`);

    const api = axios.create({
        baseURL: instanceUrl,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return api;
};

export const query = (soql: string) => {
    console.log(`Queried: ${soql}`);

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
    console.log(`Inserted: ${sobjectName}`);

    return getApiInstance()
        .post(`/services/data/v55.0/sobjects/${sobjectName}`, body)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error.response.data);
        });
};

export type MassInsertedResult = {
    hasErrors: boolean;
    results: {
        referenceId: string;
        id: string;
        errors: any[];
    }[];
};

export const massInsert: (
    sobjectName: string,
    body: any
) => Promise<MassInsertedResult | void> = (sobjectName, body) => {
    console.log(`Inserted: ${sobjectName}`);

    return getApiInstance()
        .post(`/services/data/v55.0/composite/tree/${sobjectName}`, {
            records: body,
        })
        .then((res) => {
            return res.data as MassInsertedResult;
        })
        .catch((error) => {
            console.log(JSON.stringify(error.response.data));
        });
};
