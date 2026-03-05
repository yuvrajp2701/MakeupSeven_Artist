export const BASE_URL = 'http://31.97.227.127:5001/api/v1';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions {
    method?: RequestMethod;
    body?: any;
    token?: string;
    queryParams?: Record<string, string | number>;
}

export const apiCall = async (endpoint: string, options: ApiRequestOptions = {}) => {
    const { method = 'GET', body, token, queryParams } = options;

    let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    // Clean up double slashes if any (except for http://)
    url = url.replace(/([^:]\/)\/+/g, "$1");

    if (queryParams) {
        const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');
        url += `?${queryString}`;
    }

    const headers: any = {};

    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log(`API Call: ${method} ${url}`);

        const response = await fetch(url, {
            method,
            headers,
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
        });

        const text = await response.text();

        if (!response.ok) {
            console.error(`API Error [${response.status}] for [${url}]:`, text.substring(0, 500));
            let errorData;
            try {
                errorData = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server error (${response.status}): ${text.substring(0, 50)}...`);
            }
            throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
        }

        try {
            const responseData = JSON.parse(text);
            console.log(`API Response [${endpoint}]:`, JSON.stringify(responseData, null, 2));
            return responseData;
        } catch (e) {
            console.error('API Response was not JSON:', text.substring(0, 200));
            throw new Error(`Invalid JSON response from server: ${text.substring(0, 50)}...`);
        }
    } catch (error) {
        console.error('API Call Failed:', error);
        throw error;
    }
};
