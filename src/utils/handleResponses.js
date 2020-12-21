import constants from 'common/constants';

const { ResponseCodes } = constants;

export default function handleResponse(res, data) {
  return res.status(200).json({
    code: ResponseCodes.SUCCESS,
    message: 'OK',
    data: data || null,
  });
}
