
const serviceToken = generateServiceToken()
const response = await axios.get(`${process.env.API_GATEWAY_URL}/admin/get-accounts`, {
headers: { Authorization: `Bearer ${serviceToken}` }
})