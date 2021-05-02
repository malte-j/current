import {validateEmail, validateUsername} from './User';

describe('Verify User validators', () => {
  it('tests a valid name', () => {
    let isValid = validateUsername('hello123')
    expect(isValid).toBe(true)
  })
  it('tests an invalid name', () => {
    let isValid = validateUsername('s')
    expect(isValid).toBe(false)
  })

  it('tests annother invalid name', () => {
    let isValid = validateUsername('_wes123')
    expect(isValid).toBe(false)
  })
})

describe('Verify Email', () => {
  it('tests a valid email', () => {
    let isValid = validateEmail('hello123@example.com')
    expect(isValid).toBe(true)
  })
  it('tests an invalid name', () => {
    let isValid = validateEmail('s')
    expect(isValid).toBe(false)
  })

  it('tests annother invalid name', () => {
    let isValid = validateUsername('')
    expect(isValid).toBe(false)
  })
})