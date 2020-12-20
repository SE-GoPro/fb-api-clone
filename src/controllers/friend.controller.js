import { NoDataError, NotAccessError } from 'common/errors';
import Friend from 'models/Friend';
import User from 'models/User';
import { Op } from 'sequelize';
import asyncHandler from 'utils/asyncHandler';
import { getUNIXSeconds } from 'utils/commonUtils';
import handleResponse from 'utils/handleResponses';

function getFriendIds(accountId, friends) {
  return friends
    .filter(rela => rela.requester_id === accountId || rela.requestee_id === accountId)
    .map(rela => (rela.requester_id === accountId ? rela.requestee_id : rela.requester_id));
}

function countMutualFriends(lFriends1, lFriends2) {
  return lFriends1.filter(v => lFriends2.includes(v)).length;
}

function formatRequest(request, requesters, mutualFriendsCount) {
  const requester = requesters.find(requester => request.requester_id === requester.id);
  return {
    id: request.id,
    username: requester.name,
    avatar: requester.avatar_url,
    same_friends: String(mutualFriendsCount),
    created: getUNIXSeconds(request.created),
  };
}

export default {
  getRequestedFriends: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const [requests, total] = await Promise.all([
      Friend.findAll({
        where: { requestee_id: userId, status: 'pending' },
        attributes: ['id', 'requester_id', 'created'],
        order: [['created', 'desc']],
        limit: count,
        offset: index,
      }),
      Friend.count({ where: { requestee_id: userId, status: 'pending' } }),
    ]);

    if (total === 0) throw new NoDataError();

    const requesterIds = requests.map(request => request.requester_id);
    const userIds = [userId, ...requesterIds];

    const friends = await Friend.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { requester_id: { [Op.in]: userIds } },
              { requestee_id: { [Op.in]: userIds } },
            ],
          },
          { status: 'accepted' },
        ],
      },
      attributes: ['requester_id', 'requestee_id'],
    });

    const userFriendIds = getFriendIds(userId, friends);
    const requesters = await User.findAll({
      where: { id: { [Op.in]: requesterIds } },
      attributes: ['id', 'name', 'avatar_url'],
    });

    const request = requests.map(request => {
      const requesterFriendIds = getFriendIds(request.requester_id, friends);
      const mutualFriendsCount = countMutualFriends(userFriendIds, requesterFriendIds);
      return formatRequest(request, requesters, mutualFriendsCount);
    });

    return handleResponse(res, {
      request,
      total: String(total),
    });
  }),
};
