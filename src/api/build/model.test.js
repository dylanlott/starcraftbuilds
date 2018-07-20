import { Build } from '.'
import { User } from '../user'

let user, build

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  build = await Build.create({ user, title: 'test', description: 'test', steps: 'test', comments: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = build.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(build.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(build.title)
    expect(view.description).toBe(build.description)
    expect(view.steps).toBe(build.steps)
    expect(view.comments).toBe(build.comments)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = build.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(build.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(build.title)
    expect(view.description).toBe(build.description)
    expect(view.steps).toBe(build.steps)
    expect(view.comments).toBe(build.comments)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
