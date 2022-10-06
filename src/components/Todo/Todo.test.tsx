import Todo from './Todo';
import { render, screen } from '@testing-library/react';

describe('<Todo />', () => {
    it('should render done mark when done is false', () => {
        render(<Todo title={'TODO_TITLE'} done={false}/>)
        const title = screen.getByText('TODO_TITLE')
        expect(title.classList.contains('done')).toBe(false)
        screen.getByText('Done')
    })

    it('should render undone mark when done is true', () => {
        render(<Todo title={'TODO_TITLE'} done={true}/>)
        const title = screen.getByText('TODO_TITLE')
        expect(title.classList.contains('done')).toBe(true)
        screen.getByText('Undone')
    })
})