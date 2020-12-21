/**
 *
 * @param {Function} fn
 */
export default function asyncHandler(fn) {
  const wrapper = (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  return wrapper;
}
