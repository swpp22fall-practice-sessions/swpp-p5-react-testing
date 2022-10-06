import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getMockStore } from '../../test-utils/mocks';
import TodoDetail from './TodoDetail';

describe('<TodoDetail />', () => {
  const store = getMockStore();
  it('should render without error', () => {
    render(
      <Provider store={store}>
        <TodoDetail />
      </Provider>
    );
  });
});
