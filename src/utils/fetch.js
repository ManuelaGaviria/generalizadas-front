const { server } = require('./globals');

async function fetchGet(route) {

    const response = await fetch(`${server}${route}`, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
    });

    return await response.json();

}

async function fetchBody(route, method, data) {

    const response = await fetch(`${server}${route}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    });

    const responseReceived = await response.json();

    return responseReceived;

}

async function fetchFormData(route, method, data) {

    const response = await fetch(`${server}${route}`, {
        method: method,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
        body: data
    });

    const responseReceived = await response.json();

    return responseReceived;

}

async function fetchText(route, method = 'GET') {
    const response = await fetch(`${server}${route}`, {
        method,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    const text = await response.text();     // <-- importante
    if (!response.ok) throw new Error(text || response.statusText);
    return text;
}

module.exports = { fetchGet, fetchBody, fetchFormData, fetchText}