import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Build, { schema } from './model'

const router = new Router()
const { title, description, steps, comments } = schema.tree

/**
 * @api {post} /builds Create build
 * @apiName CreateBuild
 * @apiGroup Build
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Build's title.
 * @apiParam description Build's description.
 * @apiParam steps Build's steps.
 * @apiParam comments Build's comments.
 * @apiSuccess {Object} build Build's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Build not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, description, steps, comments }),
  create)

/**
 * @api {get} /builds Retrieve builds
 * @apiName RetrieveBuilds
 * @apiGroup Build
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of builds.
 * @apiSuccess {Object[]} rows List of builds.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /builds/:id Retrieve build
 * @apiName RetrieveBuild
 * @apiGroup Build
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} build Build's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Build not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /builds/:id Update build
 * @apiName UpdateBuild
 * @apiGroup Build
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Build's title.
 * @apiParam description Build's description.
 * @apiParam steps Build's steps.
 * @apiParam comments Build's comments.
 * @apiSuccess {Object} build Build's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Build not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, description, steps, comments }),
  update)

/**
 * @api {delete} /builds/:id Delete build
 * @apiName DeleteBuild
 * @apiGroup Build
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Build not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
