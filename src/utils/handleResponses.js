export default function handleResponse(res, data) {
  return res.status(200).json({
    code: '1000',
    message: 'OK',
    data: data || null,
  });
}
