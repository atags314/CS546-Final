const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const groupData = data.groups;
const xss = require('xss');

router.get('/', async (req, res) => {
    const userId = req.session.user.userId;
    let user = {};
    let group = {};
    let exist = false;
    
    try {
        user = await userData.get(userId);
        const group_id = user.group_id;
        group = await groupData.get(group_id);
        exist = true;
    } catch (e) {
        //console.log(e);
    }

    if (exist) {
        res.render('group', {
            group: group,
            name: group.name,
            ltg: group.ltg,
            members: group.members,
            announcements: group.announcements

        });
    } else {
        res.render('group', {
            noGroup: true
        });
    }
});

router.get('/showAllGroups', async (req, res) => {
    let groupList = [];
    let exist = false;

    try {
        groupList = await groupData.getAll();
        exist = true;
    } catch (e) {
        console.log(e);
    }

    if (exist) {
        res.render('allGroups', {
            groupList: groupList
        });
    } else {
        res.render('group', {
            noGroup: true
        });
    }
});

router.patch('/showAllGroups', async (req, res) => {
    let group_id = xss(req.body['group_id']);
    const userId = req.session.user.userId;
    let user = {};
    
    try {
        user = await userData.get(userId);
        const oldGroup_id = user.group_id;
        if (oldGroup_id != '') {
            await groupData.removeUserFromGroup(oldGroup_id, userId);
        }
        await groupData.addUserToGroup(group_id, userId);
        await userData.updateGroup(userId,group_id);
        res.redirect('/group');
    } catch (e) {
        res.render('allGroups');
    }
});

module.exports = router;