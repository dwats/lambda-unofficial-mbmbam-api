const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

module.exports = {
  success: (body = {}, code = 200) => ({
      statusCode: code,
      headers: responseHeaders,
      body: JSON.stringify(body)
    }),
  error: (err) => ({
    statusCode: err.code || 500,
    headers: responseHeaders,
    body: JSON.stringify(err)
  })
}

