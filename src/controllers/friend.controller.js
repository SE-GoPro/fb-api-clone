import constants from 'common/constants';
import {
  AlreadyDoneActionError,
  InvalidMethodError,
  NoDataError,
  NotAccessError,
  NotValidatedUserError,
} from 'common/errors';
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

function formatRelation(friendId, rela, friendsInfo, mutualFriendsCount) {
  const friendInfo = friendsInfo.find(friend => friendId === friend.id);
  return {
    id: rela.id,
    username: friendInfo.name,
    avatar: friendInfo.avatar_url,
    same_friends: String(mutualFriendsCount),
    created: getUNIXSeconds(rela.accepted),
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

  getUserFriends: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const userFriends = await Friend.findAll({
      where: {
        [Op.and]: [
          { [Op.or]: [{ requestee_id: userId }, { requester_id: userId }] },
          { status: 'accepted' },
        ],
      },
      attributes: ['id', 'requester_id', 'requestee_id', 'accepted'],
      order: [['accepted', 'desc']],
    });

    const total = userFriends.length;
    if (total === 0) throw new NoDataError();

    const userFriendIds = getFriendIds(userId, userFriends);
    const paginatedList = userFriends.slice(index, count);
    const listedFriendIds = paginatedList
      .map(rela => (rela.requester_id === userId ? rela.requestee_id : rela.requester_id));

    const friendRelations = await Friend.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { requester_id: { [Op.in]: listedFriendIds } },
              { requestee_id: { [Op.in]: listedFriendIds } },
            ],
          },
          { status: 'accepted' },
        ],
      },
      attributes: ['requester_id', 'requestee_id'],
    });

    const friendsInfo = await User.findAll({
      where: { id: { [Op.in]: listedFriendIds } },
      attributes: ['id', 'name', 'avatar_url'],
    });

    const friends = paginatedList.map(rela => {
      const friendId = rela.requester_id === userId ? rela.requestee_id : rela.requester_id;
      const friendRelationIds = getFriendIds(friendId, friendRelations);
      const mutualFriendsCount = countMutualFriends(userFriendIds, friendRelationIds);
      return formatRelation(friendId, rela, friendsInfo, mutualFriendsCount);
    });

    return handleResponse(res, {
      friends,
      total: String(total),
    });
  }),

  setAcceptFriend: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const friendId = req.query.user_id;
    const isAccept = parseInt(req.query.is_accept, 10) === 1;
    const status = isAccept ? 'accepted' : 'denied';

    const friendInfo = await User.findOne({ where: { id: friendId } });
    if (!friendInfo || friendInfo.is_blocked) throw new NotValidatedUserError();

    const request = await Friend.findOne({
      where: { requester_id: friendId, requestee_id: userId, status: 'pending' },
    });
    if (request) {
      if (request.status === 'pending') {
        await Friend.update({
          status, accepted: isAccept ? Date.now() : null,
        }, {
          where: { id: request.id },
        });
      } else throw new AlreadyDoneActionError();
    } else {
      await Friend.create({
        requester_id: friendId,
        requestee_id: userId,
        status,
        accepted: isAccept ? Date.now() : null,
      });
    }

    return handleResponse(res);
  }),

  getListSuggestedFriends: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const suggestedFriends = await Friend.getSuggestedFriends(userId, index, count);
    if (suggestedFriends.length === 0) throw new NoDataError();
    const userIds = [userId, ...suggestedFriends.map(info => info.user_id)];

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
    const listUsers = suggestedFriends.map(user => {
      const friendIds = getFriendIds(user.user_id, friends);
      const mutualFriendsCount = countMutualFriends(userFriendIds, friendIds);
      return {
        ...user,
        same_friends: String(mutualFriendsCount),
      };
    });

    return handleResponse(res, { list_users: listUsers });
  }),

  setRequestFriend: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const { user_id: requesteeId } = req.query;
    if (String(userId) === String(requesteeId)) throw new InvalidMethodError();

    const userRelations = await Friend.findAll({
      where: {
        [Op.or]: [
          { requester_id: userId },
          { requestee_id: userId },
        ],
      },
    });

    const userFriendsCount = userRelations.filter(rela => rela.status === 'accepted').length;
    if (userFriendsCount === constants.MAX_FRIENDS) throw new NoDataError();

    const userRequests = userRelations.filter(rela => rela.requester_id === userId);

    const oldRequest = userRequests.find(rela => rela.requestee_id === requesteeId);
    let totalPendingRequests = userRequests.filter(rela => rela.status === 'pending').length;
    if (oldRequest) {
      if (oldRequest.status === 'pending') {
        await Friend.update({ status: 'undo' }, { where: { id: oldRequest.id } });
        totalPendingRequests -= 1;
      } else if (oldRequest.status === 'undo') {
        await Friend.update({ status: 'pending', created: Date.now() }, { where: { id: oldRequest.id } });
        totalPendingRequests += 1;
      } else throw new NoDataError();
    } else {
      await Friend.create({ requester_id: userId, requestee_id: requesteeId });
      totalPendingRequests += 1;
    }
    return handleResponse(res, { requested_friends: String(totalPendingRequests) });
  }),
};
