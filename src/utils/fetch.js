const {server} = require('./globals');

async function fetchGet (route) {

    const response = await fetch(`${server}${route}`, {
        method: 'GET',
        headers: {Authorization: 'Bearer '  + localStorage.getItem("token")}
    });

    return await response.json();

}

async function fetchBody (route, method, data) {

    const response = await fetch(`${server}${route}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer '  + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    });

    const responseReceived = await response.json();

    return responseReceived;

}

async function fetchFormData (route, method, data) {

    const response = await fetch(`${server}${route}`, {
        method: method,
        headers: {
            Authorization: 'Bearer '  + localStorage.getItem("token")
        },
        body: data
    });

    const responseReceived = await response.json();

    return responseReceived;

}

module.exports = { fetchGet, fetchBody, fetchFormData }