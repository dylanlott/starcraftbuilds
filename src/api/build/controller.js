import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Build } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Build.create({ ...body, user })
    .then((build) => build.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Build.count(query)
    .then(count => Build.find(query, select, cursor)
      .populate('user')
      .then((builds) => ({
        count,
        rows: builds.map((build) => build.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Build.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((build) => build ? build.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Build.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((build) => build ? Object.assign(build, body).save() : null)
    .then((build) => build ? build.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Build.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((build) => build ? build.remove() : null)
    .then(success(res, 204))
    .catch(next)
