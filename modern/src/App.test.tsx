// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
beforeEach(() => { localStorage.clear(); window.scrollTo = () => {} })
afterEach(cleanup)
describe('Life100 app', () => {
  it('creates a note and persists its Markdown', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', {name:/^Notes$/}))
    fireEvent.click(screen.getByRole('button', {name:/^New$/}))
    fireEvent.change(screen.getByLabelText('Title'), {target:{value:'Study note'}})
    fireEvent.change(screen.getByLabelText('Markdown'), {target:{value:'Learning React'}})
    expect(screen.getByText('Learning React', {selector:'p'})).toBeTruthy()
    expect(localStorage.getItem('life100-react-v1')).toContain('Learning React')
  })
})
