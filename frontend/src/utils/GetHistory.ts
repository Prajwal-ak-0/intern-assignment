export const GetHistory = async () => {
    const response = await fetch('http://localhost:5000/history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}