import express from 'express'
import { FollowRequestController } from '../controllers/follow-request-controller';
import { UserController } from '../controllers/user-controller'


export default function UserRouter(
    userController: UserController,
    followRequestController: FollowRequestController,
) {
    const router = express.Router()
    router.route('/')
        .post([userController.createUser.bind(userController)]);
    router.route('/:userId/follow-requests')
        .get([followRequestController.getFollowRequests.bind(followRequestController)])
        .post([followRequestController.createFollowRequest.bind(followRequestController)]);  
    router.route('/:userId/follow-requests/:requestId')
        .patch([followRequestController.updateFollowRequest.bind(followRequestController)]);

        
    return router
}