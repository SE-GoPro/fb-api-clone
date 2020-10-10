import User from 'models/User';
// import Token from 'models/Token';
import { ExistedUserError } from 'common/errors';
import { hashPassword } from 'utils/commonUtils';
import handleResponse from 'utils/handleResponses';

export default {
  signup: async (req, res, next) => {
    const { phonenumber, password } = req.body;
    // TODO: may use validator libraries
    try {
      const exUser = await User.findOne({ where: { phonenumber } });
      if (exUser) throw new ExistedUserError();

      const hash = await hashPassword(password);

      await User.create({
        phonenumber,
        password: hash,
        name: phonenumber,
      });
      return handleResponse(res);
    } catch (e) {
      return next(e);
    }
  },
  // login: (req, res, next) => {

  // },
  // logout: (req, res, next) => {

  // },
};
